import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useSearch } from '@tanstack/react-router'
import { PlusIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CategoriesErrorState } from '@/features/categories/components/categories-error'
import { CategoriesTable } from '@/features/categories/components/categories-table'
import { categoriesQuery } from '@/features/categories/queries/categories.query'
import { filterCategoriesBySearch } from '@/features/categories/schemas/category-search.schema'
import { cn } from '@/lib/utils'

export function CategoriesList() {
  const search = useSearch({ from: '/_protected/categories/' })
  const { data, isError, error, refetch, isFetching } = useQuery(
    categoriesQuery(),
  )

  const filteredCategories = useMemo(
    () => filterCategoriesBySearch(data ?? [], search.search),
    [data, search.search],
  )

  const isPending = isFetching && !data

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
            <CategoriesTable categories={filteredCategories} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
