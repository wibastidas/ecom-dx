import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Configuración temporal para desarrollo sin Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
}

// Inicializar Firebase siempre
let app: any = null
let auth: any = null
let db: any = null
let googleProvider: any = null

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig)
  
  // Initialize Firebase Authentication and get a reference to the service
  auth = getAuth(app)
  
  // Initialize Cloud Firestore and get a reference to the service
  db = getFirestore(app)
  
  // Google Auth Provider
  googleProvider = new GoogleAuthProvider()
  
  console.log("🔥 Firebase inicializado correctamente")
} catch (error) {
  console.error("❌ Error inicializando Firebase:", error)
}

export { auth, db, googleProvider }
export default app
