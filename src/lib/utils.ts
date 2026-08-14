import { clsx } from 'clsx'
import type { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getFormFieldErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error
  }

  if (Array.isArray(error) && error.length > 0) {
    return error
      .map((item) => getFormFieldErrorMessage(item))
      .filter(Boolean)
      .join('\n')
  }

  if (error && typeof error === 'object') {
    if ('message' in error && typeof error.message === 'string') {
      return error.message
    }

    if (
      'issues' in error &&
      Array.isArray(error.issues) &&
      error.issues.length > 0
    ) {
      return getFormFieldErrorMessage(error.issues)
    }
  }

  return 'Neispravna vrijednost.'
}

export function sanitizeRedirect(redirect: unknown): string {
  if (typeof redirect !== 'string') {
    return '/'
  }

  if (!redirect.startsWith('/') || redirect.startsWith('//')) {
    return '/'
  }

  return redirect
}
