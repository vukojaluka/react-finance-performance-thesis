import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { CategoriesErrorState } from '@/features/categories/components/categories-error'
import { CategoryFormCard, CategoryFormCardSkeleton } from '@/features/categories/components/form/category-form-card'
import { useCategoryForm } from '@/features/categories/hooks/use-category-form'
import { mapCategoryToFormValues } from '@/features/categories/lib/category-form'
import { categoryQuery } from '@/features/categories/queries/categories.query'

export type CategoryFormProps =
  | { mode?: 'create' }
  | { mode: 'edit'; categoryId: string }

export function CategoryForm(props: CategoryFormProps = {}) {
  if (props.mode === 'edit') {
    return <EditCategoryForm categoryId={props.categoryId} />
  }

  return <CreateCategoryForm />
}

function CreateCategoryForm() {
  const { form, copy, isPending } = useCategoryForm({ mode: 'create' })

  return <CategoryFormCard form={form} copy={copy} isPending={isPending} />
}

function EditCategoryForm({ categoryId }: { categoryId: string }) {
  const {
    data: category,
    isError,
    error,
    refetch,
  } = useQuery(categoryQuery(categoryId))

  const initialValues = useMemo(
    () => (category ? mapCategoryToFormValues(category) : undefined),
    [category?.id, category?.name, category?.color],
  )

  const { form, copy, isPending } = useCategoryForm({
    mode: 'edit',
    categoryId,
    initialValues,
  })

  if (isError) {
    return (
      <CategoriesErrorState
        message={
          error instanceof Error
            ? error.message
            : 'Nije moguće učitati kategoriju.'
        }
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  if (!category) {
    return <CategoryFormCardSkeleton />
  }

  return <CategoryFormCard form={form} copy={copy} isPending={isPending} />
}
