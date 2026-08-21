export const DEFAULT_POST_AUTH_REDIRECT = '/dashboard' as const

export function sanitizeRedirect(redirect: unknown): string {
  if (typeof redirect !== 'string') {
    return DEFAULT_POST_AUTH_REDIRECT
  }

  if (!redirect.startsWith('/') || redirect.startsWith('//')) {
    return DEFAULT_POST_AUTH_REDIRECT
  }

  return redirect
}
