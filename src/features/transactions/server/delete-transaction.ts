import { createServerFn } from '@tanstack/react-start'

import { transactionIdSchema } from '@/features/transactions/schemas/transaction-form.schema'
import { createSupabaseServerClient } from '@/integrations/supabase/server'

export const deleteTransaction = createServerFn({ method: 'POST' })
  .validator(transactionIdSchema)
  .handler(async ({ data }): Promise<{ id: string }> => {
    const supabase = createSupabaseServerClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error('Morate biti prijavljeni da biste obrisali transakciju.')
    }

    const { data: deleted, error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', data.transactionId)
      .eq('user_id', user.id)
      .select('id')
      .maybeSingle()

    if (error) {
      throw new Error('Transakciju nije moguće obrisati.')
    }

    if (!deleted) {
      throw new Error('Transakcija nije pronađena.')
    }

    return { id: deleted.id }
  })
