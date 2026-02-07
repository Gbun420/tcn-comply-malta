import assert from 'node:assert/strict'
import test from 'node:test'

import { GET as employeesGet, POST as employeesPost } from '../app/api/employees/route.js'
import { GET as vacanciesGet, POST as vacanciesPost } from '../app/api/vacancies/route.js'

process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'test-jwt-secret-1234567890'

test('POST /api/employees returns 401 without auth token', async () => {
  const request = new Request('http://localhost/api/employees', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      passportNumber: 'P1234',
      nationality: 'MT',
      position: 'Admin',
      salary: '20000',
      email: 'employee@example.com',
      sector: 'hospitality',
    }),
  })

  const response = await employeesPost(request)
  const body = await response.json()

  assert.equal(response.status, 401)
  assert.equal(body.error, 'Unauthorized')
})

test('GET /api/employees returns 401 without auth token', async () => {
  const request = new Request('http://localhost/api/employees')

  const response = await employeesGet(request)
  const body = await response.json()

  assert.equal(response.status, 401)
  assert.equal(body.error, 'Unauthorized')
})

test('GET /api/vacancies returns 401 without auth token', async () => {
  const request = new Request('http://localhost/api/vacancies')

  const response = await vacanciesGet(request)
  const body = await response.json()

  assert.equal(response.status, 401)
  assert.equal(body.error, 'Unauthorized')
})

test('POST /api/vacancies returns 401 without auth token', async () => {
  const request = new Request('http://localhost/api/vacancies', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      title: 'Kitchen Assistant',
      description: 'Assist kitchen operations',
      salary: '18000',
      sector: 'hospitality',
      durationWeeks: 3,
    }),
  })

  const response = await vacanciesPost(request)
  const body = await response.json()

  assert.equal(response.status, 401)
  assert.equal(body.error, 'Unauthorized')
})
