import { queryOptions } from '@tanstack/react-query'

import { getExpenseChart } from '../server/get-expense-chart'

export function expenseChartQuery() {
  return queryOptions({
    queryKey: ['experiment-001', 'expense-chart'],
    queryFn: () => getExpenseChart(),
  })
}
