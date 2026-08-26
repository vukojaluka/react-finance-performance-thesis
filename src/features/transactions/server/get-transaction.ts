import { createServerFn } from '@tanstack/react-start'
import { notFound } from '@tanstack/react-router'

import { requireAuthMiddleware } from '@/features/auth/middleware/require-auth.middleware'
import { transactionIdSchema } from '@/features/transactions/schemas/transaction-form.schema'
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
  .middleware([requireAuthMiddleware])
  .validator(transactionIdSchema)
  .handler(async ({ context, data }): Promise<TransactionDetail> => {
    const { user, supabase } = context

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
