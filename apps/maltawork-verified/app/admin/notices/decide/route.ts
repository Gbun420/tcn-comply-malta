import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/guards'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  await requireAdmin()
  const supabase = await createSupabaseServerClient()
  const fd = await request.formData()
  const id = String(fd.get('id') || '')
  const status = String(fd.get('status') || 'open')
  const decided_at = status === 'open' ? null : new Date().toISOString()

  const { error } = await supabase.from('dsa_notices').update({ status, decided_at }).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  await supabase.from('audit_log').insert({
    action: 'dsa_notice_decided',
    entity: 'dsa_notice',
    entity_id: id,
    meta: { status },
  })

  return NextResponse.redirect(new URL('/admin/notices', request.url))
}
