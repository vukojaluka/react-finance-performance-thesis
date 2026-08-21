import { useNavigate, useSearch } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  formatTransactionDate,
  getTransactionTypeLabel,
} from '@/features/transactions/lib/format-transaction'
import { hasActiveTransactionFilters } from '@/features/transactions/schemas/transaction-search.schema'
import type { PaginatedTransactions } from '@/features/transactions/server/get-transactions'
import { formatBam } from '@/lib/format-currency'
import { cn } from '@/lib/utils'

type TransactionsTableProps = {
  data: PaginatedTransactions
}

export function TransactionsTable({ data }: TransactionsTableProps) {
  const search = useSearch({ from: '/_protected/transactions' })
  const navigate = useNavigate({ from: '/transactions' })
  const hasFilters = hasActiveTransactionFilters(search)

  function handleClearFilters() {
    void navigate({
      search: { page: 1 },
    })
  }

  if (data.total === 0) {
    return (
      <div className="rounded-none border border-dashed border-border/60 px-4 py-10 text-center">
        <p className="text-muted-foreground text-sm">
          {hasFilters
            ? 'Nema transakcija koje odgovaraju odabranim filterima.'
            : 'Još nema transakcija.'}
        </p>
        {hasFilters ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={handleClearFilters}
          >
            Očisti filtere
          </Button>
        ) : null}
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Datum</TableHead>
          <TableHead>Opis</TableHead>
          <TableHead>Kategorija</TableHead>
          <TableHead className="hidden sm:table-cell">Tip</TableHead>
          <TableHead className="text-right">Iznos</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.data.map((transaction) => {
          const isIncome = transaction.type === 'income'

          return (
            <TableRow key={transaction.id}>
              <TableCell className="whitespace-nowrap">
                {formatTransactionDate(transaction.date)}
              </TableCell>
              <TableCell className="max-w-48 truncate font-medium">
                {transaction.title}
              </TableCell>
              <TableCell>
                <span className="inline-flex min-w-0 items-center gap-2">
                  <span
                    className="inline-block size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: transaction.categoryColor }}
                  />
                  <span className="truncate">{transaction.category}</span>
                </span>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                {getTransactionTypeLabel(transaction.type)}
              </TableCell>
              <TableCell
                className={cn(
                  'text-right font-semibold tabular-nums',
                  isIncome
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-red-600 dark:text-red-400',
                )}
              >
                {isIncome ? '+' : '-'}
                {formatBam(transaction.amount)}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
