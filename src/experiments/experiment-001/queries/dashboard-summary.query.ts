import { queryOptions } from '@tanstack/react-query'

import { getDashboardSummary } from '../server/get-dashboard-summary'

export function dashboardSummaryQuery() {
  return queryOptions({
    queryKey: ['experiment-001', 'dashboard-summary'],
    queryFn: () => getDashboardSummary(),
  })
}
