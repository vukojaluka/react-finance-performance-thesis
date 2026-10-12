import type { QueryClient } from '@tanstack/react-query'

import { currentUserQuery } from '@/features/auth/queries/current-user.query'

/** Clears all cached server state after login/logout to prevent cross-user data leaks. */
export function clearUserQueryCache(queryClient: QueryClient) {
  void queryClient.cancelQueries()
  queryClient.clear()
}

/**
 * Drops cached per-user data, then reloads the current user in place.
 * `queryClient.clear()` destroys query observers, so a second
 * `useSuspenseQuery(currentUserQuery())` on the same page (landing hero)
 * would keep its last snapshot. Removing every key except `auth` and
 * refetching `currentUserQuery` notifies all remaining observers.
 */
export async function resetUserQueryCache(queryClient: QueryClient) {
  void queryClient.cancelQueries()
  queryClient.removeQueries({
    predicate: (query) => query.queryKey[0] !== 'auth',
  })
  await queryClient.fetchQuery({
    ...currentUserQuery(),
    staleTime: 0,
  })
}
