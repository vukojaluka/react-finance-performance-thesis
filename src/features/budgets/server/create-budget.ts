import { createServerFn } from '@tanstack/react-start'

import { requireAuthMiddleware } from '@/features/auth/middleware/require-auth.middleware'
import { mapBudgetDbError } from '@/features/budgets/lib/map-budget-db-error'
import { budgetSchema } from '@/features/budgets/schemas/budget-form.schema'

export const createBudget = createServerFn({ method: 'POST' })
  .middleware([requireAuthMiddleware])
  .validator(budgetSchema)
  .handler(async ({ context, data }): Promise<{ id: string }> => {
    const { user, supabase } = context

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
      .from('budgets')
      .insert({
        user_id: user.id,
        category_id: data.category_id,
        amount: data.amount,
        month: data.month,
        year: data.year,
      })
      .select('id')
      .single()

    if (error) {
      throw new Error(
        mapBudgetDbError(error, 'Budžet nije moguće kreirati.'),
      )
    }

    return { id: inserted.id }
  })
