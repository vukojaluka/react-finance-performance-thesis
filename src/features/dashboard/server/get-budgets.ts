import { createServerFn } from '@tanstack/react-start'

import { createSupabaseServerClient } from '@/integrations/supabase/server'

export type DashboardBudget = {
  id: string
  name: string
  spent: number
  amount: number
  percentage: number
}

type ExpenseRow = {
  category_id: string
  amount: number
}

function readJoinedCategoryName(
  category: { name: string } | { name: string }[] | null | undefined,
): string {
  if (!category) {
    return 'Nepoznato'
  }

  if (Array.isArray(category)) {
    return category[0]?.name ?? 'Nepoznato'
  }

  return category.name
}

function getCurrentMonthYear(): { month: number; year: number } {
  const now = new Date()

  return {
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  }
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

function sumSpentByCategory(rows: ExpenseRow[]): Map<string, number> {
  const spentByCategory = new Map<string, number>()

  for (const row of rows) {
    const current = spentByCategory.get(row.category_id) ?? 0
    spentByCategory.set(row.category_id, current + Number(row.amount))
  }

  return spentByCategory
}

export const getBudgets = createServerFn({ method: 'GET' }).handler(
  async (): Promise<DashboardBudget[]> => {
    const supabase = createSupabaseServerClient()
    const { error: userError } = await supabase.auth.getUser()

    if (userError) {
      throw new Error('Morate biti prijavljeni da biste vidjeli budžete.')
    }

    const { month, year } = getCurrentMonthYear()
    const currentMonthRange = getCurrentMonthDateRange()

    const [budgetsResult, expensesResult] = await Promise.all([
      supabase
        .from('budgets')
        .select('id, amount, category_id, categories(name)')
        .eq('month', month)
        .eq('year', year)
        .order('created_at', { ascending: true }),
      supabase
        .from('transactions')
        .select('category_id, amount')
        .eq('type', 'expense')
        .gte('transaction_date', currentMonthRange.start)
        .lte('transaction_date', currentMonthRange.end),
    ])

    if (budgetsResult.error) {
      throw new Error('Nije moguće učitati budžete.')
    }

    if (expensesResult.error) {
      throw new Error('Nije moguće učitati potrošnju po budžetu.')
    }

    const spentByCategory = sumSpentByCategory(expensesResult.data)

    return budgetsResult.data.map((budget) => {
      const amount = Number(budget.amount)
      const spent = spentByCategory.get(budget.category_id) ?? 0
      const percentage = amount === 0 ? 0 : (spent / amount) * 100

      return {
        id: budget.id,
        name: readJoinedCategoryName(budget.categories),
        spent,
        amount,
        percentage,
      }
    })
  },
)
