import { z } from 'zod'

import { emptyStringToUndefined } from '@/lib/search-params'

export const CATEGORY_SEARCH_DEFAULTS = {
  page: 1,
} as const

export const categorySearchSchema = z.object({
  page: z.coerce.number().int().positive().catch(1).default(1),
  search: z.preprocess(emptyStringToUndefined(), z.string().optional()),
})

export type CategoryFilters = z.infer<typeof categorySearchSchema>

export function hasActiveCategorySearch(filters: CategoryFilters) {
  return Boolean(filters.search)
}
