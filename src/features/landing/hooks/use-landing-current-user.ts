import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { currentUserQuery } from '@/features/auth/queries/current-user.query'

/** Resolves the session on the client so the public landing page does not block SSR. */
export function useLandingCurrentUser() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return useQuery({
    ...currentUserQuery(),
    enabled: isClient,
  })
}
