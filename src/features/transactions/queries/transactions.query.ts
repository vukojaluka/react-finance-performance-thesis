import { queryOptions } from '@tanstack/react-query'

import { getTransaction } from '@/features/transactions/server/get-transaction'
import { getTransactions } from '@/features/transactions/server/get-transactions'
import type { TransactionFilters } from '@/features/transactions/schemas/transaction-search.schema'

export function transactionsQuery(filters: TransactionFilters) {
  return queryOptions({
    queryKey: ['transactions', filters] as const,
    queryFn: () => getTransactions({ data: filters }),
  })
}

export function transactionQuery(transactionId: string) {
  return queryOptions({
    queryKey: ['transactions', 'detail', transactionId] as const,
    queryFn: () => getTransaction({ data: { transactionId } }),
  })
}
