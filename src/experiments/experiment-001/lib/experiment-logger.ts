function now(): number {
  if (
    typeof performance !== 'undefined' &&
    typeof performance.now === 'function'
  ) {
    return performance.now()
  }

  return Date.now()
}

/**
 * Standard production benchmark builds intentionally stay silent. Set
 * VITE_EXPERIMENT_001_LOGGING=true at build time for a diagnostic production
 * build, or use the development server where logging is enabled by default.
 */
const experimentLoggingEnabled =
  import.meta.env.DEV || import.meta.env.VITE_EXPERIMENT_001_LOGGING === 'true'

export function experimentLog(event: string, detail?: string): void {
  if (!experimentLoggingEnabled) {
    return
  }

  const timestamp = now().toFixed(2)
  const suffix = detail ? ` | ${detail}` : ''
  console.log(`[experiment-001][${timestamp}ms] ${event}${suffix}`)
}
