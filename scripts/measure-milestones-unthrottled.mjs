#!/usr/bin/env node
/**
 * Unthrottled milestone capture for Experiment 001.
 * Isolates artificial Server Function delay effects from network/CPU throttle.
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer-core'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'docs/measurements/experiment-001/network')
const BASE = 'http://127.0.0.1:3000/experiments/experiment-001'
const VARIANTS = ['v1', 'v2', 'v3', 'v3b']
const RUNS = Number(process.env.NW_RUNS || 3)
const CHROME = process.env.CHROME_PATH || '/usr/local/bin/google-chrome'

function round(n) {
  return n == null || Number.isNaN(n) ? null : Math.round(n)
}

function mean(vals) {
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null
}

async function sample(browser, variant, i) {
  const id = `U-NW-${variant.toUpperCase()}-${String(i).padStart(2, '0')}`
  const page = await browser.newPage()
  const client = await page.createCDPSession()
  await client.send('Network.enable')
  await client.send('Network.setCacheDisabled', { cacheDisabled: true })
  await page.setViewport({ width: 1350, height: 940, deviceScaleFactor: 1 })

  const requests = []
  page.on('request', (req) => {
    requests.push({ url: req.url(), type: req.resourceType(), method: req.method() })
  })

  await page.goto(`${BASE}?variant=${variant}`, {
    waitUntil: 'domcontentloaded',
    timeout: 120_000,
  })
  await page.waitForFunction(
    () => document.querySelector('[data-exp-complete="true"]'),
    { timeout: 60_000 },
  )
  await new Promise((r) => setTimeout(r, 200))

  const metrics = await page.evaluate(() => {
    const mark = (name) => {
      const e = performance.getEntriesByName(name, 'mark')
      return e.length ? e[0].startTime : null
    }
    return {
      variant: document.querySelector('[data-exp-variant]')?.textContent?.trim(),
      A: mark('exp-milestone-A'),
      B: mark('exp-milestone-B'),
      C: mark('exp-milestone-C'),
      D: mark('exp-milestone-D'),
      E: mark('exp-milestone-E'),
      F: mark('exp-milestone-F'),
    }
  })

  const rpcish = requests.filter(
    (r) =>
      r.type === 'fetch' ||
      r.type === 'xhr' ||
      /serverFn|_server|\/_tanstack|createServerFn/i.test(r.url),
  )

  const row = {
    id,
    profile: 'U',
    note: 'Unthrottled cold navigation — measures artificial delay progressive reveal',
    variant: variant.toUpperCase(),
    milestones: {
      A: round(metrics.A),
      B: round(metrics.B),
      C: round(metrics.C),
      D: round(metrics.D),
      E: round(metrics.E),
      F: round(metrics.F),
    },
    requestCount: requests.length,
    serverFunctionRequestCount: rpcish.length,
    serverFunctionUrls: [...new Set(rpcish.map((r) => r.url))],
    requestTypes: requests.reduce((acc, r) => {
      acc[r.type] = (acc[r.type] || 0) + 1
      return acc
    }, {}),
  }
  await writeFile(join(OUT, `${id}.json`), JSON.stringify(row, null, 2))
  console.log(
    `${id}: A=${row.milestones.A} B=${row.milestones.B} C=${row.milestones.C} D=${row.milestones.D} E=${row.milestones.E} F=${row.milestones.F} sf=${row.serverFunctionRequestCount}`,
  )
  await page.close()
  return row
}

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
})
await mkdir(OUT, { recursive: true })
const rows = []
try {
  for (const v of VARIANTS) {
    for (let i = 1; i <= RUNS; i++) rows.push(await sample(browser, v, i))
  }
} finally {
  await browser.close()
}

const summary = {}
for (const v of VARIANTS) {
  const items = rows.filter((r) => r.variant === v.toUpperCase())
  const pick = (k) => {
    const vals = items.map((r) => r.milestones[k]).filter((x) => x != null)
    return { mean: round(mean(vals)), values: vals }
  }
  summary[v.toUpperCase()] = {
    A: pick('A'),
    B: pick('B'),
    C: pick('C'),
    D: pick('D'),
    E: pick('E'),
    F: pick('F'),
  }
}

await writeFile(
  join(ROOT, 'docs/measurements/experiment-001/raw/unthrottled-milestones.json'),
  JSON.stringify({ summary, samples: rows }, null, 2),
)
console.log(JSON.stringify(summary, null, 2))
