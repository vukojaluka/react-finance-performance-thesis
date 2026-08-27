import { queryOptions } from '@tanstack/react-query'

import type { CategoryFilters } from '@/features/categories/schemas/category-search.schema'
import { getCategories } from '@/features/categories/server/get-categories'
import type {
  CategoryListItem,
  PaginatedCategories,
} from '@/features/categories/server/get-categories'
import { getCategory } from '@/features/categories/server/get-category'

export function categoriesQuery(
  filters: CategoryFilters,
): ReturnType<typeof queryOptions<PaginatedCategories>>
export function categoriesQuery(): ReturnType<
  typeof queryOptions<CategoryListItem[]>
>
export function categoriesQuery(filters?: CategoryFilters) {
  if (filters) {
    return queryOptions({
      queryKey: ['categories', filters] as const,
      queryFn: () =>
        getCategories({ data: filters }) as Promise<PaginatedCategories>,
    })
  }

  return queryOptions({
    queryKey: ['categories'] as const,
    queryFn: () => getCategories() as Promise<CategoryListItem[]>,
  })
}

export function categoryQuery(categoryId: string) {
  return queryOptions({
    queryKey: ['categories', 'detail', categoryId] as const,
    queryFn: () => getCategory({ data: { categoryId } }),
  })
}
