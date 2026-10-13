import { useSuspenseQuery } from '@tanstack/react-query'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { formatBam } from '@/lib/format-currency'

import { experimentBudgetsQuery } from '../queries/budgets.query'

export function BudgetsWidget() {
  const { data } = useSuspenseQuery(experimentBudgetsQuery())

  return (
    <Card size="sm" className="min-w-0" data-exp-milestone="budgets">
      <CardHeader>
        <CardTitle className="text-sm tracking-normal normal-case">
          Budgets
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p
            className="text-muted-foreground text-sm"
            data-exp-empty-state="budgets"
          >
            No budgets to display.
          </p>
        ) : (
          <ul>
            {data.map((budget) => (
              <li
                key={budget.id}
                className="space-y-2 border-b py-4 last:border-0"
                data-exp-budget-row
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="font-medium">{budget.name}</p>
                  <p className="text-muted-foreground shrink-0 text-sm font-semibold tabular-nums">
                    {Math.round(budget.percentage)}%
                  </p>
                </div>
                <Progress
                  value={Math.min(budget.percentage, 100)}
                  aria-label={`${budget.name}: ${Math.round(budget.percentage)}% used`}
                  data-exp-budget-progress
                />
                <p className="text-muted-foreground text-xs tabular-nums">
                  {formatBam(budget.spent)} / {formatBam(budget.amount)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
