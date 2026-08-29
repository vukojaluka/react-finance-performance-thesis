import { queryOptions } from '@tanstack/react-query'

import type { CategoryFilters } from '@/features/categories/schemas/category-search.schema'
import { getCategories } from '@/features/categories/server/get-categories'
import { getCategory } from '@/features/categories/server/get-category'
import { getCategoryOptions } from '@/features/categories/server/get-category-options'

export function categoriesQuery(filters: CategoryFilters) {
  return queryOptions({
    queryKey: ['categories', filters] as const,
    queryFn: () => getCategories({ data: filters }),
  })
}

export function categoryOptionsQuery() {
  return queryOptions({
    queryKey: ['categories', 'options'] as const,
    queryFn: () => getCategoryOptions(),
  })
}

export function categoryQuery(categoryId: string) {
  return queryOptions({
    queryKey: ['categories', 'detail', categoryId] as const,
    queryFn: () => getCategory({ data: { categoryId } }),
  })
}
