import { queryOptions } from '@tanstack/react-query'

import { getBudgets } from '../server/get-budgets'

export function budgetsQuery() {
  return queryOptions({
    queryKey: ['dashboard', 'budgets'] as const,
    queryFn: () => getBudgets(),
  })
}
