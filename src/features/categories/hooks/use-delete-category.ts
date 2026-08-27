import { useNavigate, useSearch } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { toast } from 'sonner'

import { categoriesQuery } from '@/features/categories/queries/categories.query'
import { deleteCategory } from '@/features/categories/server/delete-category'
import { getRouteError } from '@/lib/route-errors'

export function useDeleteCategory() {
  const queryClient = useQueryClient()
  const navigate = useNavigate({ from: '/categories' })
  const search = useSearch({ from: '/_protected/categories/' })
  const deleteCategoryFn = useServerFn(deleteCategory)

  return useMutation({
    mutationFn: async (categoryId: string) => {
      return deleteCategoryFn({ data: { categoryId } })
    },
    onSuccess: async (_, categoryId) => {
      queryClient.removeQueries({
        queryKey: ['categories', 'detail', categoryId],
      })

      await queryClient.invalidateQueries({ queryKey: ['categories'] })

      const refreshed = await queryClient.fetchQuery(categoriesQuery(search))
      const lastValidPage = Math.max(1, refreshed.totalPages)

      if (search.page > lastValidPage) {
        await navigate({
          search: (prev) => ({
            ...prev,
            page: lastValidPage,
          }),
        })
      }

      toast.success('Kategorija je uspješno obrisana.')
    },
    onError: (error) => {
      const routeError = getRouteError({ error })
      toast.error(routeError.message)
    },
  })
}
