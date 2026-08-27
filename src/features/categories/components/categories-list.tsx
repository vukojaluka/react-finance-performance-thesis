import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Link, useSearch } from '@tanstack/react-router'
import { PlusIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CategoriesErrorState } from '@/features/categories/components/categories-error'
import { CategoriesPagination } from '@/features/categories/components/categories-pagination'
import { CategoriesTable } from '@/features/categories/components/categories-table'
import { categoriesQuery } from '@/features/categories/queries/categories.query'
import { cn } from '@/lib/utils'

export function CategoriesList() {
  const search = useSearch({ from: '/_protected/categories/' })
  const { data, isError, error, refetch, isPlaceholderData, isFetching } =
    useQuery({
      ...categoriesQuery(search),
      placeholderData: keepPreviousData,
    })

  const isPending = isPlaceholderData || (isFetching && !data)

  if (isError) {
    return (
      <CategoriesErrorState
        message={
          error instanceof Error
            ? error.message
            : 'Nije moguće učitati kategorije.'
        }
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  if (!data) {
    return null
  }

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <Card size="sm" className="min-w-0">
        <CardHeader className="pb-0 flex justify-between">
          <CardTitle className="text-sm tracking-normal normal-case flex flex-col gap-1">
            KATEGORIJE
            <span className="text-xs text-muted-foreground">
              Pregled i upravljanje kategorijama transakcija
            </span>
          </CardTitle>
          <Button
            nativeButton={false}
            size="sm"
            render={<Link to="/categories/new" />}
          >
            Nova kategorija
            <PlusIcon className="size-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              'transition-opacity duration-150',
              isPending && 'opacity-60 pointer-events-none',
            )}
          >
            <CategoriesTable categories={data.data} />
            <CategoriesPagination data={data} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
