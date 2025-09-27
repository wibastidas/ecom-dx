import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query,
  orderBy,
  getDocs,
  serverTimestamp,
  DocumentData 
} from 'firebase/firestore'
import { db } from './firebase'
import { User } from 'firebase/auth'

export interface SaveData {
  uid: string
  yyyymm: string
  monthLabel: string
  dx: string
  visits: number
  carts: number
  orders: number
  atc: number
  cb: number
  cr: number
  sales?: number | null
  adspend?: number | null
  ordersCount?: number | null
  aov?: number | null
  roas?: number | null
  cac?: number | null
  note?: string
  created_at?: any
  updated_at?: any
}

export interface HistoryItem extends SaveData {
  id: string
}

/**
 * Verifica si existe un diagnóstico para un usuario y mes específico
 */
export async function checkDiagnosisExists(uid: string, yyyymm: string): Promise<boolean> {
  if (!db) {
    console.warn('Firebase no configurado - modo desarrollo')
    return false
  }

  try {
    const docRef = doc(db, 'users', uid, 'metrics', yyyymm)
    const docSnap = await getDoc(docRef)
    return docSnap.exists()
  } catch (error) {
    console.error('Error verificando existencia:', error)
    return false
  }
}

/**
 * Guarda un diagnóstico en Firebase
 */
export async function saveDiagnosis(user: User, data: Omit<SaveData, 'uid' | 'created_at' | 'updated_at'>): Promise<void> {
  if (!db) {
    console.warn('Firebase no configurado - modo desarrollo')
    console.log('Datos que se guardarían:', data)
    return
  }

  try {
    const docId = `${user.uid}_${data.yyyymm}`
    const docRef = doc(db, 'users', user.uid, 'metrics', data.yyyymm)
    
    const saveData: SaveData = {
      ...data,
      uid: user.uid,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    }

    await setDoc(docRef, saveData)
    console.log('Diagnóstico guardado exitosamente:', docId)
  } catch (error) {
    console.error('Error guardando diagnóstico:', error)
    throw error
  }
}

/**
 * Actualiza un diagnóstico existente
 */
export async function updateDiagnosis(user: User, data: Omit<SaveData, 'uid' | 'created_at' | 'updated_at'>): Promise<void> {
  if (!db) {
    console.warn('Firebase no configurado - modo desarrollo')
    console.log('Datos que se actualizarían:', data)
    return
  }

  try {
    const docRef = doc(db, 'users', user.uid, 'metrics', data.yyyymm)
    
    const updateData: Partial<SaveData> = {
      ...data,
      uid: user.uid,
      updated_at: serverTimestamp()
    }

    await setDoc(docRef, updateData, { merge: true })
    console.log('Diagnóstico actualizado exitosamente:', data.yyyymm)
  } catch (error) {
    console.error('Error actualizando diagnóstico:', error)
    throw error
  }
}

/**
 * Obtiene un diagnóstico específico
 */
export async function getDiagnosis(user: User, yyyymm: string): Promise<SaveData | null> {
  if (!db) {
    console.warn('Firebase no configurado - modo desarrollo')
    return null
  }

  try {
    const docRef = doc(db, 'users', user.uid, 'metrics', yyyymm)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return docSnap.data() as SaveData
    }
    
    return null
  } catch (error) {
    console.error('Error obteniendo diagnóstico:', error)
    return null
  }
}

/**
 * Obtiene el historial de diagnósticos de un usuario
 */
export async function getDiagnosisHistory(user: User): Promise<HistoryItem[]> {
  if (!db) {
    console.warn('Firebase no configurado - modo desarrollo')
    return []
  }

  try {
    const metricsRef = collection(db, 'users', user.uid, 'metrics')
    const q = query(metricsRef, orderBy('yyyymm', 'desc'))
    const querySnapshot = await getDocs(q)
    
    const history: HistoryItem[] = []
    querySnapshot.forEach((doc) => {
      history.push({
        id: doc.id,
        ...doc.data()
      } as HistoryItem)
    })
    
    return history
  } catch (error) {
    console.error('Error obteniendo historial:', error)
    return []
  }
}

/**
 * Elimina un diagnóstico del historial
 */
export async function deleteDiagnosis(user: User, yyyymm: string): Promise<void> {
  if (!db) {
    console.warn('Firebase no configurado - modo desarrollo')
    return
  }

  try {
    const docRef = doc(db, 'users', user.uid, 'metrics', yyyymm)
    await setDoc(docRef, { deleted: true }, { merge: true })
    console.log('Diagnóstico marcado como eliminado:', yyyymm)
  } catch (error) {
    console.error('Error eliminando diagnóstico:', error)
    throw error
  }
}
