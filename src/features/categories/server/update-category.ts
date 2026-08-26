import { createServerFn } from '@tanstack/react-start'

import { requireAuthMiddleware } from '@/features/auth/middleware/require-auth.middleware'
import { mapCategoryDbError } from '@/features/categories/lib/map-category-db-error'
import { updateCategorySchema } from '@/features/categories/schemas/category-form.schema'
import type { CategoryListItem } from '@/features/categories/server/get-categories'

export const updateCategory = createServerFn({ method: 'POST' })
  .middleware([requireAuthMiddleware])
  .validator(updateCategorySchema)
  .handler(async ({ context, data }): Promise<CategoryListItem> => {
    const { user, supabase } = context

    const { data: existingCategory, error: existingError } = await supabase
      .from('categories')
      .select('id')
      .eq('id', data.categoryId)
      .eq('user_id', user.id)
      .maybeSingle()

    if (existingError) {
      throw new Error('Nije moguće provjeriti kategoriju.')
    }

    if (!existingCategory) {
      throw new Error('Kategorija nije pronađena.')
    }

    const { data: updated, error } = await supabase
      .from('categories')
      .update({
        name: data.data.name,
        color: data.data.color,
      })
      .eq('id', data.categoryId)
      .eq('user_id', user.id)
      .select('id, name, color')
      .single()

    if (error) {
      throw new Error(
        mapCategoryDbError(error, 'Kategoriju nije moguće ažurirati.'),
      )
    }

    return updated
  })
