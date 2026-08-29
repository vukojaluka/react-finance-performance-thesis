import type { QueryClient } from '@tanstack/react-query'

/** Clears all cached server state after login/logout to prevent cross-user data leaks. */
export function clearUserQueryCache(queryClient: QueryClient) {
  void queryClient.cancelQueries()
  queryClient.clear()
}
