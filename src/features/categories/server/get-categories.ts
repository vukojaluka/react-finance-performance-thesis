import { createServerFn } from '@tanstack/react-start'

import { createSupabaseServerClient } from '@/integrations/supabase/server'

export type CategoryListItem = {
  id: string
  name: string
  color: string
}

export const getCategories = createServerFn({ method: 'GET' }).handler(
  async (): Promise<CategoryListItem[]> => {
    const supabase = createSupabaseServerClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error('Morate biti prijavljeni da biste vidjeli kategorije.')
    }

    const { data, error } = await supabase
      .from('categories')
      .select('id, name, color')
      .eq('user_id', user.id)
      .order('name', { ascending: true })

    if (error) {
      throw new Error('Nije moguće učitati kategorije.')
    }

    return data
  },
)
