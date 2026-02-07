import { createSupabaseServiceClient } from '@/lib/supabase/service'
import { slugify } from '@/lib/slug'

async function main() {
  const supabase = createSupabaseServiceClient()

  const seedEmail = 'seed.admin@maltawork.local'
  const seedPassword = 'password-please-change'

  const { data: created, error: createErr } = await supabase.auth.admin.createUser({
    email: seedEmail,
    password: seedPassword,
    email_confirm: true,
  })
  if (createErr) throw new Error(createErr.message)

  const adminUserId = created.user.id
  await supabase.from('profiles').upsert({ user_id: adminUserId, role: 'admin' })

  const employerName = 'HarbourTech Malta'
  const employerSlug = slugify(employerName)
  const { data: employerRow, error: empErr } = await supabase
    .from('employers')
    .upsert({
      name: employerName,
      slug: employerSlug,
      industry: 'Software',
      size: '51-200',
      website: 'https://example.com',
      locations: ['Valletta'],
      claim_status: 'unclaimed',
      verified_status: 'unverified',
    })
    .select('id')
    .single()
  if (empErr) throw new Error(empErr.message)

  const jobTitle = 'Frontend Engineer'
  const jobSlug = `${slugify(jobTitle)}-${Math.random().toString(16).slice(2, 6)}`
  const { error: jobErr } = await supabase.from('jobs').upsert({
    employer_id: employerRow.id,
    title: jobTitle,
    slug: jobSlug,
    description: 'Build safety-first product experiences. Malta-based.',
    location: 'Valletta',
    remote_type: 'hybrid',
    employment_type: 'full_time',
    category: 'Engineering',
    salary_min: 45000,
    salary_max: 65000,
    currency: 'EUR',
    status: 'published',
    moderation_status: 'visible',
  })
  if (jobErr) throw new Error(jobErr.message)

  // Seed a published review using the seed admin user as author (ok for MVP seed).
  const reviewRaw =
    'I appreciated the clear policies and predictable schedule. Pay progression could be clearer. No individuals named.'
  const reviewRedacted = reviewRaw
  const { data: review, error: reviewErr } = await supabase
    .from('reviews')
    .insert({
      employer_id: employerRow.id,
      author_user_id: adminUserId,
      status: 'published',
      overall: 4,
      management: 3,
      worklife: 4,
      pay_fairness: 3,
      structured_answers: { tenure: '1-2 years', department: 'Engineering' },
      narrative_raw: reviewRaw,
      narrative_redacted: reviewRedacted,
      submitted_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
    })
    .select('id')
    .single()
  if (reviewErr) throw new Error(reviewErr.message)

  await supabase.from('statements_of_reasons').insert({
    target_type: 'review',
    target_id: review.id,
    action: 'publish',
    basis: 'policy_violation',
    explanation: 'Seed content for local MVP demo.',
    scope: 'platform',
  })

  await supabase.from('audit_log').insert({
    actor_user_id: adminUserId,
    action: 'publish',
    entity: 'review',
    entity_id: review.id,
    meta: { seed: true },
  })

  console.log('Seed complete.')
  console.log('Seed admin login:', seedEmail, seedPassword)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
