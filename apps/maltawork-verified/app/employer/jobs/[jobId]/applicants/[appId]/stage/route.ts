import { NextResponse } from 'next/server'
import { requireEmployerOrAdmin } from '@/lib/guards'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ jobId: string; appId: string }> }
) {
  const { user } = await requireEmployerOrAdmin()
  const { jobId, appId } = await params
  const supabase = await createSupabaseServerClient()
  const fd = await request.formData()
  const stage = String(fd.get('stage') || '')

  // RLS also enforces employer ownership.
  const { data: job } = await supabase
    .from('jobs')
    .select('id, employer_id')
    .eq('id', jobId)
    .maybeSingle()
  if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 })

  const { data: employer } = await supabase
    .from('employers')
    .select('id')
    .eq('id', job.employer_id)
    .eq('owner_user_id', user.id)
    .maybeSingle()
  if (!employer) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { error } = await supabase
    .from('applications')
    .update({ stage })
    .eq('id', appId)
    .eq('job_id', jobId)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.redirect(new URL(`/employer/jobs/${jobId}/applicants`, request.url))
}
