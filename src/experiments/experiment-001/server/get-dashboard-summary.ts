import { createServerFn } from '@tanstack/react-start'

import { EXPERIMENT_DELAYS } from '../lib/experiment-config'
import { experimentLog } from '../lib/experiment-logger'
import { sleep } from '../lib/sleep'

export type DashboardSummary = {
  income: number
  expenses: number
  balance: number
  currentMonthBalance: number
}

export const getDashboardSummary = createServerFn({ method: 'GET' }).handler(
  async (): Promise<DashboardSummary> => {
    experimentLog('Server Function started', 'getDashboardSummary')
    await sleep(EXPERIMENT_DELAYS.dashboardSummary)
    experimentLog('Server Function finished', 'getDashboardSummary')

    return {
      income: 4200,
      expenses: 1600,
      balance: 2600,
      currentMonthBalance: 1250,
    }
  },
)
