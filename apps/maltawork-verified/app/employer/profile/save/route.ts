import { NextResponse } from 'next/server'
import { requireEmployerOrAdmin } from '@/lib/guards'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const { user } = await requireEmployerOrAdmin()
  const supabase = await createSupabaseServerClient()
  const fd = await request.formData()
  const id = String(fd.get('id') || '')
  const website = String(fd.get('website') || '').trim()
  const industry = String(fd.get('industry') || '').trim()
  const size = String(fd.get('size') || '').trim()

  const { error } = await supabase
    .from('employers')
    .update({ website: website || null, industry: industry || null, size: size || null })
    .eq('id', id)
    .eq('owner_user_id', user.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.redirect(new URL('/employer/profile', request.url))
}
