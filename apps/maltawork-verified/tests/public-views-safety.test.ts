import test from 'node:test'
import assert from 'node:assert/strict'
import { createAnonClient, requireEnvOrSkip } from './helpers/supabaseTestEnv'

test('published_reviews_public_view never returns author_user_id or narrative_raw', async (t) => {
  const env = requireEnvOrSkip(t)
  const supabase = createAnonClient(env)

  const { data, error } = await supabase.from('published_reviews_public_view').select('*').limit(5)
  assert.ifError(error)

  for (const row of data || []) {
    assert.equal(Object.prototype.hasOwnProperty.call(row, 'author_user_id'), false)
    assert.equal(Object.prototype.hasOwnProperty.call(row, 'narrative_raw'), false)
  }
})

test('anon cannot select from reviews base table', async (t) => {
  const env = requireEnvOrSkip(t)
  const supabase = createAnonClient(env)
  const { error } = await supabase.from('reviews').select('*').limit(1)
  assert.ok(error, 'expected error due to revoked privileges/RLS')
})
