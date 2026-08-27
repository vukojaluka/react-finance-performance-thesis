import { z } from 'zod'

import { getCurrentBudgetPeriod } from '@/features/budgets/lib/budget-period'

const currentPeriod = getCurrentBudgetPeriod()

export const BUDGET_SEARCH_DEFAULTS = {
  month: currentPeriod.month,
  year: currentPeriod.year,
} as const

export const budgetPeriodSchema = z.object({
  month: z.coerce
    .number()
    .int()
    .min(1)
    .max(12)
    .catch(BUDGET_SEARCH_DEFAULTS.month)
    .default(BUDGET_SEARCH_DEFAULTS.month),
  year: z.coerce
    .number()
    .int()
    .min(1000)
    .max(9999)
    .catch(BUDGET_SEARCH_DEFAULTS.year)
    .default(BUDGET_SEARCH_DEFAULTS.year),
})

export const budgetSearchSchema = budgetPeriodSchema

export type BudgetPeriodFilters = z.infer<typeof budgetSearchSchema>
