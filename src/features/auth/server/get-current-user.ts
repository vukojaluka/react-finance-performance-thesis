import { createServerFn } from '@tanstack/react-start'

import { createSupabaseServerClient } from '@/integrations/supabase/server'

import { toSafeUser } from '../lib/safe-user'
import type { SafeUser } from '../lib/safe-user'

export type CurrentUserResult =
  { user: SafeUser; isLoggedIn: true } | { user: null; isLoggedIn: false }

export const getCurrentUser = createServerFn({ method: 'GET' }).handler(
  async (): Promise<CurrentUserResult> => {
    const supabase = createSupabaseServerClient()
    const { data, error } = await supabase.auth.getUser()

    console.log('getCurrentUser called')

    if (error) {
      return { user: null, isLoggedIn: false }
    }

    const user = toSafeUser(data.user)

    if (!user) {
      return { user: null, isLoggedIn: false }
    }

    return { user, isLoggedIn: true }
  },
)
