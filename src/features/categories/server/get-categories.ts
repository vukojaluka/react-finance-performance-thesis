import { createServerFn } from '@tanstack/react-start'
import type { SupabaseClient } from '@supabase/supabase-js'

import { requireAuthMiddleware } from '@/features/auth/middleware/require-auth.middleware'
import { CATEGORIES_PAGE_SIZE } from '@/features/categories/lib/constants'
import { categorySearchSchema } from '@/features/categories/schemas/category-search.schema'
import type { CategoryFilters } from '@/features/categories/schemas/category-search.schema'
import type { Database } from '@/integrations/supabase/database.types'

export type CategoryListItem = {
  id: string
  name: string
  color: string
}

export type PaginatedCategories = {
  data: CategoryListItem[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}

async function fetchCategoriesPage(
  supabase: SupabaseClient<Database>,
  userId: string,
  filters: CategoryFilters,
  page: number,
): Promise<{ rows: CategoryListItem[]; total: number }> {
  const from = (page - 1) * CATEGORIES_PAGE_SIZE
  const to = from + CATEGORIES_PAGE_SIZE - 1

  let query = supabase
    .from('categories')
    .select('id, name, color', { count: 'exact' })
    .eq('user_id', userId)
    .order('name', { ascending: true })
    .range(from, to)

  if (filters.search) {
    const sanitizedSearch = filters.search.replace(/[%_,()]/g, '')

    if (sanitizedSearch) {
      query = query.ilike('name', `%${sanitizedSearch}%`)
    }
  }

  const { data: rows, error, count } = await query

  if (error) {
    throw new Error('Nije moguće učitati kategorije.')
  }

  return {
    rows,
    total: count ?? 0,
  }
}

export const getCategories = createServerFn({ method: 'GET' })
  .middleware([requireAuthMiddleware])
  .validator((input: unknown) => {
    if (input == null) {
      return undefined
    }

    return categorySearchSchema.parse(input)
  })
  .handler(
    async ({
      context,
      data: filters,
    }): Promise<CategoryListItem[] | PaginatedCategories> => {
      const { user, supabase } = context

      if (!filters) {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name, color')
          .eq('user_id', user.id)
          .order('name', { ascending: true })

        if (error) {
          throw new Error('Nije moguće učitati kategorije.')
        }

        return data
      }

      const firstPage = await fetchCategoriesPage(
        supabase,
        user.id,
        filters,
        filters.page,
      )
      const totalPages =
        firstPage.total === 0
          ? 0
          : Math.ceil(firstPage.total / CATEGORIES_PAGE_SIZE)

      if (totalPages === 0) {
        return {
          data: [],
          page: 1,
          pageSize: CATEGORIES_PAGE_SIZE,
          total: 0,
          totalPages: 0,
        }
      }

      const clampedPage = Math.min(filters.page, totalPages)

      if (clampedPage !== filters.page) {
        const clamped = await fetchCategoriesPage(
          supabase,
          user.id,
          filters,
          clampedPage,
        )

        return {
          data: clamped.rows,
          page: clampedPage,
          pageSize: CATEGORIES_PAGE_SIZE,
          total: clamped.total,
          totalPages,
        }
      }

      return {
        data: firstPage.rows,
        page: filters.page,
        pageSize: CATEGORIES_PAGE_SIZE,
        total: firstPage.total,
        totalPages,
      }
    },
  )
