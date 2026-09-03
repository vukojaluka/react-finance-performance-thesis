import { useSuspenseQuery } from '@tanstack/react-query'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { dashboardSummaryQuery } from '../queries/dashboard-summary.query'

export function DashboardSummaryWidget() {
  const { data } = useSuspenseQuery(dashboardSummaryQuery())

  return (
    <Card size="sm" data-exp-milestone="summary">
      <CardHeader>
        <CardTitle className="text-sm tracking-normal normal-case">
          Dashboard Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div>
          <p className="text-muted-foreground text-xs uppercase">Income</p>
          <p
            className="text-lg font-semibold tabular-nums"
            data-exp-kpi-value={data.income}
          >
            {data.income}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs uppercase">Expenses</p>
          <p
            className="text-lg font-semibold tabular-nums"
            data-exp-kpi-value={data.expenses}
          >
            {data.expenses}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs uppercase">Balance</p>
          <p
            className="text-lg font-semibold tabular-nums"
            data-exp-kpi-value={data.balance}
          >
            {data.balance}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs uppercase">
            Current Month
          </p>
          <p
            className="text-lg font-semibold tabular-nums"
            data-exp-kpi-value={data.currentMonthBalance}
          >
            {data.currentMonthBalance}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
