export interface FinancialMetrics {
  sales_total?: number | null
  ad_spend?: number | null
  orders?: number | null
  roas?: number | null
  aov?: number | null
  cac?: number | null
}

export interface FinancialAlert {
  type: 'warning' | 'success' | 'danger'
  message: string
}

export function calculateFinancialMetrics(data: {
  sales_total?: number | null
  ad_spend?: number | null
  orders?: number | null
}): FinancialMetrics & { alerts: FinancialAlert[] } {
  const { sales_total, ad_spend, orders } = data
  const alerts: FinancialAlert[] = []
  
  let roas: number | null = null
  let aov: number | null = null
  let cac: number | null = null
  
  // Calcular ROAS (Return on Ad Spend)
  if (ad_spend && ad_spend > 0 && sales_total) {
    roas = sales_total / ad_spend
    if (roas < 2) {
      alerts.push({
        type: 'danger',
        message: 'ROAS < 2: Riesgo de ineficiencia en ads'
      })
    } else if (roas < 3) {
      alerts.push({
        type: 'warning',
        message: 'ROAS 2-3: Considera optimizar creativos o targeting'
      })
    } else {
      alerts.push({
        type: 'success',
        message: 'ROAS ≥ 3: Excelente eficiencia en ads'
      })
    }
  } else if (sales_total && (!ad_spend || ad_spend === 0)) {
    alerts.push({
      type: 'warning',
      message: 'Si no invertís en ads, ROAS no aplica; foco en tráfico orgánico/colabs'
    })
  }
  
  // Calcular AOV (Average Order Value)
  if (orders && orders > 0 && sales_total) {
    aov = sales_total / orders
    if (aov < 10) {
      alerts.push({
        type: 'warning',
        message: 'AOV < $10: Posible fricción de envío/costos fijos'
      })
    } else {
      alerts.push({
        type: 'success',
        message: `AOV $${aov.toFixed(2)}: Buen valor promedio por pedido`
      })
    }
  }
  
  // Calcular CAC (Customer Acquisition Cost)
  if (orders && orders > 0 && ad_spend) {
    cac = ad_spend / orders
    if (aov && cac > aov * 0.3) {
      alerts.push({
        type: 'danger',
        message: 'CAC > 30% del AOV: Revisá creativos, targeting o oferta'
      })
    } else if (aov && cac <= aov * 0.3) {
      alerts.push({
        type: 'success',
        message: 'CAC ≤ 30% del AOV: Buena rentabilidad'
      })
    }
  }
  
  return {
    sales_total,
    ad_spend,
    orders,
    roas,
    aov,
    cac,
    alerts
  }
}

export function getROASColor(roas: number | null): string {
  if (roas === null) return 'text-gray-500'
  if (roas >= 3) return 'text-green-600'
  if (roas >= 2) return 'text-yellow-600'
  return 'text-red-600'
}

export function getROASBadgeColor(roas: number | null): string {
  if (roas === null) return 'bg-gray-100 text-gray-600'
  if (roas >= 3) return 'bg-green-100 text-green-800'
  if (roas >= 2) return 'bg-yellow-100 text-yellow-800'
  return 'bg-red-100 text-red-800'
}
