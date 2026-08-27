import { createServerFn } from '@tanstack/react-start'
import { notFound } from '@tanstack/react-router'

import { requireAuthMiddleware } from '@/features/auth/middleware/require-auth.middleware'
import { budgetIdSchema } from '@/features/budgets/schemas/budget-form.schema'

export type BudgetDetail = {
  id: string
  category_id: string
  amount: number
  month: number
  year: number
}

export const getBudget = createServerFn({ method: 'GET' })
  .middleware([requireAuthMiddleware])
  .validator(budgetIdSchema)
  .handler(async ({ context, data }): Promise<BudgetDetail> => {
    const { user, supabase } = context

    const { data: budget, error } = await supabase
      .from('budgets')
      .select('id, category_id, amount, month, year')
      .eq('id', data.budgetId)
      .eq('user_id', user.id)
      .maybeSingle()

    if (error) {
      throw new Error('Nije moguće učitati budžet.')
    }

    if (!budget) {
      throw notFound()
    }

    return {
      id: budget.id,
      category_id: budget.category_id,
      amount: Number(budget.amount),
      month: budget.month,
      year: budget.year,
    }
  })
