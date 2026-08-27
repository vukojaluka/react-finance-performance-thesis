import { queryOptions } from '@tanstack/react-query'

import { getCurrentBudgetPeriod } from '@/features/budgets/lib/budget-period'
import { getBudgets } from '@/features/budgets/server/get-budgets'
import type { DashboardBudget } from '@/features/dashboard/server/get-budgets'

export function budgetsQuery() {
  return queryOptions({
    queryKey: ['dashboard', 'budgets'] as const,
    queryFn: async (): Promise<DashboardBudget[]> => {
      const { month, year } = getCurrentBudgetPeriod()
      const overview = await getBudgets({ data: { month, year } })

      return overview.categories.map((category) => ({
        id: category.budgetId,
        name: category.categoryName,
        spent: category.spentAmount,
        amount: category.budgetAmount,
        percentage: category.percentage,
      }))
    },
  })
}
