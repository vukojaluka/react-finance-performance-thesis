import { useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { useEffect } from 'react'
import { toast } from 'sonner'

import {
  BUDGET_FORM_COPY,
  getCreateDefaultValues,
} from '@/features/budgets/lib/budget-form'
import type {
  BudgetFormMode,
  BudgetFormValues,
} from '@/features/budgets/lib/budget-form'
import {
  budgetFormValuesSchema,
  budgetSchema,
} from '@/features/budgets/schemas/budget-form.schema'
import type { BudgetInput } from '@/features/budgets/schemas/budget-form.schema'
import { createBudget } from '@/features/budgets/server/create-budget'
import { updateBudget } from '@/features/budgets/server/update-budget'
import { getRouteError } from '@/lib/route-errors'

type UseBudgetFormConfig = {
  mode: BudgetFormMode
  budgetId?: string
  initialValues?: BudgetFormValues
}

export function useBudgetForm({
  mode,
  budgetId,
  initialValues,
}: UseBudgetFormConfig) {
  const navigate = useNavigate({ from: '/budgets' })
  const queryClient = useQueryClient()
  const createBudgetFn = useServerFn(createBudget)
  const updateBudgetFn = useServerFn(updateBudget)
  const copy = BUDGET_FORM_COPY[mode]

  const mutation = useMutation({
    mutationFn: async (input: BudgetInput) => {
      if (mode === 'edit') {
        if (!budgetId) {
          throw new Error('Budžet nije pronađen.')
        }

        return updateBudgetFn({
          data: {
            budgetId,
            data: input,
          },
        })
      }

      return createBudgetFn({ data: input })
    },
    onSuccess: async (_, input) => {
      const successMessage =
        mode === 'create'
          ? 'Budžet je uspješno dodan.'
          : 'Budžet je uspješno izmijenjen.'
      toast.success(successMessage)

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['budgets'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
      ])

      await navigate({
        to: '/budgets',
        search: (prev) => ({
          ...prev,
          month: input.month,
          year: input.year,
        }),
      })
    },
    onError: (error) => {
      const routeError = getRouteError({ error })
      toast.error(routeError.message)
    },
  })

  const form = useForm({
    defaultValues: initialValues ?? getCreateDefaultValues(),
    validators: {
      onChange: budgetFormValuesSchema,
    },
    onSubmit: async ({ value }) => {
      const parsed = budgetSchema.safeParse(value)

      if (!parsed.success) {
        return
      }

      await mutation.mutateAsync(parsed.data)
    },
  })

  useEffect(() => {
    if (mode === 'edit' && initialValues) {
      form.reset(initialValues)
    }
  }, [form, initialValues, mode])

  return {
    form,
    copy,
    isPending: mutation.isPending,
  }
}
