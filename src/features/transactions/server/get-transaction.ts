import { createServerFn } from '@tanstack/react-start'
import { notFound } from '@tanstack/react-router'

import { transactionIdSchema } from '@/features/transactions/schemas/transaction-form.schema'
import { createSupabaseServerClient } from '@/integrations/supabase/server'
import type { Database } from '@/integrations/supabase/database.types'

export type TransactionDetail = {
  id: string
  type: Database['public']['Enums']['transaction_type']
  amount: number
  title: string
  category_id: string
  transaction_date: string
}

export const getTransaction = createServerFn({ method: 'GET' })
  .validator(transactionIdSchema)
  .handler(async ({ data }): Promise<TransactionDetail> => {
    const supabase = createSupabaseServerClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error('Morate biti prijavljeni da biste vidjeli transakciju.')
    }

    const { data: transaction, error } = await supabase
      .from('transactions')
      .select('id, type, amount, title, category_id, transaction_date')
      .eq('id', data.transactionId)
      .eq('user_id', user.id)
      .maybeSingle()

    if (error) {
      throw new Error('Nije moguće učitati transakciju.')
    }

    if (!transaction) {
      throw notFound()
    }

    return {
      id: transaction.id,
      type: transaction.type,
      amount: Number(transaction.amount),
      title: transaction.title,
      category_id: transaction.category_id,
      transaction_date: transaction.transaction_date,
    }
  })
