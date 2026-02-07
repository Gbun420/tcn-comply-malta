import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/guards'
import { createSupabaseServiceClient } from '@/lib/supabase/service'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getEvidenceBucket } from '@/lib/env'

export async function POST(request: Request) {
  const { user } = await requireAdmin()
  const supabase = await createSupabaseServerClient()
  const fd = await request.formData().catch(async () => {
    const text = await request.text()
    return new URLSearchParams(text) as any
  })

  const evidence_id = String((fd as any).get('evidence_id') || '')
  const decision = String((fd as any).get('decision') || '')
  if (!evidence_id) return NextResponse.json({ error: 'Missing evidence_id' }, { status: 400 })
  if (!['verified', 'rejected', 'deleted'].includes(decision)) {
    return NextResponse.json({ error: 'Invalid decision' }, { status: 400 })
  }

  const { data: ev } = await supabase
    .from('review_evidence')
    .select('id, storage_path, status')
    .eq('id', evidence_id)
    .maybeSingle()
  if (!ev) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const admin = createSupabaseServiceClient()

  if (decision === 'deleted') {
    await admin.storage.from(getEvidenceBucket()).remove([ev.storage_path])
    await admin.from('review_evidence').update({ status: 'deleted' }).eq('id', evidence_id)
  } else {
    await admin.from('review_evidence').update({ status: decision }).eq('id', evidence_id)
  }

  await admin.from('audit_log').insert({
    actor_user_id: user.id,
    action: `evidence_${decision}`,
    entity: 'review_evidence',
    entity_id: evidence_id,
    meta: { previous_status: ev.status },
  })

  return NextResponse.json({ ok: true })
}
