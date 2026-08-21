import { createServerFn } from '@tanstack/react-start'

import { mapSupabaseAuthErrors } from '@/integrations/supabase/auth-errors'
import { createSupabaseServerClient } from '@/integrations/supabase/server'
import { toSafeUser } from '@/features/auth/lib/safe-user'
import { loginSchema } from '@/features/auth/schemas/login.schema'
import type { SafeUser } from '@/features/auth/lib/safe-user'

export const login = createServerFn({ method: 'POST' })
  .validator(loginSchema)
  .handler(async ({ data }): Promise<SafeUser> => {
    const supabase = createSupabaseServerClient()
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      throw new Error(mapSupabaseAuthErrors(error))
    }

    const user = toSafeUser(authData.user)

    if (!user) {
      throw new Error('Nije moguće dohvatiti prijavljenog korisnika.')
    }

    return user
  })
