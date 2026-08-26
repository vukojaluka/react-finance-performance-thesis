import { z } from 'zod'

import { emptyStringToUndefined } from '@/lib/search-params'
import type { CategoryListItem } from '@/features/categories/server/get-categories'

export const categorySearchSchema = z.object({
  search: z.preprocess(emptyStringToUndefined, z.string().optional()),
})

export type CategorySearch = z.infer<typeof categorySearchSchema>

export function hasActiveCategorySearch(search: CategorySearch) {
  return Boolean(search.search)
}

export function filterCategoriesBySearch(
  categories: CategoryListItem[],
  search?: string,
) {
  const normalizedSearch = search?.trim().toLocaleLowerCase()

  if (!normalizedSearch) {
    return categories
  }

  return categories.filter((category) =>
    category.name.toLocaleLowerCase().includes(normalizedSearch),
  )
}
