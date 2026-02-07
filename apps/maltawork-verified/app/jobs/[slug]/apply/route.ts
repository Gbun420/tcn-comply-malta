import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const user = await requireUser()
  const { slug } = await params
  const supabase = await createSupabaseServerClient()
  const fd = await request.formData()
  const cover_letter = String(fd.get('cover_letter') || '').trim()

  const { data: job } = await supabase
    .from('published_jobs_public_view')
    .select('id')
    .eq('slug', slug)
    .maybeSingle()
  if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 })

  const { error } = await supabase.from('applications').insert({
    job_id: job.id,
    applicant_user_id: user.id,
    cover_letter: cover_letter || null,
    stage: 'New',
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.redirect(new URL(`/jobs/${slug}`, request.url))
}
