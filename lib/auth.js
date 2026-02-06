import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'tcn-comply-malta-secure-key-' + Date.now()

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

async function signInWithFirebase(email, password) {
  const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY
  
  if (!FIREBASE_API_KEY || FIREBASE_API_KEY.includes('YOUR_') || FIREBASE_API_KEY.length < 20) {
    console.log('Firebase API key not configured or invalid, using demo mode')
    return null
  }

  try {
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
      console.log('Firebase signin error:', data.error?.message)
      return null
    }

    return {
      uid: data.localId,
      email: data.email,
    }
  } catch (error) {
    console.log('Firebase connection error:', error.message)
    return null
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

export async function createUser(userData) {
  const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY
  
  if (!FIREBASE_API_KEY || FIREBASE_API_KEY.includes('YOUR_') || FIREBASE_API_KEY.length < 20) {
    throw new Error('Firebase not configured')
  }

  try {
    const response = await fetch(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${FIREBASE_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
        displayName: userData.name,
        returnSecureToken: true,
      }),
    })

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
    if (error.message === 'User already exists') {
      throw error
    }
    console.error('Create user error:', error)
    throw error
  }
}
