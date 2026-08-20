import { z } from 'zod'

export const TRANSACTION_SEARCH_DEFAULTS = {
  page: 1,
  sort: 'date',
  sortDirection: 'desc',
} as const

function emptyToUndefined(value: unknown) {
  if (typeof value !== 'string') {
    return value
  }

  const trimmed = value.trim()

  if (trimmed === '' || trimmed === 'all') {
    return undefined
  }

  return trimmed
}

export const transactionFiltersSchema = z.object({
  page: z.coerce.number().int().positive().catch(1).default(1),
  category_id: z.preprocess(
    emptyToUndefined,
    z.guid().optional().catch(undefined),
  ),
  type: z.preprocess(
    emptyToUndefined,
    z.enum(['income', 'expense']).optional(),
  ),
  search: z.preprocess(emptyToUndefined, z.string().optional()),
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
