import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { resolve } from 'node:path'

import { getProjectRefFromEnv, loadRemoteEnv } from './lib/load-remote-env.mjs'

const ROOT = resolve(import.meta.dirname, '..')

function readAccessToken() {
  if (process.env.SUPABASE_ACCESS_TOKEN) {
    return process.env.SUPABASE_ACCESS_TOKEN
  }

  const tokenPath = resolve(homedir(), '.supabase/access-token')
  if (existsSync(tokenPath)) {
    return readFileSync(tokenPath, 'utf8').trim()
  }

  return null
}

function runSupabase(args, { inherit = false } = {}) {
  const result = spawnSync('npx', ['supabase', ...args], {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: inherit ? 'inherit' : 'pipe',
    env: process.env,
  })

  if (result.status !== 0) {
    const stderr = result.stderr?.trim() || ''
    const stdout = result.stdout?.trim() || ''
    throw new Error(
      `supabase ${args.join(' ')} failed (${result.status}): ${stderr || stdout}`,
    )
  }

  return result.stdout ?? ''
}

export function ensureSupabaseCliAuth() {
  loadRemoteEnv()
  const token = readAccessToken()
  if (!token) {
    throw new Error(
      'Supabase CLI is not authenticated. Run `npx supabase login` or set SUPABASE_ACCESS_TOKEN (optionally in supabase/.temp/remote.env).',
    )
  }

  runSupabase(['login', '--token', token])
}

export function ensureSupabaseLinked() {
  ensureSupabaseCliAuth()
  const projectRef = getProjectRefFromEnv()
  const refPath = resolve(ROOT, 'supabase/.temp/project-ref')

  if (existsSync(refPath)) {
    const linked = readFileSync(refPath, 'utf8').trim()
    if (linked === projectRef) {
      return projectRef
    }
  }

  const password = process.env.SUPABASE_DB_PASSWORD
  const linkArgs = ['link', '--project-ref', projectRef, '--yes']
  if (password) {
    linkArgs.push('--password', password)
  }

  runSupabase(linkArgs, { inherit: !password })
  return projectRef
}

export function supabaseCli(args, options) {
  loadRemoteEnv()
  return runSupabase(args, options)
}
