import { queryOptions } from '@tanstack/react-query'

import { getCurrentUser } from '../server/get-current-user'

export function currentUserQuery() {
  return queryOptions({
    queryKey: ['auth', 'current-user'] as const,
    queryFn: () => getCurrentUser(),
  })
}
