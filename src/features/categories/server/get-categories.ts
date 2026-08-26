import { createServerFn } from '@tanstack/react-start'

import { requireAuthMiddleware } from '@/features/auth/middleware/require-auth.middleware'

export type CategoryListItem = {
  id: string
  name: string
  color: string
}

export const getCategories = createServerFn({ method: 'GET' })
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
