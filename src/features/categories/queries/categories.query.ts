import { queryOptions } from '@tanstack/react-query'

import { getCategories } from '../server/get-categories'

export function categoriesQuery() {
  return queryOptions({
    queryKey: ['categories'] as const,
    queryFn: () => getCategories(),
  })
}
