import { useNavigate, useSearch } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import type { PaginatedTransactions } from '@/features/transactions/server/get-transactions'

type TransactionsPaginationProps = {
  data: PaginatedTransactions
}

export function TransactionsPagination({ data }: TransactionsPaginationProps) {
  const search = useSearch({ from: '/_protected/transactions/' })
  const navigate = useNavigate({ from: '/transactions' })

  if (data.totalPages <= 1) {
    return null
  }

  const isFirstPage = search.page <= 1
  const isLastPage = search.page >= data.totalPages

  function goToPage(page: number) {
    void navigate({
      search: (prev) => ({
        ...prev,
        page,
      }),
    })
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-muted-foreground text-sm">
        Stranica {search.page} od {data.totalPages}
      </p>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isFirstPage}
          onClick={() => goToPage(search.page - 1)}
        >
          Prethodna
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isLastPage}
          onClick={() => goToPage(search.page + 1)}
        >
          Sljedeća
        </Button>
      </div>
    </div>
  )
}
