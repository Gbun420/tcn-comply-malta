import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export type ProfileRole = 'user' | 'employer' | 'admin'

export async function getAuthedUser() {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.auth.getUser()
  if (error) return null
  return data.user
}

export async function requireUser() {
  const user = await getAuthedUser()
  if (!user) redirect('/auth/login')
  return user
}

export async function getMyRole(): Promise<ProfileRole | null> {
  const user = await getAuthedUser()
  if (!user) return null
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle()
  if (error || !data?.role) return null
  if (data.role !== 'user' && data.role !== 'employer' && data.role !== 'admin') return null
  return data.role
}

export async function requireRole(role: ProfileRole) {
  const user = await requireUser()
  const myRole = await getMyRole()
  if (role === 'admin') {
    if (myRole !== 'admin') redirect('/')
    return { user, role: myRole }
  }
  if (role === 'employer') {
    if (myRole !== 'employer' && myRole !== 'admin') redirect('/')
    return { user, role: myRole ?? 'user' }
  }
  return { user, role: myRole ?? 'user' }
}
