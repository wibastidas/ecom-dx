/**
 * Formatea números de moneda con formato consistente:
 * - Punto para separar miles
 * - Coma para decimales
 * - Un solo decimal
 * 
 * Ejemplos:
 * - 1234.56 → "1.234,6"
 * - 1000 → "1.000,0"
 * - 1234567.89 → "1.234.567,9"
 * - 50.5 → "50,5"
 */
export function formatCurrency(value: number): string {
  // Si el número es menor a 1000, no necesita separador de miles
  if (value < 1000) {
    return value.toLocaleString('es-ES', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
      useGrouping: false
    })
  }
  
  return value.toLocaleString('es-ES', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
    useGrouping: true
  })
}

/**
 * Formatea números enteros con separadores de miles
 * 
 * Ejemplos:
 * - 1234 → "1.234"
 * - 1000000 → "1.000.000"
 */
export function formatNumber(value: number): string {
  return value.toLocaleString('es-ES', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    useGrouping: true
  })
}
