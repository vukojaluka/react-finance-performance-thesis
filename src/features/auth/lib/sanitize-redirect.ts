export function sanitizeRedirect(redirect: unknown): string {
  if (typeof redirect !== 'string') {
    return '/'
  }

  if (!redirect.startsWith('/') || redirect.startsWith('//')) {
    return '/'
  }

  return redirect
}
