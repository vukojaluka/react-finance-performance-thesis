import { createServerFn } from '@tanstack/react-start'

import { EXPERIMENT_DELAYS } from '../lib/experiment-config'
import { experimentLog } from '../lib/experiment-logger'
import { sleep } from '../lib/sleep'

export type ExpenseChartPoint = {
  month: string
  expenses: number
}

export const getExpenseChart = createServerFn({ method: 'GET' }).handler(
  async (): Promise<ExpenseChartPoint[]> => {
    experimentLog('Server Function started', 'getExpenseChart')
    await sleep(EXPERIMENT_DELAYS.expenseChart)
    experimentLog('Server Function finished', 'getExpenseChart')

    return [
      { month: 'Jan', expenses: 1200 },
      { month: 'Feb', expenses: 1450 },
      { month: 'Mar', expenses: 980 },
      { month: 'Apr', expenses: 1600 },
      { month: 'May', expenses: 1320 },
      { month: 'Jun', expenses: 1750 },
    ]
  },
)
