import { queryOptions } from '@tanstack/react-query'

import { getRecentTransactions } from '../server/get-recent-transactions'

export function recentTransactionsQuery() {
  return queryOptions({
    queryKey: ['dashboard', 'recent-transactions'] as const,
    queryFn: () => getRecentTransactions(),
  })
}
