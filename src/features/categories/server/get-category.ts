import { createServerFn } from '@tanstack/react-start'
import { notFound } from '@tanstack/react-router'

import { requireAuthMiddleware } from '@/features/auth/middleware/require-auth.middleware'
import { categoryIdSchema } from '@/features/categories/schemas/category-form.schema'
import type { CategoryListItem } from '@/features/categories/server/get-categories'

export const getCategory = createServerFn({ method: 'GET' })
  .middleware([requireAuthMiddleware])
  .validator(categoryIdSchema)
  .handler(async ({ context, data }): Promise<CategoryListItem> => {
    const { user, supabase } = context

    const { data: category, error } = await supabase
      .from('categories')
      .select('id, name, color')
      .eq('id', data.categoryId)
      .eq('user_id', user.id)
      .maybeSingle()

    if (error) {
      throw new Error('Nije moguće učitati kategoriju.')
    }

    if (!category) {
      throw notFound()
    }

    return category
  })
