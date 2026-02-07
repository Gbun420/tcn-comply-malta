import jwt from 'jsonwebtoken'
import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

const DEV_JWT_SECRET = 'tcn-comply-malta-dev-jwt-secret'
export const JWT_SECRET_PRODUCTION_ERROR = 'JWT_SECRET is required in production'

function getJwtSecret() {
  const configuredSecret = process.env.JWT_SECRET

  if (configuredSecret && configuredSecret.length >= 16) {
    return configuredSecret
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error(JWT_SECRET_PRODUCTION_ERROR)
  }

  return configuredSecret || DEV_JWT_SECRET
}

function getFirebaseApiKey() {
  const apiKey = process.env.FIREBASE_API_KEY

  if (!apiKey || apiKey.includes('YOUR_') || apiKey.length < 20) {
    return null
  }

  return apiKey
}

function hasFirebaseAdminConfig() {
  const projectId = process.env.FIREBASE_PROJECT_ID
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL

  if (!projectId || !privateKey || !clientEmail) {
    return false
  }

  if (
    projectId.includes('your-') ||
    privateKey.includes('your-') ||
    clientEmail.includes('your-') ||
    clientEmail.includes('example.com')
  ) {
    return false
  }

  return true
}

function getFirebaseAdminApp() {
  if (!hasFirebaseAdminConfig()) {
    return null
  }

  if (getApps().length > 0) {
    return getApps()[0]
  }

  const projectId = process.env.FIREBASE_PROJECT_ID
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL

  return initializeApp({
    credential: cert({
      projectId,
      privateKey,
      clientEmail,
    }),
  })
}

async function createUserWithFirebaseAdmin(userData) {
  const adminApp = getFirebaseAdminApp()

  if (!adminApp) {
    return null
  }

  try {
    const record = await getAuth(adminApp).createUser({
      email: userData.email,
      password: userData.password,
      displayName: userData.name,
    })

    return {
      uid: record.uid,
      email: record.email || userData.email,
      name: userData.name,
      role: userData.role || 'employer',
      company: userData.company,
    }
  } catch (error) {
    if (error?.code === 'auth/email-already-exists') {
      throw new Error('EMAIL_EXISTS')
    }

    throw new Error(error?.message || error?.code || 'Firebase admin signup failed')
  }
}

export function isFirebaseAuthConfigured() {
  return Boolean(getFirebaseApiKey())
}

export function classifyFirebaseAuthError(errorMessage = '') {
  const value = errorMessage.toString().toUpperCase()

  if (
    value.includes('EMAIL_EXISTS') ||
    value.includes('EMAIL_ALREADY_IN_USE') ||
    value.includes('AUTH/EMAIL-ALREADY-EXISTS')
  ) {
    return 'USER_EXISTS'
  }

  if (value.includes('WEAK_PASSWORD')) {
    return 'WEAK_PASSWORD'
  }

  if (value.includes('TOO_MANY_ATTEMPTS_TRY_LATER')) {
    return 'RATE_LIMITED'
  }

  if (
    value.includes('FIREBASE NOT CONFIGURED') ||
    value.includes('API KEY NOT VALID') ||
    value.includes('PLEASE PASS A VALID API KEY') ||
    value.includes('API_KEY_HTTP_REFERRER_BLOCKED') ||
    value.includes('API_KEY_INVALID') ||
    value.includes('CONFIGURATION_NOT_FOUND') ||
    value.includes('OPERATION_NOT_ALLOWED') ||
    value.includes('ADMIN_ONLY_OPERATION')
  ) {
    return 'PROVIDER_MISCONFIGURED'
  }

  return 'SERVICE_UNAVAILABLE'
}

export function generateToken(user) {
  return jwt.sign(
    {
      userId: user.uid || user.id,
      email: user.email,
      role: user.role,
      company: user.company,
      name: user.name || user.displayName || user.email?.split('@')[0] || 'User',
    },
    getJwtSecret(),
    { expiresIn: '7d' }
  )
}

export function verifyToken(token) {
  return jwt.verify(token, getJwtSecret())
}

async function signInWithFirebase(email, password) {
  const firebaseApiKey = getFirebaseApiKey()

  if (!firebaseApiKey) {
    return null
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${firebaseApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      if (data.error?.message === 'INVALID_PASSWORD' || data.error?.message === 'EMAIL_NOT_FOUND') {
        return null
      }

      return null
    }

    return {
      uid: data.localId,
      email: data.email,
      displayName: data.displayName || data.email?.split('@')[0] || 'User',
    }
  } catch {
    return null
  }
}

export async function authenticateUser(email, password) {
  const firebaseUser = await signInWithFirebase(email, password)

  if (!firebaseUser) {
    return null
  }

  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    name: firebaseUser.displayName,
    role: 'employer',
    company: '',
  }
}

export function getUserById() {
  return null
}

export async function createUser(userData) {
  const firebaseApiKey = getFirebaseApiKey()

  if (!firebaseApiKey) {
    const adminUser = await createUserWithFirebaseAdmin(userData)
    if (adminUser) {
      return adminUser
    }

    throw new Error('Firebase not configured')
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${firebaseApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Referer: 'https://tcn-comply-malta.vercel.app/',
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          displayName: userData.name,
          returnSecureToken: true,
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || 'Firebase signup failed')
    }

    return {
      uid: data.localId,
      email: data.email,
      name: userData.name,
      role: userData.role || 'employer',
      company: userData.company,
    }
  } catch (error) {
    const classification = classifyFirebaseAuthError(error?.message)
    if (classification === 'USER_EXISTS') {
      throw new Error('User already exists')
    }

    try {
      const adminUser = await createUserWithFirebaseAdmin(userData)
      if (adminUser) {
        return adminUser
      }
    } catch (adminError) {
      if (classifyFirebaseAuthError(adminError?.message) === 'USER_EXISTS') {
        throw new Error('User already exists')
      }
    }

    throw new Error(error?.message || 'Registration service unavailable')
  }
}
