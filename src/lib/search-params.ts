export function emptyStringToUndefined(
  extraSentinels: readonly string[] = [],
) {
  return (value: unknown) => {
    if (typeof value !== 'string') {
      return value
    }

    const trimmed = value.trim()

    if (trimmed === '' || extraSentinels.includes(trimmed)) {
      return undefined
    }

    return trimmed
  }
}
