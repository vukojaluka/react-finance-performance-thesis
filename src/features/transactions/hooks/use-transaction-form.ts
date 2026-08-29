import { useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { useEffect, useMemo } from 'react'
import { toast } from 'sonner'

import { categoryOptionsQuery } from '@/features/categories/queries/categories.query'
import {
  TRANSACTION_FORM_COPY,
  getCreateDefaultValues,
} from '@/features/transactions/lib/transaction-form'
import type {
  TransactionFormMode,
  TransactionFormValues,
} from '@/features/transactions/lib/transaction-form'
import {
  transactionFormValuesSchema,
  transactionSchema,
} from '@/features/transactions/schemas/transaction-form.schema'
import type { TransactionInput } from '@/features/transactions/schemas/transaction-form.schema'
import { createTransaction } from '@/features/transactions/server/create-transaction'
import { updateTransaction } from '@/features/transactions/server/update-transaction'
import { getRouteError } from '@/lib/route-errors'

type UseTransactionFormConfig = {
  mode: TransactionFormMode
  transactionId?: string
  initialValues?: TransactionFormValues
}

export type TransactionFormApi = ReturnType<typeof useTransactionForm>['form']

export function useTransactionForm({
  mode,
  transactionId,
  initialValues,
}: UseTransactionFormConfig) {
  const navigate = useNavigate({ from: '/transactions' })
  const queryClient = useQueryClient()
  const createTransactionFn = useServerFn(createTransaction)
  const updateTransactionFn = useServerFn(updateTransaction)
  const { data: categories = [] } = useQuery(categoryOptionsQuery())
  const categoryItems = useMemo(
    () =>
      Object.fromEntries(
        categories.map((category) => [category.id, category.name]),
      ),
    [categories],
  )
  const copy = TRANSACTION_FORM_COPY[mode]

  const mutation = useMutation({
    mutationFn: async (input: TransactionInput) => {
      if (mode === 'edit') {
        if (!transactionId) {
          throw new Error('Transakcija nije pronađena.')
        }

        return updateTransactionFn({
          data: {
            transactionId,
            data: input,
          },
        })
      }

      return createTransactionFn({ data: input })
    },
    onSuccess: async () => {
      const successMessage =
        mode === 'create'
          ? 'Transakcija je uspješno kreirana.'
          : 'Transakcija je uspješno ažurirana.'
      toast.success(successMessage)

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['transactions'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
        queryClient.invalidateQueries({ queryKey: ['budgets'] }),
      ])
      await navigate({
        to: '/transactions',
        search: (prev) => ({ ...prev, page: 1 }),
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
      onChange: transactionFormValuesSchema,
    },
    onSubmit: async ({ value }) => {
      const parsed = transactionSchema.safeParse(value)

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
    categories,
    categoryItems,
    hasCategories: categories.length > 0,
    isPending: mutation.isPending,
  }
}
