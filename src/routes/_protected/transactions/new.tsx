import { createFileRoute } from '@tanstack/react-router'

import { categoriesQuery } from '@/features/categories/queries/categories.query'
import { TransactionForm } from '@/features/transactions/components/transaction-form'

export const Route = createFileRoute('/_protected/transactions/new')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(categoriesQuery())
  },
  component: NewTransactionPage,
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
