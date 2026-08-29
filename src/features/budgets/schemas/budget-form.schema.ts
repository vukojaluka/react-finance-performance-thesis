import { z } from 'zod'

export const budgetIdSchema = z.object({
  budgetId: z.guid('Neispravan identifikator budžeta.'),
})

const amountInputSchema = z.union(
  [
    z.string().trim().min(1, 'Iznos je obavezan.'),
    z.number({ message: 'Unesite valjan iznos.' }),
  ],
  { error: 'Unesite valjan iznos.' },
)

function parseAmountInput(value: string | number): number {
  return typeof value === 'string'
    ? Number(value.replace(/\s/g, '').replace(',', '.'))
    : value
}

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

const amountOnChangeSchema =
  amountInputSchema.superRefine(refineAmountInput)

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

const budgetFormPeriodSchema = z.object({
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(1000).max(9999),
})

const budgetBaseSchema = z.object({
  category_id: z.guid('Odaberite kategoriju.'),
  month: budgetFormPeriodSchema.shape.month,
  year: budgetFormPeriodSchema.shape.year,
})

export const budgetFormValuesSchema = budgetBaseSchema
  .extend({ amount: amountOnChangeSchema })
  .strict()

export const budgetSchema = budgetBaseSchema
  .extend({ amount: amountSubmitSchema })
  .strict()

export type BudgetInput = z.output<typeof budgetSchema>

export const updateBudgetSchema = z
  .object({
    budgetId: z.guid('Neispravan identifikator budžeta.'),
    data: budgetSchema,
  })
  .strict()
