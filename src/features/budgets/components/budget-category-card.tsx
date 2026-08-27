import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { PencilIcon, TrashIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { BudgetDeleteDialog } from '@/features/budgets/components/budget-delete-dialog'
import { clampProgressValue } from '@/features/budgets/lib/budget-progress'
import type { CategoryBudgetProgress } from '@/features/budgets/server/get-budgets'
import { formatBam } from '@/lib/format-currency'
import { cn } from '@/lib/utils'

type BudgetCategoryCardProps = {
  budget: CategoryBudgetProgress
}

export function BudgetCategoryCard({ budget }: BudgetCategoryCardProps) {
  const [deleteBudgetId, setDeleteBudgetId] = useState<string | null>(null)
  const isOverBudget = budget.spentAmount > budget.budgetAmount
  const progressValue = clampProgressValue(budget.percentage)
  const percentageLabel = Math.round(budget.percentage)

  return (
    <>
      <Card size="sm" className="min-w-0">
        <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2">
              <span
                className="inline-block size-3 shrink-0 rounded-full"
                style={{ backgroundColor: budget.categoryColor }}
                aria-hidden
              />
              <CardTitle className="truncate text-sm tracking-normal normal-case">
                {budget.categoryName}
              </CardTitle>
            </div>
            <p className="text-muted-foreground text-xs tabular-nums">
              <span
                className={cn(
                  isOverBudget && 'text-red-600 dark:text-red-400',
                )}
              >
                {formatBam(budget.spentAmount)}
              </span>
              {' / '}
              {formatBam(budget.budgetAmount)}
            </p>
          </div>
          <p
            className={cn(
              'shrink-0 text-sm font-semibold tabular-nums',
              isOverBudget
                ? 'text-red-600 dark:text-red-400'
                : 'text-muted-foreground',
            )}
          >
            {percentageLabel}%
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress
            value={progressValue}
            className={cn(
              'gap-0',
              isOverBudget
                ? '[&_[data-slot=progress-indicator]]:bg-red-600 dark:[&_[data-slot=progress-indicator]]:bg-red-400'
                : '[&_[data-slot=progress-indicator]]:bg-emerald-600 dark:[&_[data-slot=progress-indicator]]:bg-emerald-400',
            )}
          />

          {isOverBudget ? (
            <p className="text-sm font-medium text-red-600 dark:text-red-400">
              Prekoračeno za {formatBam(Math.abs(budget.remaining))}
            </p>
          ) : (
            <p className="text-muted-foreground text-sm tabular-nums">
              Preostalo {formatBam(budget.remaining)}
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            <Button
              nativeButton={false}
              type="button"
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
              render={
                <Link
                  to="/budgets/$budgetId/edit"
                  params={{ budgetId: budget.budgetId }}
                />
              }
            >
              <PencilIcon className="size-4" />
              Uredi
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full text-red-600 hover:text-red-600 sm:w-auto dark:text-red-400 dark:hover:text-red-400"
              onClick={() => setDeleteBudgetId(budget.budgetId)}
            >
              <TrashIcon className="size-4" />
              Obriši
            </Button>
          </div>
        </CardContent>
      </Card>

      <BudgetDeleteDialog
        budgetId={deleteBudgetId}
        open={deleteBudgetId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteBudgetId(null)
          }
        }}
      />
    </>
  )
}

export function BudgetCategoryCardSkeleton() {
  return (
    <Card size="sm" className="min-w-0">
      <CardHeader className="space-y-2">
        <div className="h-4 w-32 rounded bg-muted" />
        <div className="h-3 w-24 rounded bg-muted" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-0.5 w-full rounded bg-muted" />
        <div className="h-4 w-28 rounded bg-muted" />
        <div className="flex gap-2">
          <div className="h-9 w-20 rounded bg-muted" />
          <div className="h-9 w-20 rounded bg-muted" />
        </div>
      </CardContent>
    </Card>
  )
}
