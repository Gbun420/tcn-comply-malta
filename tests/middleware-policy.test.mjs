import assert from 'node:assert/strict'
import test from 'node:test'

import { evaluateMiddlewareRequest } from '../lib/middleware-policy.js'
import { PUBLIC_PATHS } from '../lib/public-pages.js'

test('auth login remains reachable even when auth cookie exists', () => {
  const outcome = evaluateMiddlewareRequest({
    method: 'GET',
    pathname: '/auth/login',
    hasToken: true,
    isApiRoute: false,
    isAuthApiRoute: false,
    publicPaths: PUBLIC_PATHS,
  })

  assert.equal(outcome, 'allow')
})

test('dashboard without token redirects to login', () => {
  const outcome = evaluateMiddlewareRequest({
    method: 'GET',
    pathname: '/dashboard',
    hasToken: false,
    isApiRoute: false,
    isAuthApiRoute: false,
    publicPaths: PUBLIC_PATHS,
  })

  assert.equal(outcome, 'redirect-login')
})

test('protected api without token returns unauthorized action', () => {
  const outcome = evaluateMiddlewareRequest({
    method: 'GET',
    pathname: '/api/employees',
    hasToken: false,
    isApiRoute: true,
    isAuthApiRoute: false,
    publicPaths: PUBLIC_PATHS,
  })

  assert.equal(outcome, 'api-unauthorized')
})

test('public marketing pages remain accessible without token', () => {
  const outcome = evaluateMiddlewareRequest({
    method: 'GET',
    pathname: '/pricing',
    hasToken: false,
    isApiRoute: false,
    isAuthApiRoute: false,
    publicPaths: PUBLIC_PATHS,
  })

  assert.equal(outcome, 'allow')
})

test('api preflight requests bypass authentication', () => {
  const outcome = evaluateMiddlewareRequest({
    method: 'OPTIONS',
    pathname: '/api/vacancies',
    hasToken: false,
    isApiRoute: true,
    isAuthApiRoute: false,
    publicPaths: PUBLIC_PATHS,
  })

  assert.equal(outcome, 'api-preflight')
})

test('public api routes remain accessible without token', () => {
  const outcome = evaluateMiddlewareRequest({
    method: 'GET',
    pathname: '/api/health',
    hasToken: false,
    isApiRoute: true,
    isAuthApiRoute: false,
    publicPaths: PUBLIC_PATHS,
  })

  assert.equal(outcome, 'allow')
})
