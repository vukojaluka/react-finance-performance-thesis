import { useSuspenseQuery } from '@tanstack/react-query'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { dashboardSummaryQuery } from '../queries/dashboard-summary.query'

export function DashboardSummaryWidget() {
  const { data } = useSuspenseQuery(dashboardSummaryQuery())

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dashboard Summary</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2 sm:grid-cols-3">
        <div>
          <p className="text-muted-foreground text-xs uppercase">Income</p>
          <p className="text-lg font-semibold">{data.income}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs uppercase">Expenses</p>
          <p className="text-lg font-semibold">{data.expenses}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs uppercase">Balance</p>
          <p className="text-lg font-semibold">{data.balance}</p>
        </div>
      </CardContent>
    </Card>
  )
}
