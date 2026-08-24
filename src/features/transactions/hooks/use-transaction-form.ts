import { useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { categoriesQuery } from '@/features/categories/queries/categories.query'
import {
  TRANSACTION_FORM_COPY,
  getCreateDefaultValues,
} from '@/features/transactions/lib/transaction-form'
import type {
  TransactionFormMode,
  TransactionFormValues,
} from '@/features/transactions/lib/transaction-form'
import { transactionSchema } from '@/features/transactions/schemas/transaction-form.schema'
import type { TransactionInput } from '@/features/transactions/schemas/transaction-form.schema'
import { createTransaction } from '@/features/transactions/server/create-transaction'
import { updateTransaction } from '@/features/transactions/server/update-transaction'
import { getRouteError } from '@/lib/route-errors'

type UseTransactionFormConfig = {
  mode: TransactionFormMode
  transactionId?: string
  initialValues?: TransactionFormValues
}

export function useTransactionForm({
  mode,
  transactionId,
  initialValues,
}: UseTransactionFormConfig) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const createTransactionFn = useServerFn(createTransaction)
  const updateTransactionFn = useServerFn(updateTransaction)
  const { data: categories = [] } = useQuery(categoriesQuery())
  const { data: categoryItems = {} } = useQuery({
    ...categoriesQuery(),
    select: (data) =>
      Object.fromEntries(data.map((category) => [category.id, category.name])),
  })
  const [formError, setFormError] = useState<string | null>(null)
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
      ])
      await navigate({ to: '/transactions', search: { page: 1 } })
    },
    onError: (error) => {
      const routeError = getRouteError({ error })
      toast.error(routeError.message)
    },
  })

  const form = useForm({
    defaultValues: initialValues ?? getCreateDefaultValues(),
    validators: {
      onChange: transactionSchema,
    },
    onSubmit: async ({ value }) => {
      setFormError(null)

      try {
        const parsed = transactionSchema.parse(value)
        await mutation.mutateAsync(parsed)
      } catch (error) {
        setFormError(
          error instanceof Error
            ? error.message
            : 'Došlo je do greške. Pokušajte ponovno.',
        )
      }
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
    formError,
    isPending: mutation.isPending,
  }
}
