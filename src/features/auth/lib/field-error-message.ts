export function getFieldErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error
  }

  if (Array.isArray(error) && error.length > 0) {
    return getFieldErrorMessage(error[0])
  }

  if (error && typeof error === 'object') {
    if ('message' in error && typeof error.message === 'string') {
      return error.message
    }

    if ('issues' in error && Array.isArray(error.issues) && error.issues.length > 0) {
      return getFieldErrorMessage(error.issues[0])
    }
  }

  return 'Neispravna vrijednost.'
}
