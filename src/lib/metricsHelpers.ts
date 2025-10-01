// Rangos normales basados en la tabla de parámetros
export const NORMAL_RANGES = {
  ATC: { min: 4.0, max: 6.0 },    // Entre 4% y 6%
  CB: { min: 15.0, max: 25.0 },   // Entre 15% y 25%
  CR: { min: 1.0, max: 1.0 }      // 1%
} as const

export type MetricStatus = 'above' | 'equal' | 'below'

export interface MetricComparison {
  status: MetricStatus
  percentage: number
  normalRange: string
  statusMessage: string
  colorClass: string
  bgColorClass: string
}

/**
 * Compara una métrica con su rango normal y retorna información sobre su estado
 */
export function compareMetric(value: number, min: number, max: number, normalRange: string): MetricComparison {
  if (value >= min && value <= max) {
    return {
      status: 'equal',
      percentage: 0,
      normalRange: normalRange,
      statusMessage: 'En el rango normal',
      colorClass: 'text-blue-600',
      bgColorClass: 'bg-blue-50'
    }
  } else if (value > max) {
    return {
      status: 'above',
      percentage: Math.round(((value - max) / max) * 100),
      normalRange: normalRange,
      statusMessage: 'Por Encima → Excelente',
      colorClass: 'text-green-600',
      bgColorClass: 'bg-green-50'
    }
  } else {
    return {
      status: 'below',
      percentage: Math.round(((min - value) / min) * 100),
      normalRange: normalRange,
      statusMessage: 'Por Debajo → Hay que mejorar',
      colorClass: 'text-red-600',
      bgColorClass: 'bg-red-50'
    }
  }
}

/**
 * Obtiene la comparación para ATC
 */
export function getATCComparison(atc: number): MetricComparison {
  return compareMetric(atc, NORMAL_RANGES.ATC.min, NORMAL_RANGES.ATC.max, 'Normal entre un 4% y un 6%')
}

/**
 * Obtiene la comparación para Cart→Buy
 */
export function getCBComparison(cb: number): MetricComparison {
  return compareMetric(cb, NORMAL_RANGES.CB.min, NORMAL_RANGES.CB.max, 'Normal entre un 15% y un 25%')
}

/**
 * Obtiene la comparación para CR
 */
export function getCRComparison(cr: number): MetricComparison {
  return compareMetric(cr, NORMAL_RANGES.CR.min, NORMAL_RANGES.CR.max, 'Normal 1%')
}
