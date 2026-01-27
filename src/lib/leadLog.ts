import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'
import type { Diagnosis, CheckoutInsight } from './diagnosis'

export interface LeadAnalizadoPayload {
  storeUrl: string
  platform: string
  visits: number
  carts: number
  checkouts?: number | null
  orders: number
  sales?: number | null
  adspend?: number | null
  ordersCount?: number | null
  dx: Diagnosis
  atc: number
  cb: number
  cr: number
  aov?: number | null
  roas?: number | null
  cac?: number | null
  cartToCheckout?: number | null
  checkoutToBuy?: number | null
  checkoutInsight?: CheckoutInsight
  quickBuyMode?: boolean
}

/**
 * Log de uso sin login: escribe un doc en leads_analizados con URL, plataforma,
 * datos ingresados y resultado del diagnóstico. Fire-and-forget, no bloquea la UI.
 */
export async function logLeadAnalizado(payload: LeadAnalizadoPayload): Promise<void> {
  if (!db) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[leadLog] Firebase no configurado — payload que se guardaría:', payload)
    }
    return
  }

  try {
    const docData = {
      ...payload,
      created_at: serverTimestamp()
    }
    await addDoc(collection(db, 'leads_analizados'), docData)
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[leadLog] Error guardando en leads_analizados:', error)
    }
    // No re-lanzar: es log de uso, no debe afectar la experiencia
  }
}
