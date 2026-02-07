import { createClient } from '@supabase/supabase-js'

function requireEnv(name: string) {
  const v = process.env[name]
  if (!v) throw new Error(`Missing required env var: ${name}`)
  return v
}

async function main() {
  const email = process.argv[2]
  if (!email) {
    console.error('Usage: npm run make-admin -- user@example.com')
    process.exit(2)
  }

  const supabaseUrl = requireEnv('NEXT_PUBLIC_SUPABASE_URL')
  const serviceKey = requireEnv('SUPABASE_SERVICE_ROLE_KEY')
  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })
  // Supabase admin API doesn't provide a direct get-by-email; list is fine for local MVP.
  const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 })
  if (error) throw new Error(error.message)
  const user = data.users.find((u) => (u.email || '').toLowerCase() === email.toLowerCase())
  if (!user) {
    throw new Error(`User not found for email: ${email}`)
  }

  const { error: upErr } = await supabase
    .from('profiles')
    .upsert({ user_id: user.id, role: 'admin' })
  if (upErr) throw new Error(upErr.message)

  console.log(`Promoted to admin: ${email}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
