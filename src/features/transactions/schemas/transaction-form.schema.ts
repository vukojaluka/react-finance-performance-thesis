import { z } from 'zod'

import { isRealCalendarDate } from '@/features/transactions/lib/format-transaction'

export const transactionIdSchema = z.object({
  transactionId: z.guid('Neispravan identifikator transakcije.'),
})

export const transactionSchema = z
  .object({
    type: z.enum(['income', 'expense']),
    amount: z
      .union(
        [
          z.string().trim().min(1, 'Iznos je obavezan.'),
          z.number({ message: 'Unesite valjan iznos.' }),
        ],
        { error: 'Unesite valjan iznos.' },
      )
      .transform((value, context) => {
        const amount =
          typeof value === 'string'
            ? Number(value.replace(/\s/g, '').replace(',', '.'))
            : value

        if (!Number.isFinite(amount)) {
          context.addIssue({
            code: 'custom',
            message: 'Unesite valjan iznos.',
          })
          return z.NEVER
        }

        return amount
      })
      .pipe(
        z
          .number()
          .positive('Iznos mora biti veći od nule.')
          .max(9_999_999_999.99, 'Iznos je previsok.')
          .multipleOf(0.01, 'Iznos može imati najviše dvije decimale.'),
      ),
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
  .strict()

export type TransactionInput = z.output<typeof transactionSchema>

export const updateTransactionSchema = z
  .object({
    transactionId: z.guid('Neispravan identifikator transakcije.'),
    data: transactionSchema,
  })
  .strict()

export type UpdateTransactionInput = z.output<typeof updateTransactionSchema>
