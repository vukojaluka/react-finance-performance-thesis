import { queryOptions } from '@tanstack/react-query'

import { getRecentTransactions } from '../server/get-recent-transactions'

export function recentTransactionsQuery() {
  return queryOptions({
    queryKey: ['experiment-001', 'recent-transactions'],
    queryFn: () => getRecentTransactions(),
  })
}
