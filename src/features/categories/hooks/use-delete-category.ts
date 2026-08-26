import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { toast } from 'sonner'

import { deleteCategory } from '@/features/categories/server/delete-category'
import { getRouteError } from '@/lib/route-errors'

export function useDeleteCategory() {
  const queryClient = useQueryClient()
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
      toast.success('Kategorija je uspješno obrisana.')
    },
    onError: (error) => {
      const routeError = getRouteError({ error })
      toast.error(routeError.message)
    },
  })
}
