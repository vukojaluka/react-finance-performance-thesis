import { createServerFn } from '@tanstack/react-start'

import { requireAuthMiddleware } from '@/features/auth/middleware/require-auth.middleware'
import type { Database } from '@/integrations/supabase/database.types'

export type MonthlyTrendPoint = {
  month: string
  income: number
  expenses: number
  balance: number
}

type TransactionType = Database['public']['Enums']['transaction_type']

type MonthlyTrendRow = {
  amount: number
  type: TransactionType
  transaction_date: string
}

const MONTHS_TO_INCLUDE = 6

const monthLabelFormatter = new Intl.DateTimeFormat('hr-HR', {
  month: 'short',
})

function getLastSixMonthsRange(): { start: string; end: string } {
  const now = new Date()
  const endYear = now.getFullYear()
  const endMonth = now.getMonth()
  const endMonthString = String(endMonth + 1).padStart(2, '0')
  const endDay = new Date(endYear, endMonth + 1, 0).getDate()

  const startDate = new Date(endYear, endMonth - (MONTHS_TO_INCLUDE - 1), 1)
  const startYear = startDate.getFullYear()
  const startMonthString = String(startDate.getMonth() + 1).padStart(2, '0')

  return {
    start: `${startYear}-${startMonthString}-01`,
    end: `${endYear}-${endMonthString}-${String(endDay).padStart(2, '0')}`,
  }
}

function buildMonthKeys(): string[] {
  const now = new Date()
  const keys: string[] = []

  for (let index = MONTHS_TO_INCLUDE - 1; index >= 0; index -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    keys.push(`${year}-${month}`)
  }

  return keys
}

function formatMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split('-').map(Number)
  const date = new Date(year, month - 1, 1)
  const label = monthLabelFormatter.format(date)
  return label.charAt(0).toUpperCase() + label.slice(1)
}

function aggregateMonthlyTrend(
  rows: MonthlyTrendRow[],
  monthKeys: string[],
): MonthlyTrendPoint[] {
  const totalsByMonth = new Map<string, { income: number; expenses: number }>()

  for (const monthKey of monthKeys) {
    totalsByMonth.set(monthKey, { income: 0, expenses: 0 })
  }

  for (const row of rows) {
    const monthKey = row.transaction_date.slice(0, 7)
    const totals = totalsByMonth.get(monthKey)

    if (!totals) {
      continue
    }

    const amount = Number(row.amount)

    if (row.type === 'income') {
      totals.income += amount
    } else {
      totals.expenses += amount
    }
  }

  return monthKeys.map((monthKey) => {
    const totals = totalsByMonth.get(monthKey) ?? { income: 0, expenses: 0 }

    return {
      month: formatMonthLabel(monthKey),
      income: totals.income,
      expenses: totals.expenses,
      balance: totals.income - totals.expenses,
    }
  })
}

export const getMonthlyTrend = createServerFn({ method: 'GET' })
  .middleware([requireAuthMiddleware])
  .handler(async ({ context }): Promise<MonthlyTrendPoint[]> => {
    const { supabase, user } = context

    const dateRange = getLastSixMonthsRange()
    const monthKeys = buildMonthKeys()

    const { data, error } = await supabase
      .from('transactions')
      .select('amount, type, transaction_date')
      .eq('user_id', user.id)
      .gte('transaction_date', dateRange.start)
      .lte('transaction_date', dateRange.end)

    if (error) {
      throw new Error('Nije moguće učitati mjesečni trend.')
    }

    return aggregateMonthlyTrend(data, monthKeys)
  },
)
