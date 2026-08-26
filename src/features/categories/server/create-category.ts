import { createServerFn } from '@tanstack/react-start'

import { requireAuthMiddleware } from '@/features/auth/middleware/require-auth.middleware'
import { mapCategoryDbError } from '@/features/categories/lib/map-category-db-error'
import { categorySchema } from '@/features/categories/schemas/category-form.schema'
import type { CategoryListItem } from '@/features/categories/server/get-categories'

export const createCategory = createServerFn({ method: 'POST' })
  .middleware([requireAuthMiddleware])
  .validator(categorySchema)
  .handler(async ({ context, data }): Promise<CategoryListItem> => {
    const { user, supabase } = context

    const { data: inserted, error } = await supabase
      .from('categories')
      .insert({
        user_id: user.id,
        name: data.name,
        color: data.color,
      })
      .select('id, name, color')
      .single()

    if (error) {
      throw new Error(
        mapCategoryDbError(error, 'Kategoriju nije moguće kreirati.'),
      )
    }

    return inserted
  })
