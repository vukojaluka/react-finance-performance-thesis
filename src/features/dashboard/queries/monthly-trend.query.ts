import { queryOptions } from '@tanstack/react-query'

import { getMonthlyTrend } from '../server/get-monthly-trend'

export function monthlyTrendQuery() {
  return queryOptions({
    queryKey: ['dashboard', 'monthly-trend'] as const,
    queryFn: () => getMonthlyTrend(),
  })
}
