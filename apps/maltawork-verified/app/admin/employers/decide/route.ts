import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/guards'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  await requireAdmin()
  const supabase = await createSupabaseServerClient()
  const fd = await request.formData()
  const id = String(fd.get('id') || '')
  const decision = String(fd.get('decision') || '')
  const notes = String(fd.get('notes') || '').trim()

  const { data: claim } = await supabase
    .from('employer_claims')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (!claim) return NextResponse.json({ error: 'Claim not found' }, { status: 404 })

  if (decision === 'approve') {
    await supabase
      .from('employer_claims')
      .update({ status: 'approved', notes: notes || null })
      .eq('id', id)
    await supabase
      .from('employers')
      .update({
        owner_user_id: claim.requester_user_id,
        claim_status: 'claimed',
        verified_status: 'verified',
      })
      .eq('id', claim.employer_id)
    await supabase
      .from('profiles')
      .update({ role: 'employer' })
      .eq('user_id', claim.requester_user_id)
    await supabase.from('audit_log').insert({
      action: 'approve_employer_claim',
      entity: 'employer_claim',
      entity_id: id,
      meta: { employer_id: claim.employer_id, requester_user_id: claim.requester_user_id },
    })
  } else if (decision === 'deny') {
    await supabase
      .from('employer_claims')
      .update({ status: 'denied', notes: notes || null })
      .eq('id', id)
    await supabase.from('audit_log').insert({
      action: 'deny_employer_claim',
      entity: 'employer_claim',
      entity_id: id,
      meta: { employer_id: claim.employer_id, requester_user_id: claim.requester_user_id },
    })
  } else {
    return NextResponse.json({ error: 'Invalid decision' }, { status: 400 })
  }

  return NextResponse.redirect(new URL('/admin/employers', request.url))
}
