import { createSupabaseServerClient } from '@/integrations/supabase/server'

import { toSafeUser } from './safe-user'
import type { SafeUser } from './safe-user'

export async function getAuthUser(): Promise<SafeUser | null> {
  const supabase = createSupabaseServerClient()
  const { data, error } = await supabase.auth.getUser()

  if (error) {
    return null
  }

  return toSafeUser(data.user)
}
