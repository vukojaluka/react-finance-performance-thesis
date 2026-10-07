#!/usr/bin/env node
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import {
  ensureSupabaseLinked,
  supabaseCli,
} from './supabase-cli.mjs'

const ROOT = resolve(import.meta.dirname, '..')
const MIGRATION = '20260812111903_initial_schema.sql'

async function applyViaManagementApi() {
  const { getProjectRefFromEnv, loadRemoteEnv } = await import(
    './lib/load-remote-env.mjs'
  )
  loadRemoteEnv()
  const token = process.env.SUPABASE_ACCESS_TOKEN
  const ref = getProjectRefFromEnv()
  if (!token) {
    return false
  }

  const query = readFileSync(
    resolve(ROOT, 'supabase/migrations', MIGRATION),
    'utf8',
  )

  const response = await fetch(
    `https://api.supabase.com/v1/projects/${ref}/database/migrations`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: MIGRATION.replace('.sql', ''),
        query,
      }),
    },
  )

  if (!response.ok) {
    const body = await response.text()
    throw new Error(
      `Management API migration failed (${response.status}): ${body.slice(0, 500)}`,
    )
  }

  console.log('Migration applied via Management API.')
  return true
}

async function main() {
  const dryRun = process.argv.includes('--dry-run')

  if (dryRun) {
    console.log('Dry run: would push migration', MIGRATION)
    return
  }

  try {
    const applied = await applyViaManagementApi()
    if (applied) {
      return
    }

    ensureSupabaseLinked()
    console.log(supabaseCli(['db', 'push', '--linked', '--dry-run']))
    supabaseCli(['db', 'push', '--linked'], { inherit: true })
    console.log('Migration applied via supabase db push --linked.')
  } catch (error) {
    console.error(error.message)
    process.exit(1)
  }
}

main()
