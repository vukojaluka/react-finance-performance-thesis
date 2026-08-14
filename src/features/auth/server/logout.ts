import { createServerFn } from '@tanstack/react-start'

import { mapSupabaseAuthErrors } from '@/integrations/supabase/auth-errors'
import { createSupabaseServerClient } from '@/integrations/supabase/server'

export const logout = createServerFn({ method: 'POST' }).handler(async () => {
  const supabase = createSupabaseServerClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw new Error(mapSupabaseAuthErrors(error))
  }

  return { success: true as const }
})
