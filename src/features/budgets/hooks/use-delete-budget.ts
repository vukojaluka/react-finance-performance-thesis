import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { toast } from 'sonner'

import { deleteBudget } from '@/features/budgets/server/delete-budget'
import { getRouteError } from '@/lib/route-errors'

export function useDeleteBudget() {
  const queryClient = useQueryClient()
  const deleteBudgetFn = useServerFn(deleteBudget)

  return useMutation({
    mutationFn: async (budgetId: string) => {
      return deleteBudgetFn({ data: { budgetId } })
    },
    onSuccess: async (_, budgetId) => {
      queryClient.removeQueries({
        queryKey: ['budgets', 'detail', budgetId],
      })

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['budgets'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
      ])

      toast.success('Budžet je uspješno obrisan.')
    },
    onError: (error) => {
      const routeError = getRouteError({ error })
      toast.error(routeError.message)
    },
  })
}
