import { createServerFn } from '@tanstack/react-start'

import { mapSupabaseAuthErrors } from '@/integrations/supabase/auth-errors'
import { createSupabaseServerClient } from '@/integrations/supabase/server'
import { toSafeUser } from '@/features/auth/lib/safe-user'
import { registerSchema } from '@/features/auth/schemas/register.schema'
import type { SafeUser } from '@/features/auth/lib/safe-user'

export type RegisterResult =
  | { status: 'authenticated'; user: SafeUser }
  | { status: 'confirmation_required'; email: string }

export const register = createServerFn({ method: 'POST' })
  .validator(registerSchema)
  .handler(async ({ data }): Promise<RegisterResult> => {
    const supabase = createSupabaseServerClient()
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
        },
      },
    })

    if (error) {
      throw new Error(mapSupabaseAuthErrors(error))
    }

    if (authData.session && authData.user) {
      const user = toSafeUser(authData.user)

      if (!user) {
        throw new Error('Nije moguće dohvatiti prijavljenog korisnika.')
      }

      return {
        status: 'authenticated',
        user,
      }
    }

    return {
      status: 'confirmation_required',
      email: data.email,
    }
  })
