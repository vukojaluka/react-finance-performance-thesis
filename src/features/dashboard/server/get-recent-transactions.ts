import { createServerFn } from '@tanstack/react-start'

import { createSupabaseServerClient } from '@/integrations/supabase/server'
import type { Database } from '@/integrations/supabase/database.types'
import { sleep } from '../../../experiments/experiment-001/lib/sleep'

export type RecentTransaction = {
  id: string
  date: string
  title: string
  category: string
  amount: number
  type: Database['public']['Enums']['transaction_type']
}

const RECENT_TRANSACTIONS_LIMIT = 5

function readJoinedCategoryName(
  category: { name: string } | { name: string }[] | null | undefined,
): string {
  if (!category) {
    return 'Nepoznato'
  }

  if (Array.isArray(category)) {
    return category[0]?.name ?? 'Nepoznato'
  }

  return category.name
}

export const getRecentTransactions = createServerFn({ method: 'GET' }).handler(
  async (): Promise<RecentTransaction[]> => {
    const supabase = createSupabaseServerClient()
    const { error: userError } = await supabase.auth.getUser()

    if (userError) {
      throw new Error(
        'Morate biti prijavljeni da biste vidjeli nedavne transakcije.',
      )
    }

    const { data, error } = await supabase
      .from('transactions')
      .select('id, title, amount, type, transaction_date, categories(name)')
      .order('transaction_date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(RECENT_TRANSACTIONS_LIMIT)

    if (error) {
      throw new Error('Nije moguće učitati nedavne transakcije.')
    }

    await sleep(3000)

    return data.map((row) => ({
      id: row.id,
      date: row.transaction_date,
      title: row.title,
      category: readJoinedCategoryName(row.categories),
      amount: Number(row.amount),
      type: row.type,
    }))
  },
)
