import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { TransactionFormCard, TransactionFormCardSkeleton } from '@/features/transactions/components/form/transaction-form-card'
import { TransactionsErrorState } from '@/features/transactions/components/transactions-error'
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
    <TransactionFormCard
      form={form}
      copy={copy}
      categories={categories}
      categoryItems={categoryItems}
      hasCategories={hasCategories}
      isPending={isPending}
    />
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
    return <TransactionFormCardSkeleton />
  }

  return (
    <TransactionFormCard
      form={form}
      copy={copy}
      categories={categories}
      categoryItems={categoryItems}
      hasCategories={hasCategories}
      isPending={isPending}
    />
  )
}
