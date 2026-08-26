import { createServerFn } from '@tanstack/react-start'

import { requireAuthMiddleware } from '@/features/auth/middleware/require-auth.middleware'
import { mapCategoryDbError } from '@/features/categories/lib/map-category-db-error'
import { categoryIdSchema } from '@/features/categories/schemas/category-form.schema'

export const deleteCategory = createServerFn({ method: 'POST' })
  .middleware([requireAuthMiddleware])
  .validator(categoryIdSchema)
  .handler(async ({ context, data }): Promise<{ id: string }> => {
    const { user, supabase } = context

    const { data: deleted, error } = await supabase
      .from('categories')
      .delete()
      .eq('id', data.categoryId)
      .eq('user_id', user.id)
      .select('id')
      .maybeSingle()

    if (error) {
      throw new Error(
        mapCategoryDbError(error, 'Kategoriju nije moguće obrisati.'),
      )
    }

    if (!deleted) {
      throw new Error('Kategorija nije pronađena.')
    }

    return { id: deleted.id }
  })
