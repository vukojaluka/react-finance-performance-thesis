function now(): number {
  if (
    typeof performance !== 'undefined' &&
    typeof performance.now === 'function'
  ) {
    return performance.now()
  }

  return Date.now()
}

export function experimentLog(event: string, detail?: string): void {
  const timestamp = now().toFixed(2)
  const suffix = detail ? ` | ${detail}` : ''
  console.log(`[experiment-001][${timestamp}ms] ${event}${suffix}`)
}
