import { CardContent, CardFooter } from '@/components/ui/card'
import { BudgetFormFields } from '@/features/budgets/components/form/budget-form-fields'
import { BudgetFormFooter } from '@/features/budgets/components/form/budget-form-footer'
import { useBudgetCategoryAvailability } from '@/features/budgets/hooks/use-budget-category-availability'
import type { BudgetFormApi } from '@/features/budgets/hooks/use-budget-form'
import type { BudgetFormCopy, BudgetFormMode } from '@/features/budgets/lib/budget-form'

type BudgetFormBodyProps = {
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

export function BudgetFormBody({
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
}: BudgetFormBodyProps) {
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
        <BudgetFormFooter
          copy={copy}
          isPending={isPending}
          isSubmitting={isSubmitting}
          canSubmit={canSubmit}
          month={month}
          year={year}
          cancelSearch={cancelSearch}
        />
      </CardFooter>
    </>
  )
}
