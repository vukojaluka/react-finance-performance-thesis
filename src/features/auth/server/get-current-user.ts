import { createServerFn } from '@tanstack/react-start'

import { getAuthUser } from '../lib/get-auth-user'
import type { SafeUser } from '../lib/safe-user'

export const getCurrentUser = createServerFn({ method: 'GET' }).handler(
  async (): Promise<SafeUser | null> => {
    return getAuthUser()
  },
)
