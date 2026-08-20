import { createFileRoute } from '@tanstack/react-router'

import { DashboardSummaryCards } from '@/features/dashboard/components/dashboard-summary-cards'
import { dashboardSummaryQuery } from '@/features/dashboard/queries/dashboard-summary.query'

export const Route = createFileRoute('/_protected/dashboard')({
  loader: async ({ context }) => {
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
  return <DashboardSummaryCards />
}
