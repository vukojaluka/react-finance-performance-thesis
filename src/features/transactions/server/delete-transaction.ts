import { createServerFn } from '@tanstack/react-start'

import { requireAuthMiddleware } from '@/features/auth/middleware/require-auth.middleware'
import { transactionIdSchema } from '@/features/transactions/schemas/transaction-form.schema'

export const deleteTransaction = createServerFn({ method: 'POST' })
  .middleware([requireAuthMiddleware])
  .validator(transactionIdSchema)
  .handler(async ({ context, data }): Promise<{ id: string }> => {
    const { user, supabase } = context

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
