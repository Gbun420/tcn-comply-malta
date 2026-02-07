import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/guards'
import { createSupabaseServerClient } from '@/lib/supabase/server'

function toJobDecision(action: string) {
  switch (action) {
    case 'temp_hide':
      return { moderation_status: 'temp_hidden', action: 'temp_hide' }
    case 'remove':
      return { moderation_status: 'removed', action: 'remove' }
    case 'restore':
      return { moderation_status: 'visible', action: 'restore' }
    default:
      return null
  }
}

export async function POST(request: Request) {
  await requireAdmin()
  const supabase = await createSupabaseServerClient()
  const fd = await request.formData()
  const id = String(fd.get('id') || '')
  const actionRaw = String(fd.get('action') || '')
  const basis = String(fd.get('basis') || '')
  const explanation = String(fd.get('explanation') || '')
  const scope = String(fd.get('scope') || '')

  const decision = toJobDecision(actionRaw)
  if (!decision) return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  const { error } = await supabase.rpc('mwv_admin_decide_job', {
    p_job_id: id,
    p_new_moderation_status: decision.moderation_status,
    p_action: decision.action,
    p_basis: basis,
    p_explanation: explanation,
    p_scope: scope,
    p_duration: '',
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.redirect(new URL('/admin/jobs', request.url))
}
