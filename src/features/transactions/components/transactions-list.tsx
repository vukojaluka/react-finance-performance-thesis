import { useQuery } from '@tanstack/react-query'
import { Link, useSearch } from '@tanstack/react-router'
import { PlusIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { transactionsQuery } from '../queries/transactions.query'
import { TransactionsErrorState } from './transactions-error'
import { TransactionsPagination } from './transactions-pagination'
import { TransactionsTable } from './transactions-table'

export function TransactionsList() {
  const search = useSearch({ from: '/_protected/transactions' })
  const { data, isError, error, refetch } = useQuery(transactionsQuery(search))

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
            render={<Link to="/transactions/new" />}
          >
            Nova transakcija
            <PlusIcon className="size-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <TransactionsTable data={data} />
          <TransactionsPagination data={data} />
        </CardContent>
      </Card>
    </div>
  )
}
