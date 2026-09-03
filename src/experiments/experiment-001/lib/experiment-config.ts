import { z } from 'zod'

/**
 * The URL search parameter is the only strategy selector. Invalid and missing
 * values deterministically fall back to V1.
 */
export const EXPERIMENT_VARIANTS = ['v1', 'v2', 'v3', 'v3b'] as const
export const DEFAULT_EXPERIMENT_VARIANT = 'v1'

export const experimentVariantSchema = z
  .enum(EXPERIMENT_VARIANTS)
  .catch(DEFAULT_EXPERIMENT_VARIANT)
  .default(DEFAULT_EXPERIMENT_VARIANT)

export const experimentSearchSchema = z.object({
  variant: experimentVariantSchema,
})

export type ExperimentVariant = z.infer<typeof experimentVariantSchema>

export const EXPERIMENT_DELAYS = {
  dashboardSummary: 1000,
  expenseChart: 2500,
  budgets: 3000,
  recentTransactions: 3500,
} as const
