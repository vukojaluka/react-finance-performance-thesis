import {
  createFileRoute,
  redirect,
  stripSearchParams,
  useRouter,
} from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'

import { CategoriesErrorState } from '@/features/categories/components/categories-error'
import { CategoriesList } from '@/features/categories/components/categories-list'
import { CategoriesSearch } from '@/features/categories/components/categories-search'
import { categoriesQuery } from '@/features/categories/queries/categories.query'
import {
  CATEGORY_SEARCH_DEFAULTS,
  categorySearchSchema,
} from '@/features/categories/schemas/category-search.schema'
import { getRouteError } from '@/lib/route-errors'

export const Route = createFileRoute('/_protected/categories/')({
  validateSearch: categorySearchSchema,
  search: {
    middlewares: [stripSearchParams(CATEGORY_SEARCH_DEFAULTS)],
  },
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps: search }) => {
    const result = await context.queryClient.ensureQueryData(
      categoriesQuery(search),
    )

    if (result.page !== search.page) {
      throw redirect({
        to: '/categories',
        search: {
          ...search,
          page: result.page,
        },
      })
    }
  },
  component: CategoriesIndexPage,
  errorComponent: CategoriesIndexError,
  head: () => ({
    meta: [
      {
        title: 'Kategorije - MyFinance',
      },
    ],
  }),
})

function CategoriesIndexPage() {
  return (
    <div className="flex h-full min-w-0 flex-col gap-2 lg:gap-4">
      <CategoriesSearch />
      <CategoriesList />
    </div>
  )
}

function CategoriesIndexError(props: ErrorComponentProps) {
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
