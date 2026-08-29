import { useSuspenseQuery } from '@tanstack/react-query'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { formatBam } from '@/lib/format-currency'

import { budgetsQuery } from '../queries/budgets.query'
import type { DashboardBudget } from '@/features/dashboard/server/get-budgets'

function BudgetItem({ budget }: { budget: DashboardBudget }) {
  const isOverBudget = budget.percentage > 100
  const progressValue = Math.min(budget.percentage, 100)

  return (
    <li className="space-y-2 border-b py-4 last:border-0">
      <div className="flex items-start justify-between gap-3">
        <p className="font-medium">{budget.name}</p>
        <p
          className={cn(
            'shrink-0 text-sm font-semibold tabular-nums',
            isOverBudget
              ? 'text-red-600 dark:text-red-400'
              : 'text-muted-foreground',
          )}
        >
          {Math.round(budget.percentage)}%
        </p>
      </div>
      <Progress
        value={progressValue}
        className={cn(
          'gap-0',
          isOverBudget
            ? '**:data-[slot=progress-indicator]:bg-red-600 dark:**:data-[slot=progress-indicator]:bg-red-400'
            : '**:data-[slot=progress-indicator]:bg-emerald-600 dark:**:data-[slot=progress-indicator]:bg-emerald-400',
        )}
      />
      <p className="text-muted-foreground text-xs tabular-nums">
        <span className={cn(isOverBudget && 'text-red-600 dark:text-red-400')}>
          {formatBam(budget.spent)}
        </span>
        {' / '}
        {formatBam(budget.amount)}
      </p>
    </li>
  )
}

function BudgetsWidgetContent() {
  const { data } = useSuspenseQuery(budgetsQuery())

  return (
    <Card size="sm" className="min-w-0">
      <CardHeader>
        <CardTitle className="text-sm tracking-normal normal-case">
          Budžeti ovog mjeseca
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Nema budžeta za tekući mjesec.
          </p>
        ) : (
          <ul>
            {data.map((budget) => (
              <BudgetItem key={budget.id} budget={budget} />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

export function BudgetsWidgetSkeleton() {
  return (
    <Card size="sm" className="min-w-0">
      <CardHeader>
        <Skeleton className="h-4 w-44" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-2 border-b pb-4 last:border-0">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-10" />
            </div>
            <Skeleton className="h-0.5 w-full" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function BudgetsWidget() {
  return <BudgetsWidgetContent />
}
