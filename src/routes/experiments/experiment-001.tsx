import { useRef } from 'react'
import type { QueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { BudgetsWidget } from '@/experiments/experiment-001/components/budgets-widget'
import { DashboardSummaryWidget } from '@/experiments/experiment-001/components/dashboard-summary-widget'
import { ExpenseChartWidget } from '@/experiments/experiment-001/components/expense-chart-widget'
import { LoggedSuspense } from '@/experiments/experiment-001/components/logged-suspense'
import { RecentTransactionsWidget } from '@/experiments/experiment-001/components/recent-transactions-widget'
import { WidgetFallback } from '@/experiments/experiment-001/components/widget-fallback'
import { experimentSearchSchema } from '@/experiments/experiment-001/lib/experiment-config'
import type { ExperimentVariant } from '@/experiments/experiment-001/lib/experiment-config'
import { experimentLog } from '@/experiments/experiment-001/lib/experiment-logger'
import { useExperimentMilestones } from '@/experiments/experiment-001/lib/use-experiment-milestones'
import { experimentBudgetsQuery } from '@/experiments/experiment-001/queries/budgets.query'
import { dashboardSummaryQuery } from '@/experiments/experiment-001/queries/dashboard-summary.query'
import { expenseChartQuery } from '@/experiments/experiment-001/queries/expense-chart.query'
import { recentTransactionsQuery } from '@/experiments/experiment-001/queries/recent-transactions.query'

export const Route = createFileRoute('/experiments/experiment-001')({
  validateSearch: experimentSearchSchema,
  loaderDeps: ({ search }) => ({ variant: search.variant }),
  loader: async ({ context, deps }) => {
    await runExperimentLoader(context.queryClient, deps.variant)
  },
  component: Experiment001Page,
})

async function runExperimentLoader(
  queryClient: QueryClient,
  variant: ExperimentVariant,
) {
  experimentLog('Loader started', variant)

  try {
    switch (variant) {
      case 'v1':
        await Promise.all([
          queryClient.ensureQueryData(dashboardSummaryQuery()),
          queryClient.ensureQueryData(expenseChartQuery()),
          queryClient.ensureQueryData(recentTransactionsQuery()),
          queryClient.ensureQueryData(experimentBudgetsQuery()),
        ])
        break

      case 'v2':
        await queryClient.ensureQueryData(dashboardSummaryQuery())
        break

      case 'v3':
        await queryClient.ensureQueryData(dashboardSummaryQuery())

        void queryClient.prefetchQuery(expenseChartQuery())
        void queryClient.prefetchQuery(recentTransactionsQuery())
        void queryClient.prefetchQuery(experimentBudgetsQuery())
        break

      case 'v3b':
        void queryClient.prefetchQuery(expenseChartQuery())
        void queryClient.prefetchQuery(recentTransactionsQuery())
        void queryClient.prefetchQuery(experimentBudgetsQuery())

        await queryClient.ensureQueryData(dashboardSummaryQuery())
        break
    }
  } finally {
    experimentLog('Loader finished', variant)
  }
}

function Experiment001Page() {
  const { variant } = Route.useSearch()
  const experimentRootRef = useRef<HTMLElement>(null)

  useExperimentMilestones(experimentRootRef, variant)

  return (
    <main
      ref={experimentRootRef}
      className="mx-auto flex max-w-6xl flex-col gap-6 p-6 lg:p-8"
      data-exp-milestone="shell"
      data-exp-complete="false"
    >
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Experiment 001</h1>
        <p className="text-muted-foreground">
          TanStack Start rendering and TanStack Query integration proof of
          concept.
        </p>
        <p className="text-sm">
          Active variant: <code data-exp-variant>{variant}</code>
        </p>
      </header>

      <section className="grid gap-6">
        <DashboardSummaryWidget />

        <div className="grid min-w-0 gap-6 lg:grid-cols-3">
          <div className="min-h-80 min-w-0 lg:col-span-2">
            <LoggedSuspense
              name="Monthly Trend"
              fallback={
                <WidgetFallback title="Monthly Trend" milestone="chart" />
              }
            >
              <ExpenseChartWidget />
            </LoggedSuspense>
          </div>

          <div className="min-h-80 min-w-0 lg:col-span-1">
            <LoggedSuspense
              name="Recent Transactions"
              fallback={
                <WidgetFallback
                  title="Recent Transactions"
                  milestone="transactions"
                />
              }
            >
              <RecentTransactionsWidget />
            </LoggedSuspense>
          </div>
        </div>

        <LoggedSuspense
          name="Budgets"
          fallback={<WidgetFallback title="Budgets" milestone="budgets" />}
        >
          <BudgetsWidget />
        </LoggedSuspense>
      </section>
    </main>
  )
}
