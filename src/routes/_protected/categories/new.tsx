import { createFileRoute, useRouter } from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'

import { CategoriesErrorState } from '@/features/categories/components/categories-error'
import { CategoryForm } from '@/features/categories/components/category-form'
import { getRouteError } from '@/lib/route-errors'

export const Route = createFileRoute('/_protected/categories/new')({
  component: NewCategoryPage,
  errorComponent: NewCategoryError,
  head: () => ({
    meta: [
      {
        title: 'Nova kategorija - MyFinance',
      },
    ],
  }),
})

function NewCategoryPage() {
  return (
    <div className="w-full h-full min-w-0">
      <CategoryForm />
    </div>
  )
}

function NewCategoryError(props: ErrorComponentProps) {
  const router = useRouter()
  const routeError = getRouteError(props)

  return (
    <CategoriesErrorState
      message={routeError.message}
      onRetry={() => {
        void router.invalidate()
      }}
    />
  )
}
