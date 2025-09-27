import { DateTime } from 'luxon'

// Configurar timezone de Uruguay
const TIMEZONE = 'America/Montevideo'

export interface MonthOption {
  value: string // "2025-09"
  label: string // "Sep 2025"
  yyyymm: string // "202509"
}

/**
 * Obtiene el mes actual en timezone de Uruguay
 */
export function getCurrentMonth(): MonthOption {
  const nowUy = DateTime.now().setZone(TIMEZONE)
  return {
    value: nowUy.toFormat('yyyy-LL'),
    label: nowUy.toFormat('LLL yyyy'),
    yyyymm: nowUy.toFormat('yyyyLL')
  }
}

/**
 * Convierte un valor "2025-09" a MonthOption
 */
export function parseMonthValue(value: string): MonthOption {
  const date = DateTime.fromFormat(value, 'yyyy-LL').setZone(TIMEZONE)
  return {
    value,
    label: date.toFormat('LLL yyyy'),
    yyyymm: date.toFormat('yyyyLL')
  }
}

/**
 * Genera opciones de meses (últimos 12 meses + próximos 3)
 */
export function getMonthOptions(): MonthOption[] {
  const nowUy = DateTime.now().setZone(TIMEZONE)
  const options: MonthOption[] = []
  
  // Últimos 12 meses
  for (let i = 11; i >= 0; i--) {
    const month = nowUy.minus({ months: i })
    options.push({
      value: month.toFormat('yyyy-LL'),
      label: month.toFormat('LLL yyyy'),
      yyyymm: month.toFormat('yyyyLL')
    })
  }
  
  // Próximos 3 meses
  for (let i = 1; i <= 3; i++) {
    const month = nowUy.plus({ months: i })
    options.push({
      value: month.toFormat('yyyy-LL'),
      label: month.toFormat('LLL yyyy'),
      yyyymm: month.toFormat('yyyyLL')
    })
  }
  
  return options
}

/**
 * Valida que un yyyymm sea válido
 */
export function isValidYyyymm(yyyymm: string): boolean {
  return /^\d{6}$/.test(yyyymm) && DateTime.fromFormat(yyyymm, 'yyyyLL').isValid
}
