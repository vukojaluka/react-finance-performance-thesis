import { createFileRoute, useRouter } from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'

import { categoryOptionsQuery } from '@/features/categories/queries/categories.query'
import { TransactionsErrorState } from '@/features/transactions/components/transactions-error'
import { TransactionForm } from '@/features/transactions/components/form/transaction-form'
import { getRouteError } from '@/lib/route-errors'

export const Route = createFileRoute('/_protected/transactions/new')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(categoryOptionsQuery())
  },
  component: NewTransactionPage,
  errorComponent: NewTransactionError,
  head: () => ({
    meta: [
      {
        title: 'Nova transakcija - MyFinance',
      },
    ],
  }),
})

function NewTransactionPage() {
  return (
    <div className="w-full h-full min-w-0">
      <TransactionForm />
    </div>
  )
}

function NewTransactionError(props: ErrorComponentProps) {
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
