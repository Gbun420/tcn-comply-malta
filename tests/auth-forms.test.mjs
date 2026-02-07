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
