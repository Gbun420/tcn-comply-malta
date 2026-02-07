import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { assertNarrativeAllowed } from '@/lib/contentFilters'
import { redactText } from '@/lib/redact'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser()
  const { id } = await params
  const supabase = await createSupabaseServerClient()
  const fd = await request.formData()

  const overall = Number(fd.get('overall') || 0)
  const management = Number(fd.get('management') || 0)
  const worklife = Number(fd.get('worklife') || 0)
  const pay_fairness = Number(fd.get('pay_fairness') || 0)
  const narrative_raw = String(fd.get('narrative_raw') || '').trim()

  try {
    assertNarrativeAllowed(narrative_raw)
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 })
  }

  const narrative_redacted = narrative_raw ? redactText(narrative_raw) : null
  const { error } = await supabase
    .from('reviews')
    .update({
      overall,
      management,
      worklife,
      pay_fairness,
      narrative_raw: narrative_raw || null,
      narrative_redacted,
    })
    .eq('id', id)
    .eq('author_user_id', user.id)
    .in('status', ['draft', 'needs_changes'])

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.redirect(new URL(`/reviews/${id}/edit`, request.url))
}
