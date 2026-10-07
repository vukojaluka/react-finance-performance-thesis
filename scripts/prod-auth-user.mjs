#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import { resolve } from 'node:path'

import { getProjectRefFromEnv, loadRemoteEnv } from './lib/load-remote-env.mjs'

const ROOT = resolve(import.meta.dirname, '..')

const EMAIL = process.env.SEED_USER_EMAIL
const PASSWORD = process.env.SEED_USER_PASSWORD
const FIRST_NAME = 'Luka'
const LAST_NAME = 'Vukoja'

function getServiceRoleKey() {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return process.env.SUPABASE_SERVICE_ROLE_KEY
  }

  const ref = getProjectRefFromEnv()
  const result = spawnSync(
    'npx',
    [
      'supabase',
      'projects',
      'api-keys',
      '--project-ref',
      ref,
      '--reveal',
      '-o',
      'json',
    ],
    { cwd: ROOT, encoding: 'utf8' },
  )

  if (result.status !== 0) {
    throw new Error(
      result.stderr?.trim() ||
        'Failed to read API keys via Supabase CLI. Run `npx supabase login`.',
    )
  }

  const parsed = JSON.parse(result.stdout)
  const secret =
    parsed.find((row) => row.name === 'service_role')?.api_key ??
    parsed.find((row) => row.type === 'secret')?.api_key

  if (!secret) {
    throw new Error('Could not resolve service_role API key from CLI output.')
  }

  return secret
}

async function findUserByEmail(serviceKey, email) {
  const url = process.env.VITE_SUPABASE_URL
  const perPage = 200
  let page = 1

  while (true) {
    const response = await fetch(
      `${url}/auth/v1/admin/users?page=${page}&per_page=${perPage}`,
      {
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
        },
      },
    )

    if (!response.ok) {
      const text = await response.text()
      throw new Error(`Auth admin list failed (${response.status}): ${text}`)
    }

    const payload = await response.json()
    const users = payload.users ?? payload
    const match = users.find((user) => user.email === email)
    if (match) {
      return match
    }

    if (!users.length || users.length < perPage) {
      return null
    }
    page += 1
  }
}

async function upsertAuthUser(serviceKey) {
  if (!EMAIL || !PASSWORD) {
    throw new Error('SEED_USER_EMAIL and SEED_USER_PASSWORD must be set.')
  }

  const url = process.env.VITE_SUPABASE_URL
  const existing = await findUserByEmail(serviceKey, EMAIL)

  if (existing) {
    const response = await fetch(`${url}/auth/v1/admin/users/${existing.id}`, {
      method: 'PUT',
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: PASSWORD,
        email_confirm: true,
        user_metadata: {
          first_name: FIRST_NAME,
          last_name: LAST_NAME,
        },
      }),
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error(`Auth admin update failed (${response.status}): ${text}`)
    }

    console.log('Updated existing auth user (password + metadata).')
    return existing.id
  }

  const response = await fetch(`${url}/auth/v1/admin/users`, {
    method: 'POST',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: EMAIL,
      password: PASSWORD,
      email_confirm: true,
      user_metadata: {
        first_name: FIRST_NAME,
        last_name: LAST_NAME,
      },
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Auth admin create failed (${response.status}): ${text}`)
  }

  const created = await response.json()
  console.log('Created auth user.')
  return created.id ?? created.user?.id
}

async function ensureProfile(serviceKey, userId) {
  const url = process.env.VITE_SUPABASE_URL
  const response = await fetch(`${url}/rest/v1/profiles`, {
    method: 'POST',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=ignore-duplicates',
    },
    body: JSON.stringify({
      id: userId,
      first_name: FIRST_NAME,
      last_name: LAST_NAME,
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Profile upsert failed (${response.status}): ${text}`)
  }

  console.log('Profile ensured.')
}

async function main() {
  loadRemoteEnv()
  const serviceKey = getServiceRoleKey()
  const userId = await upsertAuthUser(serviceKey)
  await ensureProfile(serviceKey, userId)
  console.log('Auth user ready.')
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
