import { createServerFn } from '@tanstack/react-start'

import { createSupabaseServerClient } from '@/integrations/supabase/server'

import { mapAuthErrorMessage } from '../lib/auth-errors'
import { toSafeUser } from '../lib/safe-user'
import { loginSchema } from '../schemas/login.schema'
import type { SafeUser } from '../lib/safe-user'

export const login = createServerFn({ method: 'POST' })
  .validator(loginSchema)
  .handler(async ({ data }): Promise<SafeUser> => {
    const supabase = createSupabaseServerClient()
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error || !authData.user) {
      throw new Error(
        mapAuthErrorMessage(error ?? { message: 'Invalid login credentials' }),
      )
    }

    const user = toSafeUser(authData.user)

    if (!user) {
      throw new Error('Nije moguće dohvatiti prijavljenog korisnika.')
    }

    return user
  })
