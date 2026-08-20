import { Suspense } from 'react'
import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { CatchBoundary, createFileRoute } from '@tanstack/react-router'

import {
  Budgets,
  BudgetsSkeleton,
} from '@/features/dashboard/components/budgets-widget'
import { DashboardSummaryCards } from '@/features/dashboard/components/dashboard-summary-cards'
import { DashboardWidgetError } from '@/features/dashboard/components/dashboard-widget-error'
import {
  MonthlyTrend,
  MonthlyTrendSkeleton,
} from '@/features/dashboard/components/monthly-trend'
import {
  RecentTransactions,
  RecentTransactionsSkeleton,
} from '@/features/dashboard/components/recent-transactions'
import { budgetsQuery } from '@/features/dashboard/queries/budgets.query'
import { dashboardSummaryQuery } from '@/features/dashboard/queries/dashboard-summary.query'
import { monthlyTrendQuery } from '@/features/dashboard/queries/monthly-trend.query'
import { recentTransactionsQuery } from '@/features/dashboard/queries/recent-transactions.query'

export const Route = createFileRoute('/_protected/dashboard')({
  loader: async ({ context }) => {
    void context.queryClient.prefetchQuery(monthlyTrendQuery())
    void context.queryClient.prefetchQuery(recentTransactionsQuery())
    void context.queryClient.prefetchQuery(budgetsQuery())

    await context.queryClient.ensureQueryData(dashboardSummaryQuery())
  },
  component: DashboardPage,
  head: () => ({
    meta: [
      {
        title: 'Nadzorna ploča - MyFinance',
      },
    ],
  }),
})

function DashboardPage() {
  return (
    <div className="flex h-full flex-col gap-2 lg:gap-4">
      <DashboardSummaryCards />

      <div className="grid min-w-0 gap-2 lg:grid-cols-3 lg:gap-4">
        <div className="min-w-0 lg:col-span-2">
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <CatchBoundary
                getResetKey={() => 'dashboard-monthly-trend'}
                onCatch={reset}
                errorComponent={({ error, reset: retry }) => (
                  <DashboardWidgetError
                    title="Mjesečni trend prihoda i rashoda"
                    message={
                      error instanceof Error
                        ? error.message
                        : 'Nije moguće učitati mjesečni trend.'
                    }
                    onRetry={retry}
                  />
                )}
              >
                <Suspense fallback={<MonthlyTrendSkeleton />}>
                  <MonthlyTrend />
                </Suspense>
              </CatchBoundary>
            )}
          </QueryErrorResetBoundary>
        </div>

        <div className="min-w-0 lg:col-span-1">
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <CatchBoundary
                getResetKey={() => 'dashboard-recent-transactions'}
                onCatch={reset}
                errorComponent={({ error, reset: retry }) => (
                  <DashboardWidgetError
                    title="Nedavne transakcije"
                    message={
                      error instanceof Error
                        ? error.message
                        : 'Nije moguće učitati nedavne transakcije.'
                    }
                    onRetry={retry}
                  />
                )}
              >
                <Suspense fallback={<RecentTransactionsSkeleton />}>
                  <RecentTransactions />
                </Suspense>
              </CatchBoundary>
            )}
          </QueryErrorResetBoundary>
        </div>
      </div>

      <QueryErrorResetBoundary>
        {({ reset }) => (
          <CatchBoundary
            getResetKey={() => 'dashboard-budgets'}
            onCatch={reset}
            errorComponent={({ error, reset: retry }) => (
              <DashboardWidgetError
                title="Budžeti ovog mjeseca"
                message={
                  error instanceof Error
                    ? error.message
                    : 'Nije moguće učitati budžete.'
                }
                onRetry={retry}
              />
            )}
          >
            <Suspense fallback={<BudgetsSkeleton />}>
              <Budgets />
            </Suspense>
          </CatchBoundary>
        )}
      </QueryErrorResetBoundary>
    </div>
  )
}
