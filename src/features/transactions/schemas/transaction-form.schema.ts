import { z } from 'zod'

import { isRealCalendarDate } from '@/features/transactions/lib/format-transaction'

/** Validates route param / delete body: `{ transactionId }`. Used by getTransaction, deleteTransaction. */
export const transactionIdSchema = z.object({
  transactionId: z.guid('Neispravan identifikator transakcije.'),
})

/** Accepts raw form values: trimmed non-empty string or number (comma/dot decimals). */
const amountInputSchema = z.union(
  [
    z.string().trim().min(1, 'Iznos je obavezan.'),
    z.number({ message: 'Unesite valjan iznos.' }),
  ],
  { error: 'Unesite valjan iznos.' },
)

/** Shared parse: strips spaces, normalizes comma to dot for BAM input strings. */
function parseAmountInput(value: string | number): number {
  return typeof value === 'string'
    ? Number(value.replace(/\s/g, '').replace(',', '.'))
    : value
}

/** Validates amount bounds without transforming — safe for onChange while user is still typing. */
function refineAmountInput(
  value: string | number,
  context: z.RefinementCtx,
): void {
  const amount = parseAmountInput(value)

  if (!Number.isFinite(amount)) {
    context.addIssue({
      code: 'custom',
      message: 'Unesite valjan iznos.',
    })
    return
  }

  if (amount <= 0) {
    context.addIssue({
      code: 'custom',
      message: 'Iznos mora biti veći od nule.',
    })
    return
  }

  if (amount > 9_999_999_999.99) {
    context.addIssue({
      code: 'custom',
      message: 'Iznos je previsok.',
    })
  }
}

/** onChange amount: refine only so the field stays string | number in form state. */
const amountOnChangeSchema =
  amountInputSchema.superRefine(refineAmountInput)

/** Submit/server amount: parse, round to 2 decimals, output number for DB and API. */
const amountSubmitSchema = amountInputSchema
  .transform((value, context) => {
    const amount = parseAmountInput(value)

    if (!Number.isFinite(amount)) {
      context.addIssue({
        code: 'custom',
        message: 'Unesite valjan iznos.',
      })
      return z.NEVER
    }

    const rounded = Math.round(amount * 100) / 100

    if (rounded <= 0) {
      context.addIssue({
        code: 'custom',
        message: 'Iznos mora biti veći od nule.',
      })
      return z.NEVER
    }

    if (rounded > 9_999_999_999.99) {
      context.addIssue({
        code: 'custom',
        message: 'Iznos je previsok.',
      })
      return z.NEVER
    }

    return rounded
  })
  .pipe(z.number())

/** Shared transaction fields; amount differs between client typing vs submit (extend below). */
const transactionBaseSchema = z.object({
  type: z.enum(['income', 'expense']),
  title: z
    .string()
    .trim()
    .min(1, 'Opis je obavezan.')
    .max(120, 'Opis može imati najviše 120 znakova.'),
  category_id: z.guid('Odaberite kategoriju.'),
  transaction_date: z
    .string()
    .refine(isRealCalendarDate, 'Odaberite valjan datum.'),
})

/** TanStack Form onChange validator in useTransactionForm — immediate field errors without coercing amount. */
export const transactionFormValuesSchema = transactionBaseSchema
  .extend({ amount: amountOnChangeSchema })
  .strict()

/** Submit, createTransaction server validator, and mutation parse — canonical payload with numeric amount. */
export const transactionSchema = transactionBaseSchema
  .extend({ amount: amountSubmitSchema })
  .strict()

/**
 * Parsed create/update payload (`amount` is number).
 * Used in use-transaction-form mutationFn after transactionSchema.safeParse on submit.
 */
export type TransactionInput = z.output<typeof transactionSchema>

/** updateTransaction server validator: transaction id + nested transaction fields. */
export const updateTransactionSchema = z
  .object({
    transactionId: z.guid('Neispravan identifikator transakcije.'),
    data: transactionSchema,
  })
  .strict()
