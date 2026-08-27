import { createFileRoute, stripSearchParams, useRouter } from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'

import { BudgetForm } from '@/features/budgets/components/budget-form'
import { BudgetsErrorState } from '@/features/budgets/components/budgets-error'
import { categoriesQuery } from '@/features/categories/queries/categories.query'
import {
  BUDGET_SEARCH_DEFAULTS,
  budgetSearchSchema,
} from '@/features/budgets/schemas/budget-search.schema'
import { getRouteError } from '@/lib/route-errors'

export const Route = createFileRoute('/_protected/budgets/new')({
  validateSearch: budgetSearchSchema,
  search: {
    middlewares: [stripSearchParams(BUDGET_SEARCH_DEFAULTS)],
  },
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(categoriesQuery())
  },
  component: NewBudgetPage,
  errorComponent: NewBudgetError,
  head: () => ({
    meta: [
      {
        title: 'Novi budžet - MyFinance',
      },
    ],
  }),
})

function NewBudgetPage() {
  return (
    <div className="w-full h-full min-w-0">
      <BudgetForm />
    </div>
  )
}

function NewBudgetError(props: ErrorComponentProps) {
  const router = useRouter()
  const routeError = getRouteError(props)

  return (
    <BudgetsErrorState
      message={routeError.message}
      onRetry={() => {
        void router.invalidate()
      }}
    />
  )
}
