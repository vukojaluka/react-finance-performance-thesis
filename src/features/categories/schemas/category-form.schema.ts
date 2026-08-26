import { z } from 'zod'

const hexColorSchema = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, 'Odaberite valjanu boju.')

export const categoryIdSchema = z.object({
  categoryId: z.guid('Neispravan identifikator kategorije.'),
})

export const categorySchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Naziv je obavezan.')
      .max(80, 'Naziv može imati najviše 80 znakova.'),
    color: hexColorSchema,
  })
  .strict()

export const updateCategorySchema = z
  .object({
    categoryId: z.guid('Neispravan identifikator kategorije.'),
    data: categorySchema,
  })
  .strict()

export type CategoryInput = z.output<typeof categorySchema>
