import { createMiddleware } from '@tanstack/react-start'

import { createSupabaseServerClient } from '@/integrations/supabase/server'

/** Ensures an authenticated Supabase session; provides `user` and `supabase` to the handler via context. */
export const requireAuthMiddleware = createMiddleware({ type: 'function' }).server(
  async ({ next }) => {
    const supabase = createSupabaseServerClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new Error('Morate biti prijavljeni.')
    }

    return next({
      context: {
        user,
        supabase,
      },
    })
  },
)
