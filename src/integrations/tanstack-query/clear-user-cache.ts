import type { QueryClient } from '@tanstack/react-query'

import { currentUserQuery } from '@/features/auth/queries/current-user.query'

/** Clears all cached server state after login/logout to prevent cross-user data leaks. */
export function clearUserQueryCache(queryClient: QueryClient) {
  void queryClient.cancelQueries()
  queryClient.clear()
}

/**
 * Clears cached server state, then reloads the current user.
 * `queryClient.clear()` does not notify observers, so a follow-up
 * `fetchQuery` is required for every `useQuery` / `useSuspenseQuery`
 * consumer (header, hero, mobile menu) to refresh.
 */
export async function resetUserQueryCache(queryClient: QueryClient) {
  clearUserQueryCache(queryClient)
  await queryClient.fetchQuery(currentUserQuery())
}
