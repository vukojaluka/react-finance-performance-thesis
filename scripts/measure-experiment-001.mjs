#!/usr/bin/env node
/**
 * Experiment 001 automated measurement harness.
 * Collects Lighthouse Navigation audits + Puppeteer Network/milestone samples
 * for variants v1|v2|v3|v3b under Mobile (M) and Desktop (D) profiles.
 */
import { mkdir, writeFile, readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import lighthouse from 'lighthouse'
import * as chromeLauncher from 'chrome-launcher'
import puppeteer from 'puppeteer-core'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const OUT = join(ROOT, 'docs/measurements/experiment-001')
const BASE = 'http://127.0.0.1:3000/experiments/experiment-001'
const VARIANTS = ['v1', 'v2', 'v3', 'v3b']
const LH_RUNS = Number(process.env.LH_RUNS || 3)
const NW_RUNS = Number(process.env.NW_RUNS || 3)
const CHROME_PATH = process.env.CHROME_PATH || '/usr/local/bin/google-chrome'

const PROFILES = {
  M: {
    id: 'M',
    formFactor: 'mobile',
    screenEmulation: {
      mobile: true,
      width: 412,
      height: 823,
      deviceScaleFactor: 1.75,
      disabled: false,
    },
    throttling: {
      rttMs: 150,
      throughputKbps: 1638.4,
      requestLatencyMs: 150 * 3.75,
      downloadThroughputKbps: 1638.4,
      uploadThroughputKbps: 675,
      cpuSlowdownMultiplier: 4,
    },
    viewport: { width: 412, height: 823, deviceScaleFactor: 1.75, isMobile: true },
    cpuRate: 4,
  },
  D: {
    id: 'D',
    formFactor: 'desktop',
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false,
    },
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      requestLatencyMs: 40 * 2.75,
      downloadThroughputKbps: 10240,
      uploadThroughputKbps: 10240,
      cpuSlowdownMultiplier: 1,
    },
    viewport: { width: 1350, height: 940, deviceScaleFactor: 1, isMobile: false },
    cpuRate: 1,
  },
}

function urlFor(variant) {
  return `${BASE}?variant=${variant}`
}

function mean(nums) {
  return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : null
}

function median(nums) {
  if (!nums.length) return null
  const s = [...nums].sort((a, b) => a - b)
  const mid = Math.floor(s.length / 2)
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2
}

function round(n, d = 0) {
  if (n == null || Number.isNaN(n)) return null
  const f = 10 ** d
  return Math.round(n * f) / f
}

async function ensureDirs() {
  for (const p of [
    join(OUT, 'lighthouse'),
    join(OUT, 'network'),
    join(OUT, 'raw'),
  ]) {
    await mkdir(p, { recursive: true })
  }
}

async function runLighthouseSample(chrome, profile, variant, runIndex) {
  const url = urlFor(variant)
  const id = `${profile.id}-LH-${variant.toUpperCase()}-${String(runIndex).padStart(2, '0')}`
  const result = await lighthouse(url, {
    port: chrome.port,
    output: ['json', 'html'],
    logLevel: 'error',
    onlyCategories: ['performance'],
    formFactor: profile.formFactor,
    screenEmulation: profile.screenEmulation,
    throttlingMethod: 'simulate',
    throttling: profile.throttling,
    disableStorageReset: false,
  })

  const lhr = result.lhr
  const audits = lhr.audits
  const row = {
    id,
    profile: profile.id,
    variant: variant.toUpperCase(),
    score: round((lhr.categories.performance?.score ?? 0) * 100),
    fcp: round(audits['first-contentful-paint']?.numericValue),
    lcp: round(audits['largest-contentful-paint']?.numericValue),
    lcpElement: audits['largest-contentful-paint-element']?.displayValue ?? null,
    cls: round(audits['cumulative-layout-shift']?.numericValue, 3),
    si: round(audits['speed-index']?.numericValue),
    tbt: round(audits['total-blocking-time']?.numericValue),
    tti: audits['interactive']?.numericValue != null
      ? round(audits['interactive'].numericValue)
      : null,
  }

  const jsonPath = join(OUT, 'lighthouse', `${id}.json`)
  const htmlPath = join(OUT, 'lighthouse', `${id}.html`)
  await writeFile(jsonPath, result.report[0])
  await writeFile(htmlPath, result.report[1])
  row.artifactPath = `docs/measurements/experiment-001/lighthouse/${id}.json`
  console.log(`  LH ${id}: score=${row.score} FCP=${row.fcp} LCP=${row.lcp} SI=${row.si} TBT=${row.tbt}`)
  return row
}

async function runNetworkSample(browser, profile, variant, runIndex) {
  const id = `${profile.id}-NW-${variant.toUpperCase()}-${String(runIndex).padStart(2, '0')}`
  const page = await browser.newPage()
  const client = await page.createCDPSession()
  await client.send('Network.enable')
  await client.send('Network.setCacheDisabled', { cacheDisabled: true })
  await client.send('Emulation.setCPUThrottlingRate', { rate: profile.cpuRate })
  // Approximate Lighthouse network throttle via CDP (DevTools-style)
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: profile.throttling.rttMs,
    downloadThroughput: (profile.throttling.throughputKbps * 1024) / 8,
    uploadThroughput: (profile.throttling.uploadThroughputKbps * 1024) / 8,
  })
  await page.setViewport(profile.viewport)

  const requests = []
  page.on('request', (req) => {
    requests.push({
      url: req.url(),
      method: req.method(),
      resourceType: req.resourceType(),
    })
  })

  const navStart = Date.now()
  await page.goto(urlFor(variant), { waitUntil: 'domcontentloaded', timeout: 120_000 })

  // Wait for dashboard complete (milestone F) or timeout
  await page.waitForFunction(
    () => document.querySelector('[data-exp-complete="true"]'),
    { timeout: 60_000 },
  )
  // Small settle for late marks
  await new Promise((r) => setTimeout(r, 300))

  const metrics = await page.evaluate(() => {
    const mark = (name) => {
      const entries = performance.getEntriesByName(name, 'mark')
      return entries.length ? entries[0].startTime : null
    }
    return {
      variant: document.querySelector('[data-exp-variant]')?.textContent?.trim() ?? null,
      complete: document.querySelector('[data-exp-complete]')?.getAttribute('data-exp-complete'),
      A: mark('exp-milestone-A'),
      B: mark('exp-milestone-B'),
      C: mark('exp-milestone-C'),
      D: mark('exp-milestone-D'),
      E: mark('exp-milestone-E'),
      F: mark('exp-milestone-F'),
      navigation: performance.getEntriesByType('navigation')[0]
        ? {
            responseStart: performance.getEntriesByType('navigation')[0].responseStart,
            responseEnd: performance.getEntriesByType('navigation')[0].responseEnd,
            domContentLoaded:
              performance.getEntriesByType('navigation')[0].domContentLoadedEventEnd,
            loadEventEnd: performance.getEntriesByType('navigation')[0].loadEventEnd,
          }
        : null,
    }
  })

  const elapsed = Date.now() - navStart
  const serverFn = requests.filter(
    (r) =>
      r.resourceType === 'fetch' ||
      r.resourceType === 'xhr' ||
      r.url.includes('/_server') ||
      r.url.includes('serverFn') ||
      r.url.includes('/_tanstack'),
  )
  const staticAssets = requests.filter((r) =>
    ['script', 'stylesheet', 'font', 'image'].includes(r.resourceType),
  )

  const row = {
    id,
    profile: profile.id,
    variant: variant.toUpperCase(),
    wallMs: elapsed,
    requestCount: requests.length,
    staticAssetCount: staticAssets.length,
    serverFunctionRequestCount: serverFn.length,
    serverFunctionUrls: [...new Set(serverFn.map((r) => r.url))],
    milestones: {
      A: round(metrics.A),
      B: round(metrics.B),
      C: round(metrics.C),
      D: round(metrics.D),
      E: round(metrics.E),
      F: round(metrics.F),
    },
    navigation: metrics.navigation,
    displayedVariant: metrics.variant,
    complete: metrics.complete,
  }

  await writeFile(join(OUT, 'network', `${id}.json`), JSON.stringify(row, null, 2))
  console.log(
    `  NW ${id}: A=${row.milestones.A} B=${row.milestones.B} C=${row.milestones.C} D=${row.milestones.D} E=${row.milestones.E} F=${row.milestones.F} reqs=${row.requestCount} sf=${row.serverFunctionRequestCount}`,
  )
  await page.close()
  return row
}

function summarize(rows, keyFn) {
  const groups = {}
  for (const row of rows) {
    const key = keyFn(row)
    ;(groups[key] ??= []).push(row)
  }
  const summary = {}
  for (const [key, items] of Object.entries(groups)) {
    const num = (getter) => {
      const vals = items.map(getter).filter((v) => v != null && !Number.isNaN(v))
      return { n: vals.length, mean: round(mean(vals)), median: round(median(vals)), values: vals }
    }
    summary[key] = items[0].score != null
      ? {
          score: num((r) => r.score),
          fcp: num((r) => r.fcp),
          lcp: num((r) => r.lcp),
          cls: num((r) => r.cls),
          si: num((r) => r.si),
          tbt: num((r) => r.tbt),
        }
      : {
          A: num((r) => r.milestones.A),
          B: num((r) => r.milestones.B),
          C: num((r) => r.milestones.C),
          D: num((r) => r.milestones.D),
          E: num((r) => r.milestones.E),
          F: num((r) => r.milestones.F),
          requestCount: num((r) => r.requestCount),
          serverFunctionRequestCount: num((r) => r.serverFunctionRequestCount),
        }
  }
  return summary
}

async function main() {
  await ensureDirs()
  const meta = {
    commit: process.env.GIT_COMMIT || null,
    startedAt: new Date().toISOString(),
    chromePath: CHROME_PATH,
    baseUrl: BASE,
    lhRuns: LH_RUNS,
    nwRuns: NW_RUNS,
    note: 'Automated cloud-agent session. Sample size reduced vs protocol n=10; methodology otherwise follows experiment-001-measurement-protocol.md.',
  }

  // Warm the server once
  console.log('Warming preview...')
  await fetch(urlFor('v3b')).then((r) => r.text())

  console.log(`\n=== Lighthouse (n=${LH_RUNS} per variant × profile) ===`)
  const chrome = await chromeLauncher.launch({
    chromePath: CHROME_PATH,
    chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
  })
  const lhRows = []
  try {
    for (const profile of Object.values(PROFILES)) {
      for (const variant of VARIANTS) {
        for (let i = 1; i <= LH_RUNS; i++) {
          lhRows.push(await runLighthouseSample(chrome, profile, variant, i))
        }
      }
    }
  } finally {
    await chrome.kill()
  }

  console.log(`\n=== Network / milestones (n=${NW_RUNS} per variant × profile) ===`)
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
  })
  const nwRows = []
  try {
    for (const profile of Object.values(PROFILES)) {
      for (const variant of VARIANTS) {
        for (let i = 1; i <= NW_RUNS; i++) {
          nwRows.push(await runNetworkSample(browser, profile, variant, i))
        }
      }
    }
  } finally {
    await browser.close()
  }

  const report = {
    meta: { ...meta, finishedAt: new Date().toISOString() },
    lighthouse: {
      samples: lhRows,
      summary: summarize(lhRows, (r) => `${r.profile}-${r.variant}`),
    },
    network: {
      samples: nwRows,
      summary: summarize(nwRows, (r) => `${r.profile}-${r.variant}`),
    },
  }

  await writeFile(join(OUT, 'raw', 'summary.json'), JSON.stringify(report, null, 2))
  console.log('\nWrote docs/measurements/experiment-001/raw/summary.json')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
