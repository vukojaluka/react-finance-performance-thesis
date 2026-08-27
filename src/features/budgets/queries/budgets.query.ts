import { queryOptions } from '@tanstack/react-query'

import type { BudgetPeriodFilters } from '@/features/budgets/schemas/budget-search.schema'
import { getBudget } from '@/features/budgets/server/get-budget'
import { getBudgets } from '@/features/budgets/server/get-budgets'

export function budgetsQuery(period: BudgetPeriodFilters) {
  return queryOptions({
    queryKey: ['budgets', period] as const,
    queryFn: () => getBudgets({ data: period }),
  })
}

export function budgetQuery(budgetId: string) {
  return queryOptions({
    queryKey: ['budgets', 'detail', budgetId] as const,
    queryFn: () => getBudget({ data: { budgetId } }),
  })
}
