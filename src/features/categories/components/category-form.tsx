import { Link } from '@tanstack/react-router'
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
import { CategoriesErrorState } from '@/features/categories/components/categories-error'
import { CategoryFormFields } from '@/features/categories/components/category-form-fields'
import { CategoryFormSkeleton } from '@/features/categories/components/category-form-skeleton'
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

  return (
    <CategoryFormCard form={form} copy={copy} isPending={isPending} />
  )
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
    return <CategoryFormSkeleton />
  }

  return (
    <CategoryFormCard form={form} copy={copy} isPending={isPending} />
  )
}

type CategoryFormCardProps = {
  form: ReturnType<typeof useCategoryForm>['form']
  copy: ReturnType<typeof useCategoryForm>['copy']
  isPending: boolean
}

function CategoryFormCard({ form, copy, isPending }: CategoryFormCardProps) {
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
          <CategoryFormFields form={form} />
        </CardContent>

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <CardFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                nativeButton={false}
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                disabled={isSubmitting || isPending}
                render={<Link to="/categories" />}
              >
                Odustani
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={isSubmitting || isPending}
              >
                {isSubmitting || isPending ? 'Spremanje...' : copy.submit}
              </Button>
            </CardFooter>
          )}
        </form.Subscribe>
      </form>
    </Card>
  )
}
