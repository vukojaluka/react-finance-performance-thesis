import { z } from 'zod'

import { emptyStringToUndefined } from '@/lib/search-params'

export const TRANSACTION_SEARCH_DEFAULTS = {
  page: 1,
  sort: 'date',
  sortDirection: 'desc',
} as const

const emptyFilterValue = emptyStringToUndefined(['all'])

export const transactionFiltersSchema = z.object({
  page: z.coerce.number().int().positive().catch(1).default(1),
  category_id: z.preprocess(
    emptyFilterValue,
    z.guid().optional().catch(undefined),
  ),
  type: z.preprocess(
    emptyFilterValue,
    z.enum(['income', 'expense']).optional().catch(undefined),
  ),
  search: z.preprocess(emptyStringToUndefined(), z.string().optional()),
  sort: z.enum(['date', 'amount', 'description']).catch('date').default('date'),
  sortDirection: z.enum(['asc', 'desc']).catch('desc').default('desc'),
})

export type TransactionFilters = z.infer<typeof transactionFiltersSchema>

export function hasActiveTransactionFilters(filters: TransactionFilters) {
  return (
    Boolean(filters.category_id) ||
    Boolean(filters.type) ||
    Boolean(filters.search)
  )
}
