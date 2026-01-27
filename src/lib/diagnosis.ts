export type Diagnosis = 'trafico' | 'pagina_oferta' | 'checkout_confianza' | 'escalar'

export type CheckoutInsight = 'logistica' | 'pago' | 'ambos' | null

export interface DiagnosisResult {
  dx: Diagnosis
  atc: number  // ATC (Agregar al Carrito)
  cb: number   // Cart→Buy (Carrito a Compra)
  cr: number   // CR (Conversión Total)
  aov?: number | null  // AOV (Ticket Promedio)
  roas?: number | null // ROAS (Retorno de Ads)
  cac?: number | null  // CAC (Costo por Cliente)
  // Con checkouts: dónde se rompe el proceso (envío vs pago)
  checkouts?: number | null
  cartToCheckout?: number | null  // Checkouts/Carritos, < 70% → logística
  checkoutToBuy?: number | null   // Compras/Checkouts, < 40% → pasarela/cuotas
  checkoutInsight?: CheckoutInsight
  /** true cuando checkouts > carritos: Compra Rápida, tasas calculadas sobre checkouts */
  quickBuyMode?: boolean
}

export function diagnose(
  visits: number,
  carts: number,
  purchases: number,
  sales?: number,
  adspend?: number,
  ordersCount?: number,
  checkouts?: number
): DiagnosisResult {
  // Validaciones que deben bloquear cálculo
  if (carts > visits) {
    throw new Error('Error: carritos no pueden ser más que visitas')
  }
  const quickBuyMode = !!(checkouts != null && checkouts > 0 && checkouts > carts)
  if (quickBuyMode) {
    if (purchases > checkouts!) {
      throw new Error('Error: compras no pueden ser más que checkouts')
    }
  } else {
    if (purchases > carts) {
      throw new Error('Error: pedidos no pueden ser más que carritos')
    }
    if (checkouts != null && checkouts > 0 && purchases > checkouts) {
      throw new Error('Error: compras no pueden ser más que checkouts')
    }
  }
  // Si checkouts > carritos: modo "Compra Rápida", tasas sobre la métrica más alta (checkouts)

  // KPIs: base = métrica más alta cuando hay checkouts (Compra Rápida)
  const effectiveCarts = (checkouts != null && checkouts > 0 && checkouts > carts)
    ? checkouts
    : carts
  const atc = visits ? effectiveCarts / visits : 0
  const cb = effectiveCarts ? purchases / effectiveCarts : 0
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

  // Clasificación según la cascada (sin cambios)
  const dx = classify({ visits, atc, cb })

  // Con checkouts: Cart→Checkout y Checkout→Buy para mensaje "envío vs pago"
  let cartToCheckout: number | null = null
  let checkoutToBuy: number | null = null
  let checkoutInsight: CheckoutInsight = null

  if (checkouts != null && checkouts > 0) {
    checkoutToBuy = purchases / checkouts
    if (quickBuyMode) {
      // Compra Rápida: no hay paso carrito→checkout; solo importa checkout→compra
      cartToCheckout = null
      if (checkoutToBuy < 0.40) checkoutInsight = 'pago'
    } else if (carts > 0) {
      cartToCheckout = checkouts / carts
      const logistica = cartToCheckout < 0.70
      const pago = checkoutToBuy < 0.40
      if (logistica && pago) checkoutInsight = 'ambos'
      else if (logistica) checkoutInsight = 'logistica'
      else if (pago) checkoutInsight = 'pago'
    }
  }

  return {
    dx,
    atc,
    cb,
    cr,
    aov,
    roas,
    cac,
    ...(checkouts != null && checkouts > 0
      ? { checkouts, cartToCheckout, checkoutToBuy, checkoutInsight, ...(quickBuyMode ? { quickBuyMode: true } : {}) }
      : {})
  }
}

// Función de clasificación según la especificación
function classify({ visits, atc, cb }: { visits: number, atc: number, cb: number }): Diagnosis {
  if (visits < 500 && atc >= 0.03 && cb >= 0.30) return "trafico"
  if (atc < 0.03) return "pagina_oferta"
  if (cb < 0.30) return "checkout_confianza"
  return "escalar"
}

export function getDiagnosisLabel(dx: Diagnosis): string {
  const labels = {
    trafico: 'Tráfico',
    pagina_oferta: 'Página / Oferta',
    checkout_confianza: 'Checkout / Confianza',
    escalar: 'Listo para Escalar'
  }
  
  return labels[dx]
}

export function getDiagnosisDescription(dx: Diagnosis): string {
  const descriptions = {
    trafico: 'Tu tienda necesita más visitantes. El problema principal es la falta de tráfico cualificado.',
    pagina_oferta: 'Tienes visitantes pero no se convierten en carritos. Revisa tu oferta y experiencia web.',
    checkout_confianza: 'Los visitantes agregan al carrito pero no completan la compra. Optimiza tu proceso de checkout.',
    escalar: '¡Excelente! Tu tienda tiene métricas saludables. Sigue optimizando para crecer más.'
  }
  
  return descriptions[dx]
}
