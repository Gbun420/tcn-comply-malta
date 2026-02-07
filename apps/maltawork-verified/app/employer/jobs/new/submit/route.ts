import { NextResponse } from 'next/server'
import { requireEmployerOrAdmin } from '@/lib/guards'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { slugify } from '@/lib/slug'

export async function POST(request: Request) {
  const { user } = await requireEmployerOrAdmin()
  const supabase = await createSupabaseServerClient()
  const fd = await request.formData()
  const employer_id = String(fd.get('employer_id') || '')
  const title = String(fd.get('title') || '').trim()
  const location = String(fd.get('location') || '').trim()
  const remote_type = String(fd.get('remote_type') || '').trim()
  const employment_type = String(fd.get('employment_type') || '').trim()
  const category = String(fd.get('category') || '').trim()
  const description = String(fd.get('description') || '').trim()
  const salary_min = fd.get('salary_min') ? Number(fd.get('salary_min')) : null
  const salary_max = fd.get('salary_max') ? Number(fd.get('salary_max')) : null
  const publishNow = Boolean(fd.get('publish_now'))

  const { data: employer } = await supabase
    .from('employers')
    .select('id')
    .eq('id', employer_id)
    .eq('owner_user_id', user.id)
    .maybeSingle()
  if (!employer) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const baseSlug = slugify(`${title}-${location}`)
  const slug = `${baseSlug}-${Math.random().toString(16).slice(2, 6)}`

  const { data, error } = await supabase
    .from('jobs')
    .insert({
      employer_id,
      title,
      slug,
      description,
      location,
      remote_type,
      employment_type,
      category,
      salary_min,
      salary_max,
      status: publishNow ? 'published' : 'draft',
      moderation_status: 'visible',
    })
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.redirect(new URL('/employer/jobs', request.url))
}
