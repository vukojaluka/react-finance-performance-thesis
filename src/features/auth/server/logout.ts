import { createServerFn } from '@tanstack/react-start'

import { createSupabaseServerClient } from '@/integrations/supabase/server'

import { mapAuthErrorMessage } from '../lib/auth-errors'

export const logout = createServerFn({ method: 'POST' }).handler(async () => {
  const supabase = createSupabaseServerClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw new Error(mapAuthErrorMessage(error))
  }

  return { success: true as const }
})
