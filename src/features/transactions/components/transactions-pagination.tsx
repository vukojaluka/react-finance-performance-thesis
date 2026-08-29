import { useNavigate } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import type { PaginatedTransactions } from '@/features/transactions/server/get-transactions'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

type TransactionsPaginationProps = {
  data: PaginatedTransactions
}

export function TransactionsPagination({ data }: TransactionsPaginationProps) {
  const navigate = useNavigate({ from: '/transactions' })

  if (data.totalPages <= 1) {
    return null
  }

  const currentPage = data.page
  const isFirstPage = currentPage <= 1
  const isLastPage = currentPage >= data.totalPages

  function goToPage(page: number) {
    void navigate({
      search: (prev) => ({
        ...prev,
        page,
      }),
    })
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-4">
      <p className="text-muted-foreground text-sm text-center sm:text-left">
        Stranica {currentPage} od {data.totalPages}
      </p>
      <div className="flex items-center gap-2">
        <Button
          className="grow"
          type="button"
          variant="outline"
          size="sm"
          disabled={isFirstPage}
          onClick={() => goToPage(currentPage - 1)}
        >
          <ChevronLeftIcon className="size-4" />
          Prethodna
        </Button>
        <Button
          className="grow"
          type="button"
          variant="outline"
          size="sm"
          disabled={isLastPage}
          onClick={() => goToPage(currentPage + 1)}
        >
          Sljedeća
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>
    </div>
  )
}
