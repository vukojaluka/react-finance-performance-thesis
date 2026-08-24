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
import { TransactionsErrorState } from '@/features/transactions/components/transactions-error'
import { TransactionFormFields } from '@/features/transactions/components/transaction-form-fields'
import { TransactionFormSkeleton } from '@/features/transactions/components/transaction-form-skeleton'
import { useTransactionForm } from '@/features/transactions/hooks/use-transaction-form'
import { mapTransactionToFormValues } from '@/features/transactions/lib/transaction-form'
import { transactionQuery } from '@/features/transactions/queries/transactions.query'

export type TransactionFormProps =
  | { mode?: 'create' }
  | { mode: 'edit'; transactionId: string }

export function TransactionForm(props: TransactionFormProps = {}) {
  if (props.mode === 'edit') {
    return <EditTransactionForm transactionId={props.transactionId} />
  }

  return <CreateTransactionForm />
}

function CreateTransactionForm() {
  const { form, copy, categories, categoryItems, hasCategories, isPending } =
    useTransactionForm({ mode: 'create' })

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

function EditTransactionForm({ transactionId }: { transactionId: string }) {
  const {
    data: transaction,
    isError,
    error,
    refetch,
  } = useQuery(transactionQuery(transactionId))

  const initialValues = useMemo(
    () =>
      transaction ? mapTransactionToFormValues(transaction) : undefined,
    [
      transaction?.id,
      transaction?.type,
      transaction?.amount,
      transaction?.title,
      transaction?.category_id,
      transaction?.transaction_date,
    ],
  )

  const { form, copy, categories, categoryItems, hasCategories, isPending } =
    useTransactionForm({
      mode: 'edit',
      transactionId,
      initialValues,
    })

  if (isError) {
    return (
      <TransactionsErrorState
        message={
          error instanceof Error
            ? error.message
            : 'Nije moguće učitati transakciju.'
        }
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  if (!transaction) {
    return <TransactionFormSkeleton />
  }

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
