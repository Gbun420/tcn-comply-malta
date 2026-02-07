import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'

function read(relativePath) {
  return fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8')
}

test('login and register forms enforce POST submission method', () => {
  const loginPage = read('app/auth/login/page.js')
  const registerPage = read('app/auth/register/page.js')

  assert.match(loginPage, /<form[^>]*method="post"/)
  assert.match(registerPage, /<form[^>]*method="post"/)
})

test('register page provides guided fallback messaging for provider outages', () => {
  const registerPage = read('app/auth/register/page.js')

  assert.match(registerPage, /Self-registration is currently paused/i)
  assert.match(registerPage, /SITE_CONTACT_EMAIL/)
})

test('login page provides guided fallback messaging for auth provider outages', () => {
  const loginPage = read('app/auth/login/page.js')

  assert.match(loginPage, /Sign-in is temporarily unavailable/i)
})

test('register page includes required terms/privacy consent and turnstile token wiring', () => {
  const registerPage = read('app/auth/register/page.js')

  assert.match(registerPage, /consentTerms/)
  assert.match(registerPage, /consentPrivacy/)
  assert.match(registerPage, /turnstileToken/)
  assert.match(registerPage, /TurnstileWidget/)
})
