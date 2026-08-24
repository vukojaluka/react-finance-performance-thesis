import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { categoriesQuery } from '@/features/categories/queries/categories.query'
import { TransactionForm } from '@/features/transactions/components/transaction-form'
import { TransactionFormSkeleton } from '@/features/transactions/components/transaction-form-skeleton'
import { transactionQuery } from '@/features/transactions/queries/transactions.query'

export const Route = createFileRoute(
  '/_protected/transactions/$transactionId/edit',
)({
  params: {
    parse: (params) => ({
      transactionId: z.guid().parse(params.transactionId),
    }),
    stringify: ({ transactionId }) => ({ transactionId }),
  },
  loader: async ({ context, params }) => {
    try {
      await Promise.all([
        context.queryClient.ensureQueryData(
          transactionQuery(params.transactionId),
        ),
        context.queryClient.ensureQueryData(categoriesQuery()),
      ])
    } catch {
      throw notFound()
    }
  },
  pendingComponent: EditTransactionPending,
  component: EditTransactionPage,
  notFoundComponent: EditTransactionNotFound,
  head: () => ({
    meta: [
      {
        title: 'Uredi transakciju - MyFinance',
      },
    ],
  }),
})

function EditTransactionPage() {
  const { transactionId } = Route.useParams()

  return (
    <div className="w-full h-full min-w-0">
      <TransactionForm mode="edit" transactionId={transactionId} />
    </div>
  )
}

function EditTransactionPending() {
  return (
    <div className="w-full h-full min-w-0">
      <TransactionFormSkeleton />
    </div>
  )
}

function EditTransactionNotFound() {
  return (
    <Card size="sm" className="max-w-xl min-w-0">
      <CardHeader>
        <CardTitle className="text-sm tracking-normal normal-case">
          Transakcija nije pronađena
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-muted-foreground text-sm">
          Tražena transakcija ne postoji ili nemate pristup za njezino uređivanje.
        </p>
        <Button
          nativeButton={false}
          type="button"
          variant="outline"
          size="sm"
          render={<Link to="/transactions" search={{ page: 1 }} />}
        >
          Natrag na transakcije
        </Button>
      </CardContent>
    </Card>
  )
}
