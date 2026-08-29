import { useNavigate, useSearch } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { toast } from 'sonner'

import { transactionsQuery } from '@/features/transactions/queries/transactions.query'
import { deleteTransaction } from '@/features/transactions/server/delete-transaction'
import { getRouteError } from '@/lib/route-errors'

export function useDeleteTransaction() {
  const queryClient = useQueryClient()
  const navigate = useNavigate({ from: '/transactions' })
  const search = useSearch({ from: '/_protected/transactions/' })
  const deleteTransactionFn = useServerFn(deleteTransaction)

  return useMutation({
    mutationFn: async (transactionId: string) => {
      return deleteTransactionFn({ data: { transactionId } })
    },
    onSuccess: async (_, transactionId) => {
      queryClient.removeQueries({
        queryKey: ['transactions', 'detail', transactionId],
      })

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['transactions'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
        queryClient.invalidateQueries({ queryKey: ['budgets'] }),
      ])

      const refreshed = await queryClient.fetchQuery(transactionsQuery(search))
      const lastValidPage = Math.max(1, refreshed.totalPages)

      if (search.page > lastValidPage) {
        await navigate({
          search: (prev) => ({
            ...prev,
            page: lastValidPage,
          }),
        })
      }

      toast.success('Transakcija je uspješno obrisana.')
    },
    onError: (error) => {
      const routeError = getRouteError({ error })
      toast.error(routeError.message)
    },
  })
}
