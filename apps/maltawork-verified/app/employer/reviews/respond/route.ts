import { NextResponse } from 'next/server'
import { requireEmployerOrAdmin } from '@/lib/guards'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { assertNarrativeAllowed } from '@/lib/contentFilters'
import { redactText } from '@/lib/redact'

export async function POST(request: Request) {
  const { user } = await requireEmployerOrAdmin()
  const supabase = await createSupabaseServerClient()
  const fd = await request.formData()
  const review_id = String(fd.get('review_id') || '')
  const response_raw = String(fd.get('response_raw') || '').trim()

  try {
    assertNarrativeAllowed(response_raw)
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 })
  }

  const response_redacted = redactText(response_raw)

  const { data: employer } = await supabase
    .from('employers')
    .select('id')
    .eq('owner_user_id', user.id)
    .maybeSingle()
  if (!employer) return NextResponse.json({ error: 'No employer linked' }, { status: 400 })

  const { error } = await supabase.from('employer_review_responses').insert({
    review_id,
    employer_id: employer.id,
    responder_user_id: user.id,
    status: 'submitted',
    response_raw,
    response_redacted,
    submitted_at: new Date().toISOString(),
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.redirect(new URL('/employer/reviews', request.url))
}
