import test from 'node:test'
import assert from 'node:assert/strict'
import { NextRequest } from 'next/server.js'
import { middleware } from '../middleware.ts'
import { requireEnvOrSkip } from './helpers/supabaseTestEnv.ts'

test('non-authenticated user is redirected away from /admin', async (t) => {
  requireEnvOrSkip(t)

  const req = new NextRequest('http://localhost:3001/admin')
  const res = await middleware(req)
  assert.ok(res)
  assert.ok(res.headers.get('location')?.includes('/auth/login'))
})
