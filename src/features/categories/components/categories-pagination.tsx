import { useNavigate, useSearch } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import type { PaginatedCategories } from '@/features/categories/server/get-categories'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

type CategoriesPaginationProps = {
  data: PaginatedCategories
}

export function CategoriesPagination({ data }: CategoriesPaginationProps) {
  const search = useSearch({ from: '/_protected/categories/' })
  const navigate = useNavigate({ from: '/categories' })

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
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-4">
      <p className="text-muted-foreground text-sm text-center sm:text-left">
        Stranica {search.page} od {data.totalPages}
      </p>
      <div className="flex items-center gap-2">
        <Button
          className="grow"
          type="button"
          variant="outline"
          size="sm"
          disabled={isFirstPage}
          onClick={() => goToPage(search.page - 1)}
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
          onClick={() => goToPage(search.page + 1)}
        >
          Sljedeća
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>
    </div>
  )
}
