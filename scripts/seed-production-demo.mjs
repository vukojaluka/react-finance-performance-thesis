#!/usr/bin/env node
/**
 * Idempotent production seed for a single user via RLS (authenticated session).
 * Usage:
 *   SEED_USER_EMAIL=... SEED_USER_PASSWORD=... node --env-file=.env scripts/seed-production-demo.mjs [--dry-run]
 */

import { createHash } from 'node:crypto'

const DRY_RUN = process.argv.includes('--dry-run')
const TX_TARGET = 800
const START_DATE = new Date('2025-04-01T00:00:00')
const END_DATE = new Date('2026-10-07T00:00:00')

const CATEGORIES = [
  { name: 'Plaća', color: '#22c55e', kind: 'income' },
  { name: 'Honorari', color: '#14b8a6', kind: 'income' },
  { name: 'Stanovanje', color: '#f97316', kind: 'expense' },
  { name: 'Namirnice', color: '#ef4444', kind: 'expense' },
  { name: 'Režije', color: '#f59e0b', kind: 'expense' },
  { name: 'Prijevoz', color: '#3b82f6', kind: 'expense' },
  { name: 'Restorani i kafići', color: '#e11d48', kind: 'expense' },
  { name: 'Zabava', color: '#a855f7', kind: 'expense' },
  { name: 'Zdravlje', color: '#ec4899', kind: 'expense' },
  { name: 'Kupovina', color: '#737373', kind: 'expense' },
]

const BUDGET_CATEGORY_NAMES = [
  'Namirnice',
  'Režije',
  'Prijevoz',
  'Restorani i kafići',
  'Zabava',
  'Kupovina',
]

const BUDGET_MONTHS = [
  { month: 4, year: 2026 },
  { month: 5, year: 2026 },
  { month: 6, year: 2026 },
  { month: 7, year: 2026 },
  { month: 8, year: 2026 },
  { month: 9, year: 2026 },
  { month: 10, year: 2026 },
]

function stableUuid(seed) {
  const hash = createHash('sha256').update(`luka-prod-seed:${seed}`).digest()
  const bytes = Buffer.from(hash.subarray(0, 16))
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = bytes.toString('hex')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`
}

function mulberry32(seed) {
  let t = seed >>> 0
  return () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

const rng = mulberry32(0x4c554b41)

function randomInt(min, max) {
  return Math.floor(rng() * (max - min + 1)) + min
}

function randomAmount(min, max) {
  const value = min + rng() * (max - min)
  return Math.round(value * 100) / 100
}

function formatIsoDate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function monthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function daysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate()
}

function pickDateInMonth(year, monthIndex, dayMin, dayMax) {
  const last = daysInMonth(year, monthIndex)
  const day = Math.min(last, randomInt(dayMin, dayMax))
  return new Date(year, monthIndex, day)
}

async function signIn(url, publishableKey, email, password) {
  const response = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      apikey: publishableKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  const payload = await response.json()
  if (!response.ok) {
    throw new Error(payload.error_description || payload.msg || 'Sign-in failed')
  }

  return {
    accessToken: payload.access_token,
    userId: payload.user.id,
  }
}

async function rest(url, publishableKey, accessToken, path, options = {}) {
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: publishableKey,
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Prefer: options.prefer ?? 'return=minimal',
      ...(options.headers ?? {}),
    },
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`REST ${path} failed (${response.status}): ${text}`)
  }

  if (response.status === 204) {
    return null
  }

  const text = await response.text()
  return text ? JSON.parse(text) : null
}

function buildCategoryRows(userId) {
  return CATEGORIES.map((category) => ({
    id: stableUuid(`category:${category.name}`),
    user_id: userId,
    name: category.name,
    color: category.color,
  }))
}

function buildBudgetRows(userId, categoryIdByName) {
  const rows = []
  for (const { month, year } of BUDGET_MONTHS) {
    for (const name of BUDGET_CATEGORY_NAMES) {
      const base =
        name === 'Namirnice'
          ? 380
          : name === 'Režije'
            ? 190
            : name === 'Prijevoz'
              ? 130
              : name === 'Restorani i kafići'
                ? 160
                : name === 'Zabava'
                  ? 110
                  : 220

      const seasonal =
        month === 12
          ? 1.15
          : month === 7 || month === 8
            ? 1.1
            : month === 10
              ? 0.95
              : 1

      rows.push({
        id: stableUuid(`budget:${year}-${month}:${name}`),
        user_id: userId,
        category_id: categoryIdByName.get(name),
        amount: Math.round(base * seasonal * 100) / 100,
        month,
        year,
      })
    }
  }
  return rows
}

function buildTransactionRows(userId, categoryIdByName) {
  const rows = []
  const templates = {
    income: {
      Plaća: (y, m) => [
        {
          title: `Plaća ${String(m + 1).padStart(2, '0')}/${y}`,
          amount: y >= 2026 && m >= 6 ? 3150 : 2950,
          note: 'Mjesečna plaća',
        },
      ],
      Honorari: () => {
        const projects = [
          'Web dizajn – landing stranica',
          'Konzultacije – React performanse',
          'Održavanje web aplikacije',
          'SEO optimizacija',
          'Integracija API-ja',
        ]
        const title = projects[randomInt(0, projects.length - 1)]
        return [{ title, amount: randomAmount(180, 950), note: null }]
      },
    },
    expense: {
      Stanovanje: () => [
        { title: 'Najam stana', amount: 650, note: 'Mjesečni najam' },
      ],
      Namirnice: () => {
        const shops = ['Konzum', 'Lidl', 'Bingo', 'Pekara', 'Tržnica', 'Spar']
        return Array.from({ length: randomInt(12, 16) }, () => ({
          title: `${shops[randomInt(0, shops.length - 1)]} – namirnice`,
          amount: randomAmount(12, 95),
          note: null,
        }))
      },
      Režije: (y, m) => {
        const items = [
          { title: 'Električna energija (HEP)', amount: randomAmount(45, 120) },
          { title: 'Vodovod i odvodnja', amount: randomAmount(18, 42) },
          { title: 'Internet (A1)', amount: 39.9, note: 'Mjesečna pretplata' },
          { title: 'Mobitel (Telemach)', amount: 24.9, note: null },
        ]
        if (m >= 10 || m <= 2) {
          items.push({
            title: 'Plin (Energoinvest)',
            amount: randomAmount(35, 110),
            note: 'Grijanje',
          })
        }
        return items
      },
      Prijevoz: () => {
        const items = [
          { title: 'Gorivo – benzinska', amount: randomAmount(45, 85) },
          { title: 'Parking u centru', amount: randomAmount(2, 8) },
          { title: 'Mjesečna karta (JGP)', amount: 45, note: null },
        ]
        if (rng() > 0.7) {
          items.push({
            title: 'Servis vozila',
            amount: randomAmount(80, 240),
            note: null,
          })
        }
        return items
      },
      'Restorani i kafići': () =>
        Array.from({ length: randomInt(4, 9) }, () => ({
          title: [
            'Kava u gradu',
            'Ručak – restoran',
            'Večera s prijateljima',
            'Brza hrana',
            'Pizza',
          ][randomInt(0, 4)],
          amount: randomAmount(6, 48),
          note: null,
        })),
      Zabava: () => {
        const items = [
          { title: 'Netflix pretplata', amount: 13.99, note: null },
          { title: 'Spotify pretplata', amount: 6.99, note: null },
        ]
        if (rng() > 0.55) {
          items.push({
            title: 'Kino – premijera',
            amount: randomAmount(8, 14),
            note: null,
          })
        }
        if (rng() > 0.8) {
          items.push({
            title: 'Koncert',
            amount: randomAmount(25, 65),
            note: null,
          })
        }
        return items
      },
      Zdravlje: () => {
        const items = [
          { title: 'Teretana – članarina', amount: 35, note: null },
          { title: 'Ljekarna', amount: randomAmount(8, 42), note: null },
        ]
        if (rng() > 0.85) {
          items.push({
            title: 'Stomatološki pregled',
            amount: randomAmount(60, 180),
            note: null,
          })
        }
        return items
      },
      Kupovina: () =>
        Array.from({ length: randomInt(2, 6) }, () => ({
          title: [
            'Odjeća',
            'Obuća',
            'Kućanski aparati',
            'Elektronika',
            'Poklon',
          ][randomInt(0, 4)],
          amount: randomAmount(20, 320),
          note: null,
        })),
    },
  }

  const cursor = new Date(START_DATE)
  let txIndex = 0

  while (cursor <= END_DATE && txIndex < TX_TARGET) {
    const year = cursor.getFullYear()
    const monthIndex = cursor.getMonth()
    const key = monthKey(cursor)

    const monthlyIncome = [
      ...templates.income.Plaća(year, monthIndex).map((item) => ({
        ...item,
        category: 'Plaća',
        type: 'income',
      })),
      ...(rng() > 0.35
        ? templates.income.Honorari().map((item) => ({
            ...item,
            category: 'Honorari',
            type: 'income',
          }))
        : []),
    ]

    const monthlyExpense = []
    for (const category of CATEGORIES.filter((c) => c.kind === 'expense')) {
      const builder = templates.expense[category.name]
      if (!builder) {
        continue
      }
      const built = builder(year, monthIndex)
      for (const item of built) {
        monthlyExpense.push({
          ...item,
          category: category.name,
          type: 'expense',
        })
      }
    }

    const monthTransactions = [...monthlyIncome, ...monthlyExpense]
    for (const tx of monthTransactions) {
      if (txIndex >= TX_TARGET) {
        break
      }

      const date =
        tx.type === 'income'
          ? pickDateInMonth(year, monthIndex, 1, 8)
          : pickDateInMonth(year, monthIndex, 2, 28)

      rows.push({
        id: stableUuid(`tx:${txIndex}:${key}:${tx.title}`),
        user_id: userId,
        category_id: categoryIdByName.get(tx.category),
        title: tx.title.slice(0, 120),
        amount: tx.amount,
        type: tx.type,
        transaction_date: formatIsoDate(date),
        note: tx.note ?? null,
      })
      txIndex += 1
    }

    cursor.setMonth(cursor.getMonth() + 1)
    cursor.setDate(1)
  }

  while (txIndex < TX_TARGET) {
    const categoryName =
      CATEGORIES[randomInt(2, CATEGORIES.length - 1)].name
    const type = categoryName === 'Plaća' || categoryName === 'Honorari'
      ? 'income'
      : 'expense'
    const date = new Date(
      START_DATE.getTime() +
        rng() * (END_DATE.getTime() - START_DATE.getTime()),
    )

    rows.push({
      id: stableUuid(`tx:fill:${txIndex}`),
      user_id: userId,
      category_id: categoryIdByName.get(categoryName),
      title: `Ostala transakcija #${txIndex + 1}`.slice(0, 120),
      amount: randomAmount(5, 120),
      type,
      transaction_date: formatIsoDate(date),
      note: null,
    })
    txIndex += 1
  }

  return rows.slice(0, TX_TARGET)
}

function normalizeTransactionRow(row) {
  return {
    id: row.id,
    user_id: row.user_id,
    category_id: row.category_id,
    title: row.title,
    amount: row.amount,
    type: row.type,
    transaction_date: row.transaction_date,
    note: row.note ?? null,
  }
}

async function insertBatches(url, publishableKey, accessToken, table, rows) {
  const batchSize = 200
  for (let i = 0; i < rows.length; i += batchSize) {
    const chunk = rows.slice(i, i + batchSize)
    await rest(url, publishableKey, accessToken, table, {
      method: 'POST',
      body: JSON.stringify(chunk),
      prefer: 'resolution=ignore-duplicates,return=minimal',
      headers: { Prefer: 'resolution=ignore-duplicates,return=minimal' },
    })
  }
}

async function main() {
  const url = process.env.VITE_SUPABASE_URL
  const publishableKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY
  const email = process.env.SEED_USER_EMAIL
  const password = process.env.SEED_USER_PASSWORD

  if (!url || !publishableKey) {
    throw new Error('VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY required.')
  }
  if (!email || !password) {
    throw new Error('SEED_USER_EMAIL and SEED_USER_PASSWORD required.')
  }

  const { accessToken, userId } = await signIn(
    url,
    publishableKey,
    email,
    password,
  )

  const categoryRows = buildCategoryRows(userId)
  const categoryIdByName = new Map(
    categoryRows.map((row) => [row.name, row.id]),
  )
  const budgetRows = buildBudgetRows(userId, categoryIdByName)
  const transactionRows = buildTransactionRows(userId, categoryIdByName).map(
    normalizeTransactionRow,
  )

  console.log(
    `Prepared seed: categories=${categoryRows.length}, budgets=${budgetRows.length}, transactions=${transactionRows.length}`,
  )

  if (DRY_RUN) {
    const byCategory = new Map()
    for (const tx of transactionRows) {
      const name = CATEGORIES.find(
        (c) => categoryIdByName.get(c.name) === tx.category_id,
      )?.name
      byCategory.set(name, (byCategory.get(name) ?? 0) + 1)
    }
    console.log('Dry run category distribution:', Object.fromEntries(byCategory))
    return
  }

  await insertBatches(url, publishableKey, accessToken, 'categories', categoryRows)
  await insertBatches(url, publishableKey, accessToken, 'budgets', budgetRows)
  await insertBatches(
    url,
    publishableKey,
    accessToken,
    'transactions',
    transactionRows,
  )

  const counts = await rest(
    url,
    publishableKey,
    accessToken,
    'categories?select=id',
    { method: 'GET', prefer: 'count=exact' },
  )

  console.log('Seed complete for user', userId)
  console.log(
    'Inserted (idempotent):',
    `categories=${categoryRows.length}`,
    `budgets=${budgetRows.length}`,
    `transactions=${transactionRows.length}`,
  )
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
