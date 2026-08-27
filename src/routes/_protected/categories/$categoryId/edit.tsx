import { Link, createFileRoute, useRouter } from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'
import { z } from 'zod'
import { ArrowLeftIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CategoryForm } from '@/features/categories/components/form/category-form'
import { CategoryFormCardSkeleton } from '@/features/categories/components/form/category-form-card'
import { categoryQuery } from '@/features/categories/queries/categories.query'
import { getRouteError } from '@/lib/route-errors'

export const Route = createFileRoute('/_protected/categories/$categoryId/edit')({
  params: {
    parse: (params) => ({
      categoryId: z
        .guid({ error: 'Pogrešan ID kategorije' })
        .parse(params.categoryId),
    }),
    stringify: ({ categoryId }) => ({ categoryId }),
  },
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(categoryQuery(params.categoryId))
  },
  pendingComponent: EditCategoryPending,
  component: EditCategoryPage,
  notFoundComponent: EditCategoryNotFound,
  errorComponent: EditCategoryError,
  head: () => ({
    meta: [
      {
        title: 'Uredi kategoriju - MyFinance',
      },
    ],
  }),
})

function EditCategoryPage() {
  const { categoryId } = Route.useParams()

  return (
    <div className="w-full h-full min-w-0">
      <CategoryForm mode="edit" categoryId={categoryId} />
    </div>
  )
}

function EditCategoryPending() {
  return (
    <div className="w-full h-full min-w-0">
      <CategoryFormCardSkeleton />
    </div>
  )
}

function EditCategoryError(props: ErrorComponentProps) {
  const router = useRouter()
  const routeError = getRouteError(props)
  const isValidationError = routeError.kind === 'validation'

  return (
    <Card size="sm" className="max-w-xl min-w-0">
      <CardHeader>
        <CardTitle className="text-sm tracking-normal normal-case">
          {isValidationError
            ? 'Neispravan ID kategorije'
            : 'Nije moguće učitati kategoriju'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-muted-foreground text-sm">{routeError.message}</p>
        <div className="flex flex-wrap gap-2">
          {!isValidationError ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void router.invalidate()}
            >
              Pokušaj ponovno
            </Button>
          ) : null}
          <Button
            nativeButton={false}
            type="button"
            variant="outline"
            size="sm"
            render={<Link to="/categories" />}
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Natrag na kategorije
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function EditCategoryNotFound() {
  return (
    <Card size="sm" className="max-w-xl min-w-0">
      <CardHeader>
        <CardTitle className="text-sm tracking-normal normal-case">
          Kategorija nije pronađena
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-muted-foreground text-sm">
          Tražena kategorija ne postoji ili nemate pristup za njezino uređivanje.
        </p>
        <Button
          nativeButton={false}
          type="button"
          variant="outline"
          size="sm"
          render={<Link to="/categories" />}
        >
          Natrag na kategorije
        </Button>
      </CardContent>
    </Card>
  )
}
