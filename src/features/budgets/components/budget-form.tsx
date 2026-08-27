import { Link, useSearch } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { BudgetFormFields } from '@/features/budgets/components/budget-form-fields'
import { BudgetFormSkeleton } from '@/features/budgets/components/budget-form-skeleton'
import { BudgetsErrorState } from '@/features/budgets/components/budgets-error'
import { useBudgetForm } from '@/features/budgets/hooks/use-budget-form'
import {
  getCreateDefaultValues,
  mapBudgetToFormValues,
} from '@/features/budgets/lib/budget-form'
import { budgetQuery, budgetsQuery } from '@/features/budgets/queries/budgets.query'
import { categoriesQuery } from '@/features/categories/queries/categories.query'

export type BudgetFormProps =
  | { mode?: 'create' }
  | { mode: 'edit'; budgetId: string }

export function BudgetForm(props: BudgetFormProps = {}) {
  if (props.mode === 'edit') {
    return <EditBudgetForm budgetId={props.budgetId} />
  }

  return <CreateBudgetForm />
}

function CreateBudgetForm() {
  const search = useSearch({ from: '/_protected/budgets/new' })
  const period = { month: search.month, year: search.year }

  const { form, copy, isPending } = useBudgetForm({
    mode: 'create',
    initialValues: getCreateDefaultValues(period),
  })

  return (
    <BudgetFormCard
      form={form}
      copy={copy}
      isPending={isPending}
      mode="create"
      cancelSearch={period}
    />
  )
}

function EditBudgetForm({ budgetId }: { budgetId: string }) {
  const {
    data: budget,
    isError,
    error,
    refetch,
  } = useQuery(budgetQuery(budgetId))

  const initialValues = useMemo(
    () => (budget ? mapBudgetToFormValues(budget) : undefined),
    [budget?.id, budget?.category_id, budget?.amount, budget?.month, budget?.year],
  )

  const { form, copy, isPending } = useBudgetForm({
    mode: 'edit',
    budgetId,
    initialValues,
  })

  if (isError) {
    return (
      <BudgetsErrorState
        message={
          error instanceof Error
            ? error.message
            : 'Nije moguće učitati budžet.'
        }
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  if (!budget) {
    return <BudgetFormSkeleton />
  }

  return (
    <BudgetFormCard
      form={form}
      copy={copy}
      isPending={isPending}
      mode="edit"
      budgetId={budgetId}
      cancelSearch={{ month: budget.month, year: budget.year }}
    />
  )
}

type BudgetFormCardProps = {
  form: ReturnType<typeof useBudgetForm>['form']
  copy: ReturnType<typeof useBudgetForm>['copy']
  isPending: boolean
  mode: 'create' | 'edit'
  budgetId?: string
  cancelSearch?: { month: number; year: number }
}

function BudgetFormCard({
  form,
  copy,
  isPending,
  mode,
  budgetId,
  cancelSearch,
}: BudgetFormCardProps) {
  const { data: categories = [] } = useQuery(categoriesQuery())

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
        <CardContent className="space-y-4">
          <BudgetFormFields form={form} mode={mode} budgetId={budgetId} />
        </CardContent>

        <form.Subscribe
          selector={(state) => ({
            isSubmitting: state.isSubmitting,
            month: state.values.month,
            year: state.values.year,
            categoryId: state.values.category_id,
          })}
        >
          {({ isSubmitting, month, year, categoryId }) => (
            <BudgetFormFooter
              form={form}
              copy={copy}
              isPending={isPending}
              isSubmitting={isSubmitting}
              mode={mode}
              budgetId={budgetId}
              month={month}
              year={year}
              categoryId={categoryId}
              hasCategories={categories.length > 0}
              cancelSearch={cancelSearch}
            />
          )}
        </form.Subscribe>
      </form>
    </Card>
  )
}

function BudgetFormFooter({
  copy,
  isPending,
  isSubmitting,
  mode,
  budgetId,
  month,
  year,
  categoryId,
  hasCategories,
  cancelSearch,
}: {
  form: ReturnType<typeof useBudgetForm>['form']
  copy: ReturnType<typeof useBudgetForm>['copy']
  isPending: boolean
  isSubmitting: boolean
  mode: 'create' | 'edit'
  budgetId?: string
  month: number
  year: number
  categoryId: string
  hasCategories: boolean
  cancelSearch?: { month: number; year: number }
}) {
  const { data: categories = [] } = useQuery(categoriesQuery())
  const { data: overview } = useQuery({
    ...budgetsQuery({ month, year }),
    enabled: month >= 1 && year >= 1000,
  })

  const occupiedCategoryIds = new Set(
    (overview?.categories ?? [])
      .filter((budget) => budget.budgetId !== budgetId)
      .map((budget) => budget.categoryId),
  )

  const availableCategoriesCount = hasCategories
    ? categories.filter(
        (category) =>
          category.id === categoryId || !occupiedCategoryIds.has(category.id),
      ).length
    : 0

  const allCategoriesBudgeted =
    mode === 'create' && hasCategories && availableCategoriesCount === 0

  const canSubmit = hasCategories && !allCategoriesBudgeted

  return (
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
  )
}
