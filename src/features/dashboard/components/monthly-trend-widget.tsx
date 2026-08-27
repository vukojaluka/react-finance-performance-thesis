import { useSuspenseQuery } from '@tanstack/react-query'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import type { ChartConfig } from '@/components/ui/chart'
import { Skeleton } from '@/components/ui/skeleton'
import { formatBam } from '@/lib/format-currency'

import { monthlyTrendQuery } from '../queries/monthly-trend.query'

const chartConfig = {
  income: {
    label: 'Prihodi',
    color: '#059669',
  },
  expenses: {
    label: 'Rashodi',
    color: '#dc2626',
  },
} satisfies ChartConfig

function MonthlyTrendWidgetContent() {
  const { data } = useSuspenseQuery(monthlyTrendQuery())

  return (
    <Card size="sm" className="min-w-0 h-full min-h-80 lg:min-h-128">
      <CardHeader>
        <CardTitle className="text-sm tracking-normal normal-case">
          Mjesečni trend prihoda i rashoda
        </CardTitle>
      </CardHeader>
      <CardContent className="h-full">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-full w-full min-w-0"
        >
          <BarChart data={data} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis tickLine={false} axisLine={false} width={48} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => (
                    <span className="font-mono tabular-nums">
                      {formatBam(Number(value))}
                    </span>
                  )}
                />
              }
            />
            <Bar
              dataKey="income"
              fill="var(--color-income)"
              radius={4}
              maxBarSize={32}
            />
            <Bar
              dataKey="expenses"
              fill="var(--color-expenses)"
              radius={4}
              maxBarSize={32}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function MonthlyTrendWidgetSkeleton() {
  return (
    <Card size="sm" className="min-w-0 h-80 lg:h-128">
      <CardHeader>
        <Skeleton className="h-4 w-56" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-60 lg:h-108 w-full" />
      </CardContent>
    </Card>
  )
}

export function MonthlyTrendWidget() {
  return <MonthlyTrendWidgetContent />
}
