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
