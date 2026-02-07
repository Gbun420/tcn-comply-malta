import { createSupabaseServiceClient } from '@/lib/supabase/service'

async function main() {
  const email = process.argv[2]
  if (!email) {
    console.error('Usage: npm run make-admin -- user@example.com')
    process.exit(2)
  }

  const supabase = createSupabaseServiceClient()
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
