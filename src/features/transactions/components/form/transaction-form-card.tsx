import { Link } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { CategoryListItem } from '@/features/categories/server/get-categories'
import { TransactionFormFields } from '@/features/transactions/components/form/transaction-form-fields'
import type { TransactionFormApi } from '@/features/transactions/hooks/use-transaction-form'
import type { TransactionFormCopy } from '@/features/transactions/lib/transaction-form'

type TransactionFormCardProps = {
  form: TransactionFormApi
  copy: TransactionFormCopy
  categories: CategoryListItem[]
  categoryItems: Record<string, string>
  hasCategories: boolean
  isPending: boolean
}

export function TransactionFormCard({
  form,
  copy,
  categories,
  categoryItems,
  hasCategories,
  isPending,
}: TransactionFormCardProps) {
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
          <TransactionFormFields
            form={form}
            categories={categories}
            categoryItems={categoryItems}
            hasCategories={hasCategories}
          />
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
                render={
                  <Link
                    to="/transactions"
                    search={(prev) => ({ ...prev, page: 1 })}
                  />
                }
              >
                Odustani
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={isSubmitting || isPending || !hasCategories}
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

export function TransactionFormCardSkeleton() {
  return (
    <Card size="sm" className="max-w-xl min-w-0">
      <CardHeader>
        <Skeleton className="h-4 w-40" />
        <Skeleton className="mt-2 h-3 w-64" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Skeleton className="h-10 w-full sm:w-28" />
        <Skeleton className="h-10 w-full sm:w-36" />
      </CardFooter>
    </Card>
  )
}
