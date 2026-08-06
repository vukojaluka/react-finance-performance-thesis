export type ExperimentVersion = 'version-1' | 'version-2' | 'version-3'

/**
 * Switch this value to compare rendering strategies.
 * - version-1: await ensureQueryData for all three queries
 * - version-2: await only dashboard summary; chart/transactions via Suspense
 * - version-3: await summary + non-awaited prefetchQuery for chart/transactions
 */
export const EXPERIMENT_VERSION: ExperimentVersion = 'version-3'

export const EXPERIMENT_DELAYS = {
  dashboardSummary: 1000,
  expenseChart: 2500,
  recentTransactions: 3500,
} as const
