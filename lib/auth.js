import jwt from 'jsonwebtoken'

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
    throw new Error('Firebase not configured')
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${firebaseApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      if (data.error?.message === 'EMAIL_EXISTS' || data.error?.message === 'EMAIL_ALREADY_IN_USE') {
        throw new Error('User already exists')
      }

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
    if (error.message === 'User already exists' || error.message === 'Firebase not configured') {
      throw error
    }

    throw new Error('Registration service unavailable')
  }
}
