import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/guards'
import { createSupabaseServiceClient } from '@/lib/supabase/service'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getEvidenceBucket, getEvidenceUrlTtlSeconds } from '@/lib/env'

export async function POST(request: Request) {
  const { user } = await requireAdmin()
  const supabase = await createSupabaseServerClient()
  const fd = await request.formData().catch(async () => {
    const text = await request.text()
    return new URLSearchParams(text) as any
  })

  const evidence_id = String((fd as any).get('evidence_id') || '')
  if (!evidence_id) return NextResponse.json({ error: 'Missing evidence_id' }, { status: 400 })

  const { data: ev } = await supabase
    .from('review_evidence')
    .select('id, storage_path')
    .eq('id', evidence_id)
    .maybeSingle()
  if (!ev) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const admin = createSupabaseServiceClient()
  const { data, error } = await admin.storage
    .from(getEvidenceBucket())
    .createSignedUrl(ev.storage_path, getEvidenceUrlTtlSeconds())

  if (error || !data?.signedUrl)
    return NextResponse.json({ error: error?.message || 'Failed' }, { status: 400 })

  await admin.from('audit_log').insert({
    actor_user_id: user.id,
    action: 'view_evidence',
    entity: 'review_evidence',
    entity_id: evidence_id,
    meta: { storage_path: ev.storage_path },
  })

  return NextResponse.json({ url: data.signedUrl })
}
