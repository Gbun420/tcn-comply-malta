import test from 'node:test'
import assert from 'node:assert/strict'
import {
  createAnonClient,
  createServiceClient,
  getAuthedClient,
  requireEnvOrSkip,
} from './helpers/supabaseTestEnv'

test('publishing a review creates statements_of_reasons and audit_log rows', async (t) => {
  const env = requireEnvOrSkip(t)
  const service = createServiceClient(env)
  const anon = createAnonClient(env)

  // Create admin user.
  const adminEmail = `admin.${Date.now()}@test.local`
  const adminPass = 'password-please-change'
  const { data: adminCreated, error: adminCreateErr } = await service.auth.admin.createUser({
    email: adminEmail,
    password: adminPass,
    email_confirm: true,
  })
  assert.ifError(adminCreateErr)
  await service.from('profiles').upsert({ user_id: adminCreated.user.id, role: 'admin' })

  // Create normal user and employer.
  const userEmail = `user.${Date.now()}@test.local`
  const userPass = 'password-please-change'
  const { data: userCreated, error: userCreateErr } = await service.auth.admin.createUser({
    email: userEmail,
    password: userPass,
    email_confirm: true,
  })
  assert.ifError(userCreateErr)

  const { data: employer, error: empErr } = await service
    .from('employers')
    .insert({ name: `TestCo ${Date.now()}`, slug: `testco-${Date.now()}` })
    .select('id')
    .single()
  assert.ifError(empErr)

  // Sign in user and create draft review.
  const { data: userSession, error: signInErr } = await anon.auth.signInWithPassword({
    email: userEmail,
    password: userPass,
  })
  assert.ifError(signInErr)
  const userClient = await getAuthedClient(env, userSession.session!.access_token)

  const { data: review, error: reviewErr } = await userClient
    .from('reviews')
    .insert({
      employer_id: employer.id,
      author_user_id: userCreated.user.id,
      status: 'submitted',
      overall: 3,
      management: 3,
      worklife: 3,
      pay_fairness: 3,
      structured_answers: {},
      narrative_raw: 'Safe narrative with no contacts.',
      narrative_redacted: 'Safe narrative with no contacts.',
      submitted_at: new Date().toISOString(),
    })
    .select('id')
    .single()
  assert.ifError(reviewErr)

  // Sign in admin and publish via RPC.
  const { data: adminSession, error: adminSignInErr } = await anon.auth.signInWithPassword({
    email: adminEmail,
    password: adminPass,
  })
  assert.ifError(adminSignInErr)
  const adminClient = await getAuthedClient(env, adminSession.session!.access_token)

  const { error: rpcErr } = await adminClient.rpc('mwv_admin_decide_review', {
    p_review_id: review.id,
    p_new_status: 'published',
    p_action: 'publish',
    p_basis: 'policy_violation',
    p_explanation: 'Test publish.',
    p_scope: 'platform',
    p_duration: '',
  })
  assert.ifError(rpcErr)

  const { data: sor, error: sorErr } = await service
    .from('statements_of_reasons')
    .select('id')
    .eq('target_type', 'review')
    .eq('target_id', review.id)
    .eq('action', 'publish')
    .limit(1)
  assert.ifError(sorErr)
  assert.ok((sor || []).length === 1)

  const { data: audit, error: auditErr } = await service
    .from('audit_log')
    .select('id')
    .eq('entity', 'review')
    .eq('entity_id', review.id)
    .eq('action', 'publish')
    .limit(1)
  assert.ifError(auditErr)
  assert.ok((audit || []).length === 1)
})

test('employer role cannot select review_evidence for other users', async (t) => {
  const env = requireEnvOrSkip(t)
  const service = createServiceClient(env)
  const anon = createAnonClient(env)

  const employerEmail = `employer.${Date.now()}@test.local`
  const pass = 'password-please-change'
  const { data: created, error } = await service.auth.admin.createUser({
    email: employerEmail,
    password: pass,
    email_confirm: true,
  })
  assert.ifError(error)
  await service.from('profiles').upsert({ user_id: created.user.id, role: 'employer' })

  const { data: employerSession, error: signInErr } = await anon.auth.signInWithPassword({
    email: employerEmail,
    password: pass,
  })
  assert.ifError(signInErr)

  const employerClient = await getAuthedClient(env, employerSession.session!.access_token)
  const { data, error: selErr } = await employerClient.from('review_evidence').select('*').limit(1)
  // Either error (no privileges) or empty due to RLS is acceptable; the key is: no evidence is returned.
  if (selErr) return
  assert.equal((data || []).length, 0)
})
