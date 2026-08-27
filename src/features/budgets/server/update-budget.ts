import { createServerFn } from '@tanstack/react-start'

import { requireAuthMiddleware } from '@/features/auth/middleware/require-auth.middleware'
import { mapBudgetDbError } from '@/features/budgets/lib/map-budget-db-error'
import { updateBudgetSchema } from '@/features/budgets/schemas/budget-form.schema'

export const updateBudget = createServerFn({ method: 'POST' })
  .middleware([requireAuthMiddleware])
  .validator(updateBudgetSchema)
  .handler(async ({ context, data }): Promise<{ id: string }> => {
    const { user, supabase } = context

    const { data: existingBudget, error: existingError } = await supabase
      .from('budgets')
      .select('id')
      .eq('id', data.budgetId)
      .eq('user_id', user.id)
      .maybeSingle()

    if (existingError) {
      throw new Error('Nije moguće provjeriti budžet.')
    }

    if (!existingBudget) {
      throw new Error('Budžet nije pronađen.')
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
      .from('budgets')
      .update({
        category_id: data.data.category_id,
        amount: data.data.amount,
        month: data.data.month,
        year: data.data.year,
      })
      .eq('id', data.budgetId)
      .eq('user_id', user.id)
      .select('id')
      .single()

    if (error) {
      throw new Error(
        mapBudgetDbError(error, 'Budžet nije moguće ažurirati.'),
      )
    }

    return { id: updated.id }
  })
