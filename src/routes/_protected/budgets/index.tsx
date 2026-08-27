import {
  createFileRoute,
  stripSearchParams,
  useRouter,
} from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'

import { BudgetsErrorState } from '@/features/budgets/components/budgets-error'
import { BudgetsList } from '@/features/budgets/components/budgets-list'
import { budgetsQuery } from '@/features/budgets/queries/budgets.query'
import {
  BUDGET_SEARCH_DEFAULTS,
  budgetSearchSchema,
} from '@/features/budgets/schemas/budget-search.schema'
import { getRouteError } from '@/lib/route-errors'

export const Route = createFileRoute('/_protected/budgets/')({
  validateSearch: budgetSearchSchema,
  search: {
    middlewares: [stripSearchParams(BUDGET_SEARCH_DEFAULTS)],
  },
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps: search }) => {
    await context.queryClient.ensureQueryData(budgetsQuery(search))
  },
  component: BudgetsIndexPage,
  errorComponent: BudgetsIndexError,
  head: () => ({
    meta: [
      {
        title: 'Budžeti - MyFinance',
      },
    ],
  }),
})

function BudgetsIndexPage() {
  return (
    <div className="flex h-full min-w-0 flex-col gap-2 lg:gap-4">
      <BudgetsList />
    </div>
  )
}

function BudgetsIndexError(props: ErrorComponentProps) {
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
