import { createServerClient } from '@supabase/ssr'
import { createServerOnlyFn } from '@tanstack/react-start'
import WebSocket from 'ws'
import {
  getCookies,
  setCookie,
  setResponseHeader,
} from '@tanstack/react-start/server'

import type { Database } from './database.types'

/** Node 20 has no global WebSocket; Supabase Realtime still expects one during SSR. */
function ensureServerWebSocket() {
  if (typeof globalThis.WebSocket === 'undefined') {
    globalThis.WebSocket = WebSocket as typeof globalThis.WebSocket
  }
}

export const createSupabaseServerClient = createServerOnlyFn(() => {
  ensureServerWebSocket()

  return createServerClient<Database>(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return Object.entries(getCookies()).map(([name, value]) => ({
            name,
            value,
          }))
        },
        setAll(cookies, headers) {
          cookies.forEach(({ name, value, options }) => {
            setCookie(name, value, options)
          })

          Object.entries(headers).forEach(([name, value]) => {
            setResponseHeader(name, value)
          })
        },
      },
    },
  )
})
