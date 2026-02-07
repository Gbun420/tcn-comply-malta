import { createSupabaseServerClient } from '@/lib/supabase/server'

export type Role = 'user' | 'employer' | 'admin'

export async function requireAdmin() {
  const supabase = await createSupabaseServerClient()
  const { data: authData, error: authError } = await supabase.auth.getUser()
  if (authError || !authData.user) throw new Error('Unauthorized')
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', authData.user.id)
    .maybeSingle()
  if (profile?.role !== 'admin') throw new Error('Forbidden')
  return { user: authData.user }
}

export async function requireEmployerOrAdmin() {
  const supabase = await createSupabaseServerClient()
  const { data: authData, error: authError } = await supabase.auth.getUser()
  if (authError || !authData.user) throw new Error('Unauthorized')
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', authData.user.id)
    .maybeSingle()
  if (profile?.role !== 'employer' && profile?.role !== 'admin') throw new Error('Forbidden')
  return { user: authData.user, role: profile?.role as Role }
}
