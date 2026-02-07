import { createSupabaseServerClient } from '@/lib/supabase/server'
import { requireUser } from '@/lib/auth'
import { ReviewNewForm } from '@/app/reviews/new/reviewNewForm'

export const dynamic = 'force-dynamic'

export default async function NewReviewPage() {
  await requireUser()
  const supabase = await createSupabaseServerClient()
  const { data: employers } = await supabase
    .from('employers_public_view')
    .select('id, name')
    .order('name', { ascending: true })
    .limit(200)

  return <ReviewNewForm employers={employers || []} />
}
