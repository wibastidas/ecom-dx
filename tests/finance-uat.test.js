/**
 * Test UAT para casos financieros
 * Verifica que los cálculos y niveles financieros funcionen correctamente
 */

function calculateFinance(sales, adspend, ordersCount) {
  if (!sales || !adspend || !ordersCount) {
    return null // Sin finanzas
  }
  
  const aov = sales / ordersCount
  const roas = sales / adspend
  const cac = adspend / ordersCount
  
  return { aov, roas, cac }
}

function financeLevel(roas) {
  if (!Number.isFinite(roas)) return null
  if (roas < 1) return "critical"
  if (roas <= 2) return "fragile"   // 2.00 es frágil
  return "strong"                   // solo > 2 es sólido
}

function hasFinanceData(sales, adspend, ordersCount) {
  return !!(sales && adspend && ordersCount)
}

console.log('🧪 TEST UAT - CASOS FINANCIEROS\n')

const testCases = [
  {
    name: 'F1 — Crítico',
    input: { sales: 1500, adspend: 2000, ordersCount: 15 },
    expected: { aov: 100.00, roas: 0.75, cac: 133.33, level: 'critical', hasSmallSample: false }
  },
  {
    name: 'F2 — Frágil (ROAS = 2.00)',
    input: { sales: 10000, adspend: 5000, ordersCount: 10 },
    expected: { aov: 1000.00, roas: 2.00, cac: 500.00, level: 'fragile', hasSmallSample: false }
  },
  {
    name: 'F3 — Sólido',
    input: { sales: 1200, adspend: 300, ordersCount: 15 },
    expected: { aov: 80.00, roas: 4.00, cac: 20.00, level: 'strong', hasSmallSample: false }
  },
  {
    name: 'F4 — Muestra chica',
    input: { sales: 600, adspend: 300, ordersCount: 8 },
    expected: { aov: 75.00, roas: 2.00, cac: 37.50, level: 'fragile', hasSmallSample: true }
  },
  {
    name: 'F5 — Sin finanzas (falta sales)',
    input: { sales: null, adspend: 1000, ordersCount: 10 },
    expected: { aov: null, roas: null, cac: null, level: null, hasSmallSample: false }
  },
  {
    name: 'F5 — Sin finanzas (falta adspend)',
    input: { sales: 1000, adspend: null, ordersCount: 10 },
    expected: { aov: null, roas: null, cac: null, level: null, hasSmallSample: false }
  },
  {
    name: 'F5 — Sin finanzas (falta ordersCount)',
    input: { sales: 1000, adspend: 500, ordersCount: null },
    expected: { aov: null, roas: null, cac: null, level: null, hasSmallSample: false }
  }
]

let passed = 0
let total = testCases.length

testCases.forEach(test => {
  console.log(`\n📊 ${test.name}`)
  console.log(`Input: sales=${test.input.sales}, adspend=${test.input.adspend}, ordersCount=${test.input.ordersCount}`)
  
  const finance = calculateFinance(test.input.sales, test.input.adspend, test.input.ordersCount)
  
  if (finance === null) {
    // Sin finanzas
    const testPassed = test.expected.aov === null && test.expected.roas === null && test.expected.cac === null
    console.log(`Resultado: Sin finanzas (no se calculan AOV/ROAS/CAC)`)
    console.log(`  ${testPassed ? '✅ PASÓ' : '❌ FALLÓ'}`)
    if (testPassed) passed++
    return
  }
  
  const { aov, roas, cac } = finance
  const level = financeLevel(roas)
  const hasSmallSample = test.input.ordersCount < 10
  const cacRatio = Math.round((cac / aov) * 100)
  
  const aovMatch = Math.abs(aov - test.expected.aov) < 0.01
  const roasMatch = Math.abs(roas - test.expected.roas) < 0.01
  const cacMatch = Math.abs(cac - test.expected.cac) < 0.01
  const levelMatch = level === test.expected.level
  const smallSampleMatch = hasSmallSample === test.expected.hasSmallSample
  
  const testPassed = aovMatch && roasMatch && cacMatch && levelMatch && smallSampleMatch
  
  console.log(`Resultado:`)
  console.log(`  AOV: $${aov.toFixed(2)} (esperado: $${test.expected.aov}) ${aovMatch ? '✅' : '❌'}`)
  console.log(`  ROAS: ${roas.toFixed(2)} (esperado: ${test.expected.roas}) ${roasMatch ? '✅' : '❌'}`)
  console.log(`  CAC: $${cac.toFixed(2)} (esperado: $${test.expected.cac}) ${cacMatch ? '✅' : '❌'}`)
  console.log(`  Nivel: ${level} (esperado: ${test.expected.level}) ${levelMatch ? '✅' : '❌'}`)
  console.log(`  CAC ratio: ${cacRatio}% del ticket`)
  console.log(`  Muestra chica: ${hasSmallSample} (esperado: ${test.expected.hasSmallSample}) ${smallSampleMatch ? '✅' : '❌'}`)
  
  console.log(`  ${testPassed ? '✅ PASÓ' : '❌ FALLÓ'}`)
  
  if (testPassed) passed++
})

console.log(`\n📊 RESUMEN: ${passed}/${total} casos pasaron`)

// Test específico para ROAS = 2.00
console.log('\n🔍 TEST ESPECÍFICO: ROAS = 2.00 debe ser "fragile"')
const roas200 = financeLevel(2.00)
console.log(`ROAS 2.00 → Nivel: ${roas200} (esperado: fragile) ${roas200 === 'fragile' ? '✅' : '❌'}`)

module.exports = { calculateFinance, financeLevel, hasFinanceData }
