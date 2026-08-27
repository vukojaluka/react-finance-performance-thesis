import { Cell, Pie, PieChart } from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import type { ChartConfig } from '@/components/ui/chart'
import { Skeleton } from '@/components/ui/skeleton'
import {
  clampProgressValue,
} from '@/features/budgets/lib/budget-progress'
import type { BudgetSummary } from '@/features/budgets/server/get-budgets'
import { formatBam } from '@/lib/format-currency'
import { cn } from '@/lib/utils'

const chartConfig = {
  spent: {
    label: 'Potrošeno',
    color: '#059669',
  },
  remaining: {
    label: 'Preostalo',
    color: '#e2e8f0',
  },
  overBudget: {
    label: 'Prekoračeno',
    color: '#dc2626',
  },
} satisfies ChartConfig

type BudgetOverviewCardProps = {
  summary: BudgetSummary
}

export function BudgetOverviewCard({ summary }: BudgetOverviewCardProps) {
  const isOverBudget = summary.totalSpent > summary.totalBudget
  const percentage = Math.round(summary.percentage)
  const chartPercentage = clampProgressValue(summary.percentage)

  const chartData = isOverBudget
    ? [{ name: 'overBudget', value: 100, fill: 'var(--color-overBudget)' }]
    : [
        {
          name: 'spent',
          value: chartPercentage,
          fill: 'var(--color-spent)',
        },
        {
          name: 'remaining',
          value: Math.max(100 - chartPercentage, 0),
          fill: 'var(--color-remaining)',
        },
      ]

  return (
    <Card size="sm" className="min-w-0">
      <CardHeader>
        <CardTitle className="text-sm tracking-normal normal-case">
          Ukupni budžet
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 lg:flex-row lg:items-center">
        <div className="mx-auto w-full max-w-56 shrink-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square w-full max-w-56"
          >
            <PieChart>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => (
                      <span className="font-mono tabular-nums">
                        {name === 'remaining'
                          ? formatBam(summary.remaining)
                          : formatBam(summary.totalSpent)}
                      </span>
                    )}
                  />
                }
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius="68%"
                outerRadius="92%"
                strokeWidth={0}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <p className="text-2xl font-semibold tabular-nums">
              <span
                className={cn(
                  isOverBudget && 'text-red-600 dark:text-red-400',
                )}
              >
                {formatBam(summary.totalSpent)}
              </span>
              <span className="text-muted-foreground">
                {' '}
                / {formatBam(summary.totalBudget)}
              </span>
            </p>
            <p
              className={cn(
                'text-sm font-medium tabular-nums',
                isOverBudget
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-muted-foreground',
              )}
            >
              {percentage}% iskorišteno
            </p>
          </div>

          {isOverBudget ? (
            <p className="text-sm font-medium text-red-600 dark:text-red-400">
              Prekoračeno za {formatBam(Math.abs(summary.remaining))}
            </p>
          ) : (
            <p className="text-muted-foreground text-sm tabular-nums">
              Preostalo {formatBam(summary.remaining)}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function BudgetOverviewCardSkeleton() {
  return (
    <Card size="sm" className="min-w-0">
      <CardHeader>
        <Skeleton className="h-4 w-32" />
      </CardHeader>
      <CardContent className="flex flex-col gap-6 lg:flex-row lg:items-center">
        <Skeleton className="mx-auto aspect-square w-full max-w-56 rounded-full" />
        <div className="min-w-0 flex-1 space-y-3">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-36" />
        </div>
      </CardContent>
    </Card>
  )
}
