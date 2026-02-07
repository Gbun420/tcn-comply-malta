import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser()
  const { id } = await params
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase
    .from('reviews')
    .update({ status: 'submitted', submitted_at: new Date().toISOString() })
    .eq('id', id)
    .eq('author_user_id', user.id)
    .in('status', ['draft', 'needs_changes'])

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.redirect(new URL(`/reviews/${id}/edit`, request.url))
}
