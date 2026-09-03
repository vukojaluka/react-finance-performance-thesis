import { createServerFn } from '@tanstack/react-start'

import { EXPERIMENT_DELAYS } from '../lib/experiment-config'
import { experimentLog } from '../lib/experiment-logger'
import { sleep } from '../lib/sleep'

export type ExpenseChartPoint = {
  month: string
  income: number
  expenses: number
}

export const getExpenseChart = createServerFn({ method: 'GET' }).handler(
  async (): Promise<ExpenseChartPoint[]> => {
    experimentLog('Server Function started', 'getExpenseChart')
    await sleep(EXPERIMENT_DELAYS.expenseChart)
    experimentLog('Server Function finished', 'getExpenseChart')

    return [
      { month: 'Jan', income: 3100, expenses: 1200 },
      { month: 'Feb', income: 3300, expenses: 1450 },
      { month: 'Mar', income: 3200, expenses: 980 },
      { month: 'Apr', income: 3600, expenses: 1600 },
      { month: 'May', income: 3500, expenses: 1320 },
      { month: 'Jun', income: 4200, expenses: 1750 },
    ]
  },
)
