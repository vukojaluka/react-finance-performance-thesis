import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { currentUserQuery } from '@/features/auth/queries/current-user.query'
import { getCurrentUser } from '@/features/auth/server/get-current-user'

/** Resolves the session on the client so the public landing page does not block SSR. */
export function useLandingCurrentUser() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return useQuery({
    ...currentUserQuery(),
    enabled: isClient,
    retry: false,
    queryFn: async () => {
      try {
        return await getCurrentUser()
      } catch {
        return { user: null, isLoggedIn: false as const }
      }
    },
  })
}
