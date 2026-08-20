import { queryOptions } from '@tanstack/react-query'

import type { TransactionFilters } from '../schemas/transaction-search.schema'
import { getTransactions } from '../server/get-transactions'

export function transactionsQuery(filters: TransactionFilters) {
  return queryOptions({
    queryKey: ['transactions', filters] as const,
    queryFn: () => getTransactions({ data: filters }),
  })
}
