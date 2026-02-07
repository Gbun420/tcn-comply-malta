import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/guards'
import { createSupabaseServerClient } from '@/lib/supabase/server'

function toReviewDecision(action: string) {
  switch (action) {
    case 'publish':
      return { newStatus: 'published', action: 'publish' }
    case 'reject':
      return { newStatus: 'rejected', action: 'reject' }
    case 'needs_changes':
      return { newStatus: 'needs_changes', action: 'needs_changes' }
    case 'remove':
      return { newStatus: 'removed', action: 'remove' }
    case 'temp_hide':
      return { newStatus: 'temp_hidden', action: 'temp_hide' }
    case 'restore':
      return { newStatus: 'published', action: 'restore' }
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
  const duration = String(fd.get('duration') || '')

  const decision = toReviewDecision(actionRaw)
  if (!decision) return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  const { error } = await supabase.rpc('mwv_admin_decide_review', {
    p_review_id: id,
    p_new_status: decision.newStatus,
    p_action: decision.action,
    p_basis: basis,
    p_explanation: explanation,
    p_scope: scope,
    p_duration: duration,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.redirect(new URL('/admin/reviews', request.url))
}
