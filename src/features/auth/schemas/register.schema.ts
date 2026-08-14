import { z } from 'zod'

export const registerSchema = z
  .object({
    firstName: z.string().min(1, 'Unesite svoje ime.'),
    lastName: z.string().min(1, 'Unesite svoje prezime.'),
    email: z.email('Unesite valjanu e-mail adresu.'),
    password: z.string().min(8, 'Lozinka mora imati najmanje 8 znakova.'),
    confirmPassword: z.string().min(1, 'Potvrdite lozinku.'),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: 'Lozinke se ne podudaraju.',
    path: ['confirmPassword'],
  })

export type RegisterInput = z.infer<typeof registerSchema>
