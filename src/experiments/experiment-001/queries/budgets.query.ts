import { queryOptions } from '@tanstack/react-query'

import { getExperimentBudgets } from '../server/get-budgets'

export function experimentBudgetsQuery() {
  return queryOptions({
    queryKey: ['experiment-001', 'budgets'],
    queryFn: () => getExperimentBudgets(),
  })
}
