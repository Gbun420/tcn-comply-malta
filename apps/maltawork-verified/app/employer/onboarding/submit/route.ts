import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const user = await requireUser()
  const supabase = await createSupabaseServerClient()
  const fd = await request.formData()
  const employer_id = String(fd.get('employer_id') || '')
  const domain_email = String(fd.get('domain_email') || '').trim()

  if (!employer_id || !domain_email)
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const { error } = await supabase.from('employer_claims').insert({
    employer_id,
    requester_user_id: user.id,
    domain_email,
    status: 'pending',
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.redirect(new URL('/employer/profile', request.url))
}
