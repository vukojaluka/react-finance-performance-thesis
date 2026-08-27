/// <reference types="vite/types/importMeta.d.ts" />
import { createBrowserClient } from '@supabase/ssr'

import type { Database } from './database.types'

export function createSupabaseClient() {
  return createBrowserClient<Database>(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  )
}
