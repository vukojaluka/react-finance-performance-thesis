import { createServerFn } from '@tanstack/react-start'

import { requireAuthMiddleware } from '@/features/auth/middleware/require-auth.middleware'
import type { CategoryListItem } from '@/features/categories/server/get-categories'

export const getCategoryOptions = createServerFn({ method: 'GET' })
  .middleware([requireAuthMiddleware])
  .handler(async ({ context }): Promise<CategoryListItem[]> => {
    const { user, supabase } = context

    const { data, error } = await supabase
      .from('categories')
      .select('id, name, color')
      .eq('user_id', user.id)
      .order('name', { ascending: true })

    if (error) {
      throw new Error('Nije moguće učitati kategorije.')
    }

    return data
  })
