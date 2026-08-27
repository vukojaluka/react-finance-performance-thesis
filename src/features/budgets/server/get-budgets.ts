import { createServerFn } from '@tanstack/react-start'
import type { SupabaseClient } from '@supabase/supabase-js'

import { requireAuthMiddleware } from '@/features/auth/middleware/require-auth.middleware'
import {
  calculateBudgetPercentage,
  calculateBudgetRemaining,
} from '@/features/budgets/lib/budget-progress'
import { getMonthDateRange } from '@/features/budgets/lib/budget-period'
import { budgetPeriodSchema } from '@/features/budgets/schemas/budget-search.schema'
import type { Database } from '@/integrations/supabase/database.types'

const EXPENSE_PAGE_SIZE = 1000

export type BudgetSummary = {
  totalBudget: number
  totalSpent: number
  remaining: number
  percentage: number
}

export type CategoryBudgetProgress = {
  budgetId: string
  categoryId: string
  categoryName: string
  categoryColor: string
  budgetAmount: number
  spentAmount: number
  remaining: number
  percentage: number
}

export type BudgetOverview = {
  month: number
  year: number
  summary: BudgetSummary
  categories: CategoryBudgetProgress[]
}

type ExpenseRow = {
  category_id: string
  amount: number
}

type BudgetRow = {
  id: string
  amount: number
  category_id: string
  categories:
    | { name: string; color: string }
    | { name: string; color: string }[]
    | null
}

function readJoinedCategory(
  category:
    | { name: string; color: string }
    | { name: string; color: string }[]
    | null
    | undefined,
): { name: string; color: string } {
  if (!category) {
    return { name: 'Nepoznato', color: '#94a3b8' }
  }

  if (Array.isArray(category)) {
    return category[0] ?? { name: 'Nepoznato', color: '#94a3b8' }
  }

  return category
}

function sumSpentByCategory(rows: ExpenseRow[]): Map<string, number> {
  const spentByCategory = new Map<string, number>()

  for (const row of rows) {
    const current = spentByCategory.get(row.category_id) ?? 0
    spentByCategory.set(row.category_id, current + Number(row.amount))
  }

  return spentByCategory
}

async function fetchExpenseRowsForMonth(
  supabase: SupabaseClient<Database>,
  userId: string,
  month: number,
  year: number,
): Promise<ExpenseRow[]> {
  const { start, end } = getMonthDateRange({ month, year })
  const rows: ExpenseRow[] = []
  let from = 0
  let hasMore = true

  while (hasMore) {
    const to = from + EXPENSE_PAGE_SIZE - 1

    const { data, error } = await supabase
      .from('transactions')
      .select('category_id, amount')
      .eq('user_id', userId)
      .eq('type', 'expense')
      .gte('transaction_date', start)
      .lte('transaction_date', end)
      .order('transaction_date', { ascending: true })
      .order('id', { ascending: true })
      .range(from, to)

    if (error) {
      throw new Error('Nije moguće učitati potrošnju po budžetu.')
    }

    rows.push(...data)

    hasMore = data.length === EXPENSE_PAGE_SIZE
    from += EXPENSE_PAGE_SIZE
  }

  return rows
}

function buildBudgetOverview(
  month: number,
  year: number,
  budgets: BudgetRow[],
  spentByCategory: Map<string, number>,
): BudgetOverview {
  const categories = budgets.map((budget) => {
    const category = readJoinedCategory(budget.categories)
    const budgetAmount = Number(budget.amount)
    const spentAmount = spentByCategory.get(budget.category_id) ?? 0
    const remaining = calculateBudgetRemaining(budgetAmount, spentAmount)
    const percentage = calculateBudgetPercentage(spentAmount, budgetAmount)

    return {
      budgetId: budget.id,
      categoryId: budget.category_id,
      categoryName: category.name,
      categoryColor: category.color,
      budgetAmount,
      spentAmount,
      remaining,
      percentage,
    }
  })

  const totalBudget = categories.reduce(
    (sum, category) => sum + category.budgetAmount,
    0,
  )
  const totalSpent = categories.reduce(
    (sum, category) => sum + category.spentAmount,
    0,
  )
  const remaining = calculateBudgetRemaining(totalBudget, totalSpent)
  const percentage = calculateBudgetPercentage(totalSpent, totalBudget)

  return {
    month,
    year,
    summary: {
      totalBudget,
      totalSpent,
      remaining,
      percentage,
    },
    categories,
  }
}

export const getBudgets = createServerFn({ method: 'GET' })
  .middleware([requireAuthMiddleware])
  .validator((input: unknown) => {
    if (input == null) {
      return budgetPeriodSchema.parse({})
    }

    return budgetPeriodSchema.parse(input)
  })
  .handler(async ({ context, data }): Promise<BudgetOverview> => {
    const { user, supabase } = context
    const { month, year } = data

    const [budgetsResult, expenseRows] = await Promise.all([
      supabase
        .from('budgets')
        .select('id, amount, category_id, categories(name, color)')
        .eq('user_id', user.id)
        .eq('month', month)
        .eq('year', year)
        .order('created_at', { ascending: true }),
      fetchExpenseRowsForMonth(supabase, user.id, month, year),
    ])

    if (budgetsResult.error) {
      throw new Error('Nije moguće učitati budžete.')
    }

    const spentByCategory = sumSpentByCategory(expenseRows)

    return buildBudgetOverview(month, year, budgetsResult.data, spentByCategory)
  })
