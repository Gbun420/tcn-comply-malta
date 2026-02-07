import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { assertNarrativeAllowed } from '@/lib/contentFilters'
import { redactText } from '@/lib/redact'

export async function POST(request: Request) {
  const user = await requireUser()
  const supabase = await createSupabaseServerClient()
  const fd = await request.formData()

  const employer_id = String(fd.get('employer_id') || '')
  const overall = Number(fd.get('overall') || 0)
  const management = Number(fd.get('management') || 0)
  const worklife = Number(fd.get('worklife') || 0)
  const pay_fairness = Number(fd.get('pay_fairness') || 0)
  const narrative_raw = String(fd.get('narrative_raw') || '').trim()

  if (!employer_id) return NextResponse.json({ error: 'Missing employer' }, { status: 400 })
  if (![overall, management, worklife, pay_fairness].every((x) => x >= 1 && x <= 5)) {
    return NextResponse.json({ error: 'Invalid rating' }, { status: 400 })
  }

  try {
    assertNarrativeAllowed(narrative_raw)
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 })
  }

  const narrative_redacted = narrative_raw ? redactText(narrative_raw) : null

  const { data, error } = await supabase
    .from('reviews')
    .insert({
      employer_id,
      author_user_id: user.id,
      status: 'draft',
      overall,
      management,
      worklife,
      pay_fairness,
      structured_answers: {},
      narrative_raw: narrative_raw || null,
      narrative_redacted,
    })
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ id: data.id })
}
