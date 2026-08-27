import { createServerFn } from '@tanstack/react-start'

import { requireAuthMiddleware } from '@/features/auth/middleware/require-auth.middleware'
import { budgetIdSchema } from '@/features/budgets/schemas/budget-form.schema'

export const deleteBudget = createServerFn({ method: 'POST' })
  .middleware([requireAuthMiddleware])
  .validator(budgetIdSchema)
  .handler(async ({ context, data }): Promise<{ id: string }> => {
    const { user, supabase } = context

    const { data: deleted, error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', data.budgetId)
      .eq('user_id', user.id)
      .select('id')
      .maybeSingle()

    if (error) {
      throw new Error('Budžet nije moguće obrisati.')
    }

    if (!deleted) {
      throw new Error('Budžet nije pronađen.')
    }

    return { id: deleted.id }
  })
