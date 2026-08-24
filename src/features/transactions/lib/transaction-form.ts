import { toISODate } from '@/features/transactions/lib/format-transaction'
import type { TransactionDetail } from '@/features/transactions/server/get-transaction'

export type TransactionFormMode = 'create' | 'edit'

export type TransactionFormValues = {
  type: 'income' | 'expense'
  amount: string | number
  title: string
  category_id: string
  transaction_date: string
}

export const TRANSACTION_TYPE_ITEMS = {
  income: 'Prihod',
  expense: 'Rashod',
} as const

export const TRANSACTION_FORM_COPY = {
  create: {
    title: 'NOVA TRANSAKCIJA',
    description: 'Dodajte novi prihod ili rashod.',
    submit: 'Spremi transakciju',
  },
  edit: {
    title: 'UREDI TRANSAKCIJU',
    description: 'Izmijenite podatke postojeće transakcije.',
    submit: 'Spremi promjene',
  },
} as const

export type TransactionFormCopy =
  (typeof TRANSACTION_FORM_COPY)[keyof typeof TRANSACTION_FORM_COPY]

export function formatAmountForInput(amount: number): string {
  return amount.toFixed(2).replace('.', ',')
}

export function getCreateDefaultValues(): TransactionFormValues {
  return {
    type: 'expense',
    amount: '',
    title: '',
    category_id: '',
    transaction_date: toISODate(new Date()),
  }
}

export function mapTransactionToFormValues(
  transaction: TransactionDetail,
): TransactionFormValues {
  return {
    type: transaction.type,
    amount: formatAmountForInput(transaction.amount),
    title: transaction.title,
    category_id: transaction.category_id,
    transaction_date: transaction.transaction_date,
  }
}
