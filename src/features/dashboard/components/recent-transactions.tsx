import { Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { formatBam } from '@/lib/format-currency'

import { recentTransactionsQuery } from '../queries/recent-transactions.query'
import type { RecentTransaction } from '../server/get-recent-transactions'
import { ArrowRightIcon } from 'lucide-react'

const dateFormatter = new Intl.DateTimeFormat('hr-HR', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

function formatTransactionDate(date: string): string {
  const [year, month, day] = date.split('-').map(Number)
  return dateFormatter.format(new Date(year, month - 1, day))
}

function RecentTransactionItem({
  transaction,
}: {
  transaction: RecentTransaction
}) {
  const isIncome = transaction.type === 'income'

  return (
    <li className="flex items-start justify-between gap-3 border-b py-3 last:border-0">
      <div className="min-w-0 space-y-1">
        <p className="truncate font-medium">{transaction.title}</p>
        <p className="text-muted-foreground truncate text-xs">
          {transaction.category}
        </p>
        <p className="text-muted-foreground text-xs">
          {formatTransactionDate(transaction.date)}
        </p>
      </div>
      <p
        className={cn(
          'shrink-0 text-sm font-semibold tabular-nums',
          isIncome
            ? 'text-emerald-600 dark:text-emerald-400'
            : 'text-red-600 dark:text-red-400',
        )}
      >
        {isIncome ? '+' : '-'}
        {formatBam(transaction.amount)}
      </p>
    </li>
  )
}

function RecentTransactionsContent() {
  const { data } = useSuspenseQuery(recentTransactionsQuery())

  return (
    <Card size="sm" className="min-w-0 h-full min-h-128">
      <CardHeader>
        <CardTitle className="text-sm tracking-normal normal-case line-clamp-1">
          Nedavne transakcije
        </CardTitle>
        <CardAction>
          <Button
            nativeButton={false}
            variant="ghost"
            size="xs"
            render={<Link to="/transactions" />}
          >
            Prikaži sve
            <ArrowRightIcon className="w-4 h-4" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Nema transakcija za prikaz.
          </p>
        ) : (
          <ul className="divide-y">
            {data.map((transaction) => (
              <RecentTransactionItem
                key={transaction.id}
                transaction={transaction}
              />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

export function RecentTransactionsSkeleton() {
  return (
    <Card size="sm" className="min-w-0 h-128">
      <CardHeader className="flex flex-row items-center justify-between">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-7 w-24" />
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="space-y-2 border-b pb-3 last:border-0">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function RecentTransactions() {
  return <RecentTransactionsContent />
}
