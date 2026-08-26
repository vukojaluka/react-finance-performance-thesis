import { useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { useEffect } from 'react'
import { toast } from 'sonner'

import {
  CATEGORY_FORM_COPY,
  getCreateDefaultValues,
} from '@/features/categories/lib/category-form'
import type {
  CategoryFormMode,
  CategoryFormValues,
} from '@/features/categories/lib/category-form'
import { categorySchema } from '@/features/categories/schemas/category-form.schema'
import type { CategoryInput } from '@/features/categories/schemas/category-form.schema'
import { createCategory } from '@/features/categories/server/create-category'
import { updateCategory } from '@/features/categories/server/update-category'
import { getRouteError } from '@/lib/route-errors'

type UseCategoryFormConfig = {
  mode: CategoryFormMode
  categoryId?: string
  initialValues?: CategoryFormValues
}

export function useCategoryForm({
  mode,
  categoryId,
  initialValues,
}: UseCategoryFormConfig) {
  const navigate = useNavigate({ from: '/categories' })
  const queryClient = useQueryClient()
  const createCategoryFn = useServerFn(createCategory)
  const updateCategoryFn = useServerFn(updateCategory)
  const copy = CATEGORY_FORM_COPY[mode]

  const mutation = useMutation({
    mutationFn: async (input: CategoryInput) => {
      if (mode === 'edit') {
        if (!categoryId) {
          throw new Error('Kategorija nije pronađena.')
        }

        return updateCategoryFn({
          data: {
            categoryId,
            data: input,
          },
        })
      }

      return createCategoryFn({ data: input })
    },
    onSuccess: async () => {
      const successMessage =
        mode === 'create'
          ? 'Kategorija je uspješno kreirana.'
          : 'Kategorija je uspješno ažurirana.'
      toast.success(successMessage)

      const invalidations = [
        queryClient.invalidateQueries({ queryKey: ['categories'] }),
      ]

      if (mode === 'edit') {
        invalidations.push(
          queryClient.invalidateQueries({ queryKey: ['transactions'] }),
          queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
        )
      }

      await Promise.all(invalidations)
      await navigate({ to: '/categories' })
    },
    onError: (error) => {
      const routeError = getRouteError({ error })
      toast.error(routeError.message)
    },
  })

  const form = useForm({
    defaultValues: initialValues ?? getCreateDefaultValues(),
    validators: {
      onChange: categorySchema,
    },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value)
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
