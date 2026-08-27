import { useQuery } from '@tanstack/react-query'

import {
  getAvailableCategories,
  getOccupiedCategoryIds,
} from '@/features/budgets/lib/budget-form'
import type { BudgetFormMode } from '@/features/budgets/lib/budget-form'
import { budgetsQuery } from '@/features/budgets/queries/budgets.query'
import { categoriesQuery } from '@/features/categories/queries/categories.query'

type UseBudgetCategoryAvailabilityConfig = {
  month: number
  year: number
  selectedCategoryId: string
  budgetId?: string
  mode: BudgetFormMode
}

export function useBudgetCategoryAvailability({
  month,
  year,
  selectedCategoryId,
  budgetId,
  mode,
}: UseBudgetCategoryAvailabilityConfig) {
  const { data: categories = [] } = useQuery(categoriesQuery())
  const { data: overview } = useQuery({
    ...budgetsQuery({ month, year }),
    enabled: month >= 1 && year >= 1000,
  })

  const occupiedCategoryIds = getOccupiedCategoryIds(
    overview?.categories ?? [],
    budgetId,
  )

  const availableCategories = getAvailableCategories(
    categories,
    occupiedCategoryIds,
    selectedCategoryId,
  )

  const hasCategories = categories.length > 0
  const hasAvailableCategories = availableCategories.length > 0
  const allCategoriesBudgeted =
    hasCategories && !hasAvailableCategories && mode === 'create'
  const canSubmit = hasCategories && !allCategoriesBudgeted

  return {
    availableCategories,
    hasCategories,
    hasAvailableCategories,
    allCategoriesBudgeted,
    canSubmit,
  }
}
