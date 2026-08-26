import { queryOptions } from '@tanstack/react-query'

import { getCategories } from '@/features/categories/server/get-categories'
import { getCategory } from '@/features/categories/server/get-category'

export function categoriesQuery() {
  return queryOptions({
    queryKey: ['categories'] as const,
    queryFn: () => getCategories(),
  })
}

export function categoryQuery(categoryId: string) {
  return queryOptions({
    queryKey: ['categories', 'detail', categoryId] as const,
    queryFn: () => getCategory({ data: { categoryId } }),
  })
}
