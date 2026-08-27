import { Link, createFileRoute, useRouter } from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'
import { z } from 'zod'
import { ArrowLeftIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BudgetForm } from '@/features/budgets/components/form/budget-form'
import { BudgetFormCardSkeleton } from '@/features/budgets/components/form/budget-form-card'
import { budgetQuery } from '@/features/budgets/queries/budgets.query'
import { categoriesQuery } from '@/features/categories/queries/categories.query'
import { getRouteError } from '@/lib/route-errors'

export const Route = createFileRoute('/_protected/budgets/$budgetId/edit')({
  params: {
    parse: (params) => ({
      budgetId: z
        .guid({ error: 'Pogrešan ID budžeta' })
        .parse(params.budgetId),
    }),
    stringify: ({ budgetId }) => ({ budgetId }),
  },
  loader: async ({ context, params }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(budgetQuery(params.budgetId)),
      context.queryClient.ensureQueryData(categoriesQuery()),
    ])
  },
  pendingComponent: EditBudgetPending,
  component: EditBudgetPage,
  notFoundComponent: EditBudgetNotFound,
  errorComponent: EditBudgetError,
  head: () => ({
    meta: [
      {
        title: 'Uredi budžet - MyFinance',
      },
    ],
  }),
})

function EditBudgetPage() {
  const { budgetId } = Route.useParams()

  return (
    <div className="w-full h-full min-w-0">
      <BudgetForm mode="edit" budgetId={budgetId} />
    </div>
  )
}

function EditBudgetPending() {
  return (
    <div className="w-full h-full min-w-0">
      <BudgetFormCardSkeleton />
    </div>
  )
}

function EditBudgetError(props: ErrorComponentProps) {
  const router = useRouter()
  const routeError = getRouteError(props)
  const isValidationError = routeError.kind === 'validation'

  return (
    <Card size="sm" className="max-w-xl min-w-0">
      <CardHeader>
        <CardTitle className="text-sm tracking-normal normal-case">
          {isValidationError
            ? 'Neispravan ID budžeta'
            : 'Nije moguće učitati budžet'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-muted-foreground text-sm">{routeError.message}</p>
        <div className="flex flex-wrap gap-2">
          {!isValidationError ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void router.invalidate()}
            >
              Pokušaj ponovno
            </Button>
          ) : null}
          <Button
            nativeButton={false}
            type="button"
            variant="outline"
            size="sm"
            render={<Link to="/budgets" />}
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Natrag na budžete
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function EditBudgetNotFound() {
  return (
    <Card size="sm" className="max-w-xl min-w-0">
      <CardHeader>
        <CardTitle className="text-sm tracking-normal normal-case">
          Budžet nije pronađen
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-muted-foreground text-sm">
          Traženi budžet ne postoji ili nemate pristup za njegovo uređivanje.
        </p>
        <Button
          nativeButton={false}
          type="button"
          variant="outline"
          size="sm"
          render={<Link to="/budgets" />}
        >
          Natrag na budžete
        </Button>
      </CardContent>
    </Card>
  )
}
