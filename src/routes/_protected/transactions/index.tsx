import {
  createFileRoute,
  stripSearchParams,
  useRouter,
} from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'

import { categoriesQuery } from '@/features/categories/queries/categories.query'
import { TransactionsErrorState } from '@/features/transactions/components/transactions-error'
import { TransactionsFilters } from '@/features/transactions/components/transactions-filters'
import { TransactionsList } from '@/features/transactions/components/transactions-list'
import { transactionsQuery } from '@/features/transactions/queries/transactions.query'
import {
  TRANSACTION_SEARCH_DEFAULTS,
  transactionFiltersSchema,
} from '@/features/transactions/schemas/transaction-search.schema'
import { getRouteError } from '@/lib/route-errors'

export const Route = createFileRoute('/_protected/transactions/')({
  validateSearch: transactionFiltersSchema,
  search: {
    middlewares: [
      stripSearchParams({
        sort: TRANSACTION_SEARCH_DEFAULTS.sort,
        sortDirection: TRANSACTION_SEARCH_DEFAULTS.sortDirection,
      }),
    ],
  },
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps: search }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(transactionsQuery(search)),
      context.queryClient.ensureQueryData(categoriesQuery()),
    ])
  },
  component: TransactionsIndexPage,
  errorComponent: TransactionsIndexError,
  head: () => ({
    meta: [
      {
        title: 'Transakcije - MyFinance',
      },
    ],
  }),
})

function TransactionsIndexPage() {
  return (
    <div className="flex h-full min-w-0 flex-col gap-2 lg:gap-4">
      <TransactionsFilters />
      <TransactionsList />
    </div>
  )
}

function TransactionsIndexError(props: ErrorComponentProps) {
  const router = useRouter()
  const routeError = getRouteError(props)

  return (
    <TransactionsErrorState
      message={routeError.message}
      onRetry={() => {
        void router.invalidate()
      }}
    />
  )
}
