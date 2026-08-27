import { useSearch } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { BudgetFormCard, BudgetFormCardSkeleton } from '@/features/budgets/components/form/budget-form-card'
import { BudgetsErrorState } from '@/features/budgets/components/budgets-error'
import { useBudgetForm } from '@/features/budgets/hooks/use-budget-form'
import {
  getCreateDefaultValues,
  mapBudgetToFormValues,
} from '@/features/budgets/lib/budget-form'
import { budgetQuery } from '@/features/budgets/queries/budgets.query'

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
    return <BudgetFormCardSkeleton />
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
