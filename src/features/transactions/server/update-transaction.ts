import { createServerFn } from '@tanstack/react-start'

import { updateTransactionSchema } from '@/features/transactions/schemas/transaction-form.schema'
import { createSupabaseServerClient } from '@/integrations/supabase/server'

export const updateTransaction = createServerFn({ method: 'POST' })
  .validator(updateTransactionSchema)
  .handler(async ({ data }): Promise<{ id: string }> => {
    const supabase = createSupabaseServerClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error('Morate biti prijavljeni da biste ažurirali transakciju.')
    }

    const { data: existingTransaction, error: existingError } = await supabase
      .from('transactions')
      .select('id')
      .eq('id', data.transactionId)
      .eq('user_id', user.id)
      .maybeSingle()

    if (existingError) {
      throw new Error('Nije moguće provjeriti transakciju.')
    }

    if (!existingTransaction) {
      throw new Error('Transakcija nije pronađena.')
    }

    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('id', data.data.category_id)
      .eq('user_id', user.id)
      .maybeSingle()

    if (categoryError) {
      throw new Error('Nije moguće provjeriti kategoriju.')
    }

    if (!category) {
      throw new Error('Odabrana kategorija nije dostupna.')
    }

    const { data: updated, error } = await supabase
      .from('transactions')
      .update({
        category_id: data.data.category_id,
        title: data.data.title,
        amount: data.data.amount,
        type: data.data.type,
        transaction_date: data.data.transaction_date,
      })
      .eq('id', data.transactionId)
      .eq('user_id', user.id)
      .select('id')
      .single()

    if (error) {
      throw new Error('Transakciju nije moguće ažurirati.')
    }

    return { id: updated.id }
  })
