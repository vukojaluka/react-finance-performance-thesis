import { createServerFn } from '@tanstack/react-start'

import { requireAuthMiddleware } from '@/features/auth/middleware/require-auth.middleware'
import { createSupabaseServerClient } from '@/integrations/supabase/server'
import type { Database } from '@/integrations/supabase/database.types'

export type DashboardSummary = {
  totalIncome: number
  totalExpenses: number
  balance: number
  currentMonthBalance: number
}

type TransactionType = Database['public']['Enums']['transaction_type']

type TransactionSummaryRow = {
  amount: number
  type: TransactionType
  transaction_date: string
}

function getCurrentMonthDateRange(): { start: string; end: string } {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const monthString = String(month + 1).padStart(2, '0')
  const lastDay = new Date(year, month + 1, 0).getDate()

  return {
    start: `${year}-${monthString}-01`,
    end: `${year}-${monthString}-${String(lastDay).padStart(2, '0')}`,
  }
}

function sumByType(
  rows: TransactionSummaryRow[],
  dateRange?: { start: string; end: string },
): { income: number; expenses: number } {
  const totals = { income: 0, expenses: 0 }

  for (const row of rows) {
    if (
      dateRange &&
      (row.transaction_date < dateRange.start ||
        row.transaction_date > dateRange.end)
    ) {
      continue
    }

    const amount = Number(row.amount)

    if (row.type === 'income') {
      totals.income += amount
    } else {
      totals.expenses += amount
    }
  }

  return totals
}

async function fetchTransactionSummaryRows(
  supabase: ReturnType<typeof createSupabaseServerClient>,
) {
  const { data, error } = await supabase
    .from('transactions')
    .select('amount, type, transaction_date')

  if (error) {
    throw new Error('Nije moguće učitati sažetak nadzorne ploče.')
  }

  return data
}

export const getDashboardSummary = createServerFn({ method: 'GET' })
  .middleware([requireAuthMiddleware])
  .handler(async ({ context }): Promise<DashboardSummary> => {
    const { supabase } = context

    const rows = await fetchTransactionSummaryRows(supabase)
    const currentMonthRange = getCurrentMonthDateRange()
    const allTimeTotals = sumByType(rows)
    const currentMonthTotals = sumByType(rows, currentMonthRange)

    const totalIncome = allTimeTotals.income
    const totalExpenses = allTimeTotals.expenses
    const currentMonthIncome = currentMonthTotals.income
    const currentMonthExpenses = currentMonthTotals.expenses

    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      currentMonthBalance: currentMonthIncome - currentMonthExpenses,
    }
  })
