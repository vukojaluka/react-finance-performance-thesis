import { Link } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { BudgetFormFields } from '@/features/budgets/components/form/budget-form-fields'
import { useBudgetCategoryAvailability } from '@/features/budgets/hooks/use-budget-category-availability'
import type { BudgetFormApi } from '@/features/budgets/hooks/use-budget-form'
import type { BudgetFormCopy, BudgetFormMode } from '@/features/budgets/lib/budget-form'

type BudgetFormCardProps = {
  form: BudgetFormApi
  copy: BudgetFormCopy
  isPending: boolean
  mode: BudgetFormMode
  budgetId?: string
  cancelSearch?: { month: number; year: number }
}

export function BudgetFormCard({
  form,
  copy,
  isPending,
  mode,
  budgetId,
  cancelSearch,
}: BudgetFormCardProps) {
  return (
    <Card size="sm" className="max-w-xl min-w-0">
      <CardHeader>
        <CardTitle className="text-sm tracking-normal normal-case flex flex-col gap-1">
          {copy.title}
          <span className="text-xs text-muted-foreground">{copy.description}</span>
        </CardTitle>
      </CardHeader>
      <form
        className="space-y-6"
        onSubmit={(event) => {
          event.preventDefault()
          event.stopPropagation()
          void form.handleSubmit()
        }}
      >
        <form.Subscribe
          selector={(state) => ({
            isSubmitting: state.isSubmitting,
            month: state.values.month,
            year: state.values.year,
            categoryId: state.values.category_id,
          })}
        >
          {({ isSubmitting, month, year, categoryId }) => (
            <BudgetFormInterior
              form={form}
              copy={copy}
              isPending={isPending}
              isSubmitting={isSubmitting}
              mode={mode}
              budgetId={budgetId}
              month={month}
              year={year}
              categoryId={categoryId}
              cancelSearch={cancelSearch}
            />
          )}
        </form.Subscribe>
      </form>
    </Card>
  )
}

export function BudgetFormCardSkeleton() {
  return (
    <Card size="sm" className="max-w-xl min-w-0">
      <CardHeader>
        <Skeleton className="h-4 w-40" />
        <Skeleton className="mt-2 h-3 w-64" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Skeleton className="h-10 w-full sm:w-28" />
        <Skeleton className="h-10 w-full sm:w-36" />
      </CardFooter>
    </Card>
  )
}

type BudgetFormInteriorProps = {
  form: BudgetFormApi
  copy: BudgetFormCopy
  isPending: boolean
  isSubmitting: boolean
  mode: BudgetFormMode
  budgetId?: string
  month: number
  year: number
  categoryId: string
  cancelSearch?: { month: number; year: number }
}

function BudgetFormInterior({
  form,
  copy,
  isPending,
  isSubmitting,
  mode,
  budgetId,
  month,
  year,
  categoryId,
  cancelSearch,
}: BudgetFormInteriorProps) {
  const {
    availableCategories,
    hasCategories,
    hasAvailableCategories,
    allCategoriesBudgeted,
    canSubmit,
  } = useBudgetCategoryAvailability({
    month,
    year,
    selectedCategoryId: categoryId,
    budgetId,
    mode,
  })

  return (
    <>
      <CardContent className="space-y-4">
        <BudgetFormFields
          form={form}
          availableCategories={availableCategories}
          hasCategories={hasCategories}
          hasAvailableCategories={hasAvailableCategories}
          allCategoriesBudgeted={allCategoriesBudgeted}
        />
      </CardContent>

      <CardFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          nativeButton={false}
          type="button"
          variant="outline"
          className="w-full sm:w-auto"
          disabled={isSubmitting || isPending}
          render={
            <Link
              to="/budgets"
              search={(prev) => ({
                ...prev,
                month: cancelSearch?.month ?? month,
                year: cancelSearch?.year ?? year,
              })}
            />
          }
        >
          Odustani
        </Button>
        <Button
          type="submit"
          className="w-full sm:w-auto"
          disabled={isSubmitting || isPending || !canSubmit}
        >
          {isSubmitting || isPending ? 'Spremanje...' : copy.submit}
        </Button>
      </CardFooter>
    </>
  )
}
