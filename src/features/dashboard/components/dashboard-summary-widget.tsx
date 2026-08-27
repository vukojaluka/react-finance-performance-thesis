import { TrendingUp, TrendingDown, CalendarDays, Wallet } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { formatBam } from '@/lib/format-currency'

import { dashboardSummaryQuery } from '../queries/dashboard-summary.query'
import type { DashboardSummary } from '../server/get-dashboard-summary'

type KpiCardProps = {
  title: string
  value: number
  icon: LucideIcon
  valueClassName?: string
  iconClassName?: string
  description?: string
}

function KpiCard({
  title,
  value,
  icon: Icon,
  valueClassName,
  iconClassName,
  description,
}: KpiCardProps) {
  return (
    <Card size="sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium tracking-normal normal-case">
          {title}
        </CardTitle>
        <Icon
          className={cn('text-muted-foreground size-5 shrink-0', iconClassName)}
        />
      </CardHeader>
      <CardContent>
        <p className={cn('text-xl font-semibold tabular-nums', valueClassName)}>
          {formatBam(value)}
        </p>
        {description ? (
          <p className="text-muted-foreground mt-1 text-xs">{description}</p>
        ) : null}
      </CardContent>
    </Card>
  )
}

function DashboardSummaryWidgetContent({ data }: { data: DashboardSummary }) {
  return (
    <div className="grid gap-2 lg:gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        title="Ukupni prihodi"
        value={data.totalIncome}
        icon={TrendingUp}
        valueClassName="text-emerald-600 dark:text-emerald-400"
        iconClassName="text-emerald-600 dark:text-emerald-400"
        description="Svi prihodi"
      />
      <KpiCard
        title="Ukupni rashodi"
        value={data.totalExpenses}
        icon={TrendingDown}
        valueClassName="text-red-600 dark:text-red-400"
        iconClassName="text-red-600 dark:text-red-400"
        description="Svi rashodi"
      />
      <KpiCard
        title="Saldo"
        value={data.balance}
        icon={Wallet}
        valueClassName={
          data.balance >= 0
            ? 'text-emerald-600 dark:text-emerald-400'
            : 'text-red-600 dark:text-red-400'
        }
        description="Prihodi / Rashodi"
      />
      <KpiCard
        title="Bilans tekućeg mjeseca"
        value={data.currentMonthBalance}
        icon={CalendarDays}
        valueClassName={
          data.currentMonthBalance >= 0
            ? 'text-emerald-600 dark:text-emerald-400'
            : 'text-red-600 dark:text-red-400'
        }
        description="Prihodi / Rashodi u ovom mjesecu"
      />
    </div>
  )
}

export function DashboardSummaryWidgetSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} size="sm">
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function DashboardSummaryWidgetError({
  message = 'Nije moguće učitati sažetak nadzorne ploče.',
}: {
  message?: string
}) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-sm tracking-normal normal-case">
          Greška pri učitavanju
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">{message}</p>
      </CardContent>
    </Card>
  )
}

export function DashboardSummaryWidget() {
  const { data, isPending, isError, error } = useQuery(dashboardSummaryQuery())

  if (isPending) {
    return <DashboardSummaryWidgetSkeleton />
  }

  if (isError) {
    return (
      <DashboardSummaryWidgetError
        message={
          error instanceof Error
            ? error.message
            : 'Nije moguće učitati sažetak nadzorne ploče.'
        }
      />
    )
  }

  return <DashboardSummaryWidgetContent data={data} />
}
