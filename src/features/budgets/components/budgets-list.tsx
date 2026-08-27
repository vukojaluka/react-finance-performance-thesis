import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Link, useSearch } from '@tanstack/react-router'
import { PlusIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  BudgetCategoryCard,
  BudgetCategoryCardSkeleton,
} from '@/features/budgets/components/budget-category-card'
import {
  BudgetOverviewCard,
  BudgetOverviewCardSkeleton,
} from '@/features/budgets/components/budget-overview-card'
import { BudgetsErrorState } from '@/features/budgets/components/budgets-error'
import { BudgetsPeriodNavigation } from '@/features/budgets/components/budgets-period-navigation'
import { budgetsQuery } from '@/features/budgets/queries/budgets.query'
import { cn } from '@/lib/utils'

export function BudgetsList() {
  const search = useSearch({ from: '/_protected/budgets/' })
  const { data, isError, error, refetch, isPlaceholderData, isFetching } =
    useQuery({
      ...budgetsQuery(search),
      placeholderData: keepPreviousData,
    })

  const isPending = isPlaceholderData || (isFetching && !data)

  if (isError) {
    return (
      <BudgetsErrorState
        message={
          error instanceof Error
            ? error.message
            : 'Nije moguće učitati budžete.'
        }
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  if (!data) {
    return <BudgetsPageSkeleton />
  }

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <Card size="sm" className="min-w-0">
        <CardHeader className="flex flex-col gap-4 pb-0 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-sm tracking-normal normal-case flex flex-col gap-1">
            BUDŽETI
            <span className="text-xs text-muted-foreground">
              Praćenje mjesečnih budžeta
            </span>
          </CardTitle>
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <BudgetsPeriodNavigation />
            <Button
              nativeButton={false}
              size="sm"
              className="w-full sm:w-auto"
              render={
                <Link
                  to="/budgets/new"
                  search={{ month: search.month, year: search.year }}
                />
              }
            >
              Novi budžet
              <PlusIcon className="size-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent
          className={cn(
            'space-y-4 transition-opacity duration-150',
            isPending && 'opacity-60 pointer-events-none',
          )}
        >
          <BudgetOverviewCard summary={data.summary} />

          {data.categories.length === 0 ? (
            <div className="rounded-none border border-dashed border-border/60 px-4 py-10 text-center">
              <p className="text-muted-foreground text-sm">
                Za odabrani mjesec nema postavljenih budžeta.
              </p>
              <Button
                nativeButton={false}
                size="sm"
                className="mt-4"
                render={
                  <Link
                    to="/budgets/new"
                    search={{ month: search.month, year: search.year }}
                  />
                }
              >
                Novi budžet
                <PlusIcon className="size-4" />
              </Button>
            </div>
          ) : (
            <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {data.categories.map((budget) => (
                <BudgetCategoryCard key={budget.budgetId} budget={budget} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export function BudgetsPageSkeleton() {
  return (
    <div className="flex min-w-0 flex-col gap-4">
      <Card size="sm" className="min-w-0">
        <CardHeader className="flex flex-col gap-4 pb-0 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-48" />
          </div>
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <Skeleton className="h-9 w-52" />
            <Skeleton className="h-9 w-32" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <BudgetOverviewCardSkeleton />
          <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <BudgetCategoryCardSkeleton key={index} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
