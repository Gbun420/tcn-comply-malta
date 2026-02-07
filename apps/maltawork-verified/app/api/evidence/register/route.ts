import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getEvidenceDefaultTtlDays } from '@/lib/env'

export async function POST(request: Request) {
  const user = await requireUser()
  const supabase = await createSupabaseServerClient()
  const fd = await request.formData()
  const review_id = String(fd.get('review_id') || '')
  const storage_path = String(fd.get('storage_path') || '')
  const evidence_type = String(fd.get('evidence_type') || 'proof_of_employment')

  if (!review_id || !storage_path)
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  if (!storage_path.startsWith(`${user.id}/`))
    return NextResponse.json({ error: 'Invalid storage path' }, { status: 400 })

  const ttlDays = getEvidenceDefaultTtlDays()
  const expires_at = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000).toISOString()

  // Ensure user owns the review.
  const { data: review } = await supabase
    .from('reviews')
    .select('id')
    .eq('id', review_id)
    .eq('author_user_id', user.id)
    .maybeSingle()
  if (!review) return NextResponse.json({ error: 'Review not found' }, { status: 404 })

  const { error } = await supabase.from('review_evidence').insert({
    review_id,
    uploader_user_id: user.id,
    storage_path,
    evidence_type,
    status: 'pending',
    expires_at,
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ ok: true, expires_at })
}
