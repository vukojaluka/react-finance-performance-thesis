import type { QueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { DashboardSummaryWidget } from '@/experiments/experiment-001/components/dashboard-summary-widget'
import { ExpenseChartWidget } from '@/experiments/experiment-001/components/expense-chart-widget'
import { LoggedSuspense } from '@/experiments/experiment-001/components/logged-suspense'
import { RecentTransactionsWidget } from '@/experiments/experiment-001/components/recent-transactions-widget'
import { WidgetFallback } from '@/experiments/experiment-001/components/widget-fallback'
import { EXPERIMENT_VERSION } from '@/experiments/experiment-001/lib/experiment-config'
import type { ExperimentVersion } from '@/experiments/experiment-001/lib/experiment-config'
import { experimentLog } from '@/experiments/experiment-001/lib/experiment-logger'
import { dashboardSummaryQuery } from '@/experiments/experiment-001/queries/dashboard-summary.query'
import { expenseChartQuery } from '@/experiments/experiment-001/queries/expense-chart.query'
import { recentTransactionsQuery } from '@/experiments/experiment-001/queries/recent-transactions.query'

export const Route = createFileRoute('/experiments/experiment-001')({
  loader: async ({ context }) => {
    await runExperimentLoader(context.queryClient, EXPERIMENT_VERSION)
  },
  component: Experiment001Page,
})

async function runExperimentLoader(
  queryClient: QueryClient,
  version: ExperimentVersion,
) {
  experimentLog('Loader started', version)

  try {
    switch (version) {
      case 'version-1':
        await Promise.all([
          queryClient.ensureQueryData(dashboardSummaryQuery()),
          queryClient.ensureQueryData(expenseChartQuery()),
          queryClient.ensureQueryData(recentTransactionsQuery()),
        ])
        break

      case 'version-2':
        await queryClient.ensureQueryData(dashboardSummaryQuery())
        break

      case 'version-3':
        // Fire-and-forget: start streaming without blocking SSR. Run these queries first to avoid blocking SSR.
        void queryClient.prefetchQuery(expenseChartQuery())
        void queryClient.prefetchQuery(recentTransactionsQuery())

        await queryClient.ensureQueryData(dashboardSummaryQuery())
        break
    }
  } finally {
    experimentLog('Loader finished', version)
  }
}

function Experiment001Page() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 p-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Experiment 001</h1>
        <p className="text-muted-foreground">
          TanStack Start rendering and TanStack Query integration proof of
          concept.
        </p>
        <p className="text-sm">
          Active strategy: <code>{EXPERIMENT_VERSION}</code>
        </p>
      </header>

      <section className="grid gap-6">
        <DashboardSummaryWidget />

        <LoggedSuspense
          name="Expense Chart"
          fallback={<WidgetFallback title="Expense Chart" />}
        >
          <ExpenseChartWidget />
        </LoggedSuspense>

        <LoggedSuspense
          name="Recent Transactions"
          fallback={<WidgetFallback title="Recent Transactions" />}
        >
          <RecentTransactionsWidget />
        </LoggedSuspense>
      </section>
    </main>
  )
}
