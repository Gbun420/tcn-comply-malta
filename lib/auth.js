import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'tcn-comply-malta-dev-secret-2024'

const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'tcn-comply-malta'

const DEMO_USER = {
  uid: 'demo-1',
  email: 'bundyglenn@gmail.com',
  password: 'admin123',
  displayName: 'Glenn Bundy',
  role: 'admin',
  company: 'TCN Comply Malta',
}

export function generateToken(user) {
  return jwt.sign({ 
    userId: user.uid || user.id, 
    email: user.email, 
    role: user.role, 
    company: user.company 
  }, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

async function signUpWithFirebase(email, password, name) {
  if (!FIREBASE_API_KEY) {
    throw new Error('Firebase API key not configured')
  }

  const response = await fetch(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${FIREBASE_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
      displayName: name,
      returnSecureToken: true,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    if (data.error?.message === 'EMAIL_EXISTS') {
      throw new Error('User already exists')
    }
    throw new Error(data.error?.message || 'Firebase signup failed')
  }

  return {
    uid: data.localId,
    email: data.email,
  }
}

async function signInWithFirebase(email, password) {
  if (!FIREBASE_API_KEY) {
    return null
  }

  const response = await fetch(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${FIREBASE_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
      returnSecureToken: true,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    if (data.error?.message === 'INVALID_PASSWORD' || data.error?.message === 'EMAIL_NOT_FOUND') {
      return null
    }
    console.error('Firebase signin error:', data.error?.message)
    return null
  }

  return {
    uid: data.localId,
    email: data.email,
  }
}

export async function createUser(userData) {
  try {
    const firebaseUser = await signUpWithFirebase(userData.email, userData.password, userData.name)
    
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      name: userData.name,
      role: userData.role || 'employer',
      company: userData.company,
    }
  } catch (error) {
    if (error.message === 'User already exists') {
      throw error
    }
    console.error('Create user error:', error)
    throw error
  }
}

export async function authenticateUser(email, password) {
  const firebaseUser = await signInWithFirebase(email, password)
  
  if (firebaseUser) {
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      role: 'employer',
      company: '',
    }
  }
  
  return null
}

export function getUserById(id) {
  return null
}
