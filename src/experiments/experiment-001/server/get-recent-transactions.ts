import { createServerFn } from '@tanstack/react-start'

import { EXPERIMENT_DELAYS } from '../lib/experiment-config'
import { experimentLog } from '../lib/experiment-logger'
import { sleep } from '../lib/sleep'

export type RecentTransaction = {
  id: string
  title: string
  amount: number
  type: 'income' | 'expense'
  date: string
}

export const getRecentTransactions = createServerFn({ method: 'GET' }).handler(
  async (): Promise<RecentTransaction[]> => {
    experimentLog('Server Function started', 'getRecentTransactions')
    await sleep(EXPERIMENT_DELAYS.recentTransactions)
    experimentLog('Server Function finished', 'getRecentTransactions')

    return [
      {
        id: '1',
        title: 'Salary',
        amount: 4200,
        type: 'income',
        date: '2026-08-01',
      },
      {
        id: '2',
        title: 'Groceries',
        amount: 84.5,
        type: 'expense',
        date: '2026-08-02',
      },
      {
        id: '3',
        title: 'Rent',
        amount: 1100,
        type: 'expense',
        date: '2026-08-03',
      },
      {
        id: '4',
        title: 'Transport',
        amount: 45,
        type: 'expense',
        date: '2026-08-03',
      },
      {
        id: '5',
        title: 'Coffee',
        amount: 12.8,
        type: 'expense',
        date: '2026-08-04',
      },
    ]
  },
)
