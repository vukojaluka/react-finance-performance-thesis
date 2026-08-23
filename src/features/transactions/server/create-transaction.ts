import { createServerFn } from '@tanstack/react-start'

import { transactionSchema } from '@/features/transactions/schemas/transaction-form.schema'
import { createSupabaseServerClient } from '@/integrations/supabase/server'

export const createTransaction = createServerFn({ method: 'POST' })
  .validator(transactionSchema)
  .handler(async ({ data }): Promise<{ id: string }> => {
    const supabase = createSupabaseServerClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error('Morate biti prijavljeni da biste kreirali transakciju.')
    }

    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('id', data.category_id)
      .eq('user_id', user.id)
      .maybeSingle()

    if (categoryError) {
      throw new Error('Nije moguće provjeriti kategoriju.')
    }

    if (!category) {
      throw new Error('Odabrana kategorija nije dostupna.')
    }

    const { data: inserted, error } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        category_id: data.category_id,
        title: data.title,
        amount: data.amount,
        type: data.type,
        transaction_date: data.transaction_date,
      })
      .select('id')
      .single()

    if (error) {
      throw new Error('Transakciju nije moguće kreirati.')
    }

    return { id: inserted.id }
  })
