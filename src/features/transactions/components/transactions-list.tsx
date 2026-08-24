import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Link, useSearch } from '@tanstack/react-router'
import { PlusIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TransactionsErrorState } from '@/features/transactions/components/transactions-error'
import { TransactionsPagination } from '@/features/transactions/components/transactions-pagination'
import { TransactionsTable } from '@/features/transactions/components/transactions-table'
import { transactionsQuery } from '@/features/transactions/queries/transactions.query'
import { cn } from '@/lib/utils'

export function TransactionsList() {
  const search = useSearch({ from: '/_protected/transactions/' })
  const { data, isError, error, refetch, isPlaceholderData, isFetching } =
    useQuery({
      ...transactionsQuery(search),
      placeholderData: keepPreviousData,
    })

  const isPending = isPlaceholderData || (isFetching && !data)

  if (isError) {
    return (
      <TransactionsErrorState
        message={
          error instanceof Error
            ? error.message
            : 'Nije moguće učitati transakcije.'
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
            POVIJEST TRANSAKCIJA
            <span className="text-xs text-muted-foreground">
              Pregled i upravljanje prihodima i rashodima
            </span>
          </CardTitle>
          <Button
            nativeButton={false}
            size="sm"
            render={<Link to="/transactions/new" search={{}} />}
          >
            Nova transakcija
            <PlusIcon className="size-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className={cn(
              'transition-opacity duration-150',
              isPending && 'opacity-60 pointer-events-none',
            )}
          >
            <TransactionsTable data={data} />
            <TransactionsPagination data={data} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
