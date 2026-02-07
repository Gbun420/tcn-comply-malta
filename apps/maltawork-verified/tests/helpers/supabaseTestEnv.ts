import { createClient } from '@supabase/supabase-js'

export function getRequiredEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !anon || !service) return null
  return { url, anon, service }
}

export function createAnonClient(env: { url: string; anon: string }) {
  return createClient(env.url, env.anon, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export function createServiceClient(env: { url: string; service: string }) {
  return createClient(env.url, env.service, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export async function getAuthedClient(env: { url: string; anon: string }, accessToken: string) {
  // Supabase-js uses the Authorization header as bearer for PostgREST.
  return createClient(env.url, env.anon, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })
}

export function requireEnvOrSkip(t: { skip: (reason: string) => void }) {
  const env = getRequiredEnv()
  if (!env) {
    t.skip(
      'Missing SUPABASE env vars; start Supabase local and export NEXT_PUBLIC_SUPABASE_URL/NEXT_PUBLIC_SUPABASE_ANON_KEY/SUPABASE_SERVICE_ROLE_KEY.'
    )
    return null
  }
  return env
}
