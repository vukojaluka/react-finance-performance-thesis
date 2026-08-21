import { createServerFn } from '@tanstack/react-start'

import { TRANSACTIONS_PAGE_SIZE } from '@/features/transactions/lib/constants'
import { transactionFiltersSchema } from '@/features/transactions/schemas/transaction-search.schema'
import { createSupabaseServerClient } from '@/integrations/supabase/server'
import type { Database } from '@/integrations/supabase/database.types'

export type TransactionListItem = {
  id: string
  date: string
  title: string
  category: string
  categoryColor: string
  amount: number
  type: Database['public']['Enums']['transaction_type']
}

export type PaginatedTransactions = {
  data: TransactionListItem[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}

const SORT_COLUMNS = {
  date: 'transaction_date',
  amount: 'amount',
  description: 'title',
} as const

function readJoinedCategory(
  category:
    | { name: string; color: string }
    | { name: string; color: string }[]
    | null
    | undefined,
): { name: string; color: string } {
  if (!category) {
    return { name: 'Nepoznato', color: '#737373' }
  }

  if (Array.isArray(category)) {
    return category[0] ?? { name: 'Nepoznato', color: '#737373' }
  }

  return category
}

export const getTransactions = createServerFn({ method: 'GET' })
  .validator(transactionFiltersSchema)
  .handler(async ({ data: filters }): Promise<PaginatedTransactions> => {
    const supabase = createSupabaseServerClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error('Morate biti prijavljeni da biste vidjeli transakcije.')
    }

    const from = (filters.page - 1) * TRANSACTIONS_PAGE_SIZE
    const to = from + TRANSACTIONS_PAGE_SIZE - 1

    let query = supabase
      .from('transactions')
      .select(
        'id, title, amount, type, transaction_date, categories(name, color)',
        { count: 'exact' },
      )
      .eq('user_id', user.id)
      .order(SORT_COLUMNS[filters.sort], {
        ascending: filters.sortDirection === 'asc',
      })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (filters.category_id) {
      query = query.eq('category_id', filters.category_id)
    }

    if (filters.type) {
      query = query.eq('type', filters.type)
    }

    if (filters.search) {
      query = query.ilike(
        'title',
        `%${filters.search.replace(/[%_,()]/g, '')}%`,
      )
    }

    const { data: rows, error, count } = await query

    if (error) {
      throw new Error('Nije moguće učitati transakcije.')
    }

    const total = count ?? 0

    return {
      data: rows.map((row) => {
        const category = readJoinedCategory(row.categories)

        return {
          id: row.id,
          date: row.transaction_date,
          title: row.title,
          category: category.name,
          categoryColor: category.color,
          amount: Number(row.amount),
          type: row.type,
        }
      }),
      page: filters.page,
      pageSize: TRANSACTIONS_PAGE_SIZE,
      total,
      totalPages: total === 0 ? 0 : Math.ceil(total / TRANSACTIONS_PAGE_SIZE),
    }
  })
