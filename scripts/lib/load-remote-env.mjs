import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const REMOTE_ENV_PATH = resolve(
  process.cwd(),
  'supabase/.temp/remote.env',
)

/**
 * Loads optional gitignored credentials for production CLI operations.
 * File format: KEY=value lines (no export prefix). Never commit this file.
 */
export function loadRemoteEnv() {
  if (!existsSync(REMOTE_ENV_PATH)) {
    return
  }

  const content = readFileSync(REMOTE_ENV_PATH, 'utf8')
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) {
      continue
    }
    const eq = trimmed.indexOf('=')
    if (eq <= 0) {
      continue
    }
    const key = trimmed.slice(0, eq).trim()
    const value = trimmed.slice(eq + 1).trim()
    if (!process.env[key]) {
      process.env[key] = value
    }
  }
}

export function getProjectRefFromEnv() {
  const url = process.env.VITE_SUPABASE_URL
  if (!url) {
    throw new Error('VITE_SUPABASE_URL is not set')
  }
  const match = url.match(/^https:\/\/([^.]+)\.supabase\.co\/?$/)
  if (!match) {
    throw new Error('VITE_SUPABASE_URL is not a hosted Supabase URL')
  }
  return match[1]
}
