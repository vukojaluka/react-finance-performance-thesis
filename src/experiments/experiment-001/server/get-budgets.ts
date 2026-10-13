import { createServerFn } from '@tanstack/react-start'

import { EXPERIMENT_DELAYS } from '../lib/experiment-config'
import { experimentLog } from '../lib/experiment-logger'
import { sleep } from '../lib/sleep'

export type ExperimentBudget = {
  id: string
  name: string
  amount: number
  spent: number
  percentage: number
}

export const getExperimentBudgets = createServerFn({
  method: 'GET',
}).handler(async (): Promise<ExperimentBudget[]> => {
  experimentLog('Server Function started', 'getExperimentBudgets')
  await sleep(EXPERIMENT_DELAYS.budgets)
  experimentLog('Server Function finished', 'getExperimentBudgets')

  return [
    {
      id: 'budget-groceries',
      name: 'Groceries',
      amount: 600,
      spent: 375,
      percentage: 62.5,
    },
    {
      id: 'budget-transport',
      name: 'Transport',
      amount: 240,
      spent: 96,
      percentage: 40,
    },
    {
      id: 'budget-leisure',
      name: 'Leisure',
      amount: 300,
      spent: 225,
      percentage: 75,
    },
  ]
})
