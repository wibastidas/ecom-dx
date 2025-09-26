export type Diagnosis = 'trafico' | 'oferta_web' | 'checkout' | 'escalar'

export interface DiagnosisResult {
  dx: Diagnosis
  atc: number  // ATC (Agregar al Carrito)
  cb: number   // Cart→Buy (Carrito a Compra)
  cr: number   // CR (Conversión Total)
  aov?: number | null  // AOV (Ticket Promedio)
  roas?: number | null // ROAS (Retorno de Ads)
  cac?: number | null  // CAC (Costo por Cliente)
}

export function diagnose(
  visits: number, 
  carts: number, 
  purchases: number, 
  sales?: number, 
  adspend?: number, 
  ordersCount?: number
): DiagnosisResult {
  // KPIs básicos (siempre se calculan)
  const atc = visits ? carts / visits : 0
  const cb = carts ? purchases / carts : 0
  const cr = visits ? purchases / visits : 0
  
  // Finanzas solo si existen los tres campos
  let aov: number | null = null
  let roas: number | null = null
  let cac: number | null = null
  
  if (sales && adspend && ordersCount) {
    aov = ordersCount > 0 ? sales / ordersCount : null
    roas = adspend > 0 ? sales / adspend : null
    cac = ordersCount > 0 ? adspend / ordersCount : null
  }
  
  // Clasificación según la nueva lógica
  const dx = classify({ visits, atc, cb })
  
  return { dx, atc, cb, cr, aov, roas, cac }
}

// Función de clasificación según la especificación
function classify({ visits, atc, cb }: { visits: number, atc: number, cb: number }): Diagnosis {
  if (visits < 500 && atc >= 0.03 && cb >= 0.30) return "trafico"
  if (atc < 0.03) return "oferta_web"
  if (cb < 0.30) return "checkout"
  return "escalar"
}

export function getDiagnosisLabel(dx: Diagnosis): string {
  const labels = {
    trafico: 'Tráfico',
    oferta_web: 'Página / Oferta',
    checkout: 'Checkout / Confianza',
    escalar: 'Listo para Escalar'
  }
  
  return labels[dx]
}

export function getDiagnosisDescription(dx: Diagnosis): string {
  const descriptions = {
    trafico: 'Tu tienda necesita más visitantes. El problema principal es la falta de tráfico cualificado.',
    oferta_web: 'Tienes visitantes pero no se convierten en carritos. Revisa tu oferta y experiencia web.',
    checkout: 'Los visitantes agregan al carrito pero no completan la compra. Optimiza tu proceso de checkout.',
    escalar: '¡Excelente! Tu tienda tiene métricas saludables. Sigue optimizando para crecer más.'
  }
  
  return descriptions[dx]
}
