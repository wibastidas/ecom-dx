import { 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  User,
  onAuthStateChanged 
} from 'firebase/auth'
import { auth, googleProvider } from './firebase'

export const signInWithGoogle = async (): Promise<User> => {
  if (!auth || !googleProvider) {
    throw new Error('Firebase no está configurado. Por favor, configura las variables de entorno.')
  }
  
  try {
    const result = await signInWithPopup(auth, googleProvider)
    return result.user
  } catch (error) {
    console.error('Error signing in with Google:', error)
    throw error
  }
}

export const signOut = async (): Promise<void> => {
  if (!auth) {
    throw new Error('Firebase no está configurado. Por favor, configura las variables de entorno.')
  }
  
  try {
    await firebaseSignOut(auth)
  } catch (error) {
    console.error('Error signing out:', error)
    throw error
  }
}

export const onAuthChange = (callback: (user: User | null) => void) => {
  if (!auth) {
    // En modo desarrollo sin Firebase, no hay usuario autenticado
    callback(null)
    return () => {} // Retorna función de limpieza vacía
  }
  
  return onAuthStateChanged(auth, callback)
}

export { auth }
