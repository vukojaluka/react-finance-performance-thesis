import { useSuspenseQuery } from '@tanstack/react-query'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer } from '@/components/ui/chart'
import type { ChartConfig } from '@/components/ui/chart'

import { expenseChartQuery } from '../queries/expense-chart.query'

const chartConfig = {
  income: {
    label: 'Income',
    color: 'var(--chart-2)',
  },
  expenses: {
    label: 'Expenses',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

export function ExpenseChartWidget() {
  const { data } = useSuspenseQuery(expenseChartQuery())

  return (
    <Card
      size="sm"
      className="h-full min-h-80 min-w-0"
      data-exp-milestone="chart"
      data-exp-chart-points={data.length}
      data-exp-chart-series={2}
    >
      <CardHeader>
        <CardTitle className="text-sm tracking-normal normal-case">
          Monthly Trend
        </CardTitle>
      </CardHeader>
      <CardContent className="h-full">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-64 w-full"
        >
          <BarChart data={data} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} width={40} />
            <Bar dataKey="income" fill="var(--color-income)" radius={4} />
            <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
