export type Diagnosis = 'trafico' | 'oferta_web' | 'checkout' | 'ok_sample_low' | 'saludable'

export interface DiagnosisResult {
  dx: Diagnosis
  cv: number
  cc: number
  tc: number
}

export function diagnose(visits: number, carts: number, purchases: number): DiagnosisResult {
  const cv = visits ? carts / visits : 0
  const cc = carts ? purchases / carts : 0
  const tc = visits ? purchases / visits : 0
  
  let dx: Diagnosis
  
  if (visits < 1000 && tc < 0.01) {
    dx = 'trafico'
  } else if (cv < 0.04) {
    dx = 'oferta_web'
  } else if (cc < 0.15) {
    dx = 'checkout'
  } else if (tc < 0.01) {
    dx = 'ok_sample_low'
  } else {
    dx = 'saludable'
  }
  
  return { dx, cv, cc, tc }
}

export function getDiagnosisLabel(dx: Diagnosis): string {
  const labels = {
    trafico: 'Problema de Tráfico',
    oferta_web: 'Problema de Oferta & Web',
    checkout: 'Problema de Checkout',
    ok_sample_low: 'Muestra Insuficiente',
    saludable: 'Tienda Saludable'
  }
  
  return labels[dx]
}

export function getDiagnosisDescription(dx: Diagnosis): string {
  const descriptions = {
    trafico: 'Tu tienda necesita más visitantes. El problema principal es la falta de tráfico cualificado.',
    oferta_web: 'Tienes visitantes pero no se convierten en carritos. Revisa tu oferta y experiencia web.',
    checkout: 'Los visitantes agregan al carrito pero no completan la compra. Optimiza tu proceso de checkout.',
    ok_sample_low: 'Tus métricas parecen buenas pero la muestra es muy pequeña. Necesitas más datos para un diagnóstico preciso.',
    saludable: '¡Excelente! Tu tienda tiene métricas saludables. Sigue optimizando para crecer más.'
  }
  
  return descriptions[dx]
}
