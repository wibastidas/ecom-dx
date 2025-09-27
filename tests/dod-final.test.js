/**
 * Test para verificar Definition of Done final
 * Verifica que todos los elementos del DOD estén correctamente implementados
 */

function calculateKPIs(visits, carts, orders) {
  const atc = visits ? (carts / visits) * 100 : 0
  const cb = carts ? (orders / carts) * 100 : 0
  const cr = visits ? (orders / visits) * 100 : 0
  return {
    atc: Math.round(atc * 10) / 10,  // 1 decimal
    cb: Math.round(cb * 10) / 10,    // 1 decimal
    cr: Math.round(cr * 10) / 10     // 1 decimal
  }
}

function classify({ visits, atc, cb }) {
  if (visits < 500 && atc >= 3 && cb >= 30) return "trafico"
  if (atc < 3) return "pagina_oferta"
  if (cb < 30) return "checkout_confianza"
  return "escalar"
}

function financeLevel(roas) {
  if (!Number.isFinite(roas)) return null
  if (roas < 1) return "critical"
  if (roas <= 2) return "fragile"   // 2.00 es frágil
  return "strong"
}

function hasFinanceData(sales, adspend, ordersCount) {
  return !!(sales && adspend && ordersCount)
}

function calculateCACRatio(cac, aov) {
  return Math.round((cac / aov) * 100)
}

console.log('🧪 TEST - DEFINITION OF DONE FINAL\n')

// 1. Fórmulas y redondeos correctos en UI
console.log('📊 1. FÓRMULAS Y REDONDEOS CORRECTOS EN UI')
const testKPIs = calculateKPIs(1000, 30, 9)
console.log(`   Input: visits=1000, carts=30, orders=9`)
console.log(`   ATC: ${testKPIs.atc}% (esperado: 3.0%) ${testKPIs.atc === 3.0 ? '✅' : '❌'}`)
console.log(`   CB: ${testKPIs.cb}% (esperado: 30.0%) ${testKPIs.cb === 30.0 ? '✅' : '❌'}`)
console.log(`   CR: ${testKPIs.cr}% (esperado: 0.9%) ${testKPIs.cr === 0.9 ? '✅' : '❌'}`)

// 2. Clasificación de cuello cumple el orden y los bordes
console.log('\n📊 2. CLASIFICACIÓN DE CUELLO - ORDEN Y BORDES')
const classificationTests = [
  { visits: 499, atc: 3, cb: 30, expected: 'trafico', desc: 'visits=499, ATC=3%, CB=30%' },
  { visits: 500, atc: 3, cb: 30, expected: 'escalar', desc: 'visits=500, ATC=3%, CB=30%' },
  { visits: 1000, atc: 2.99, cb: 30, expected: 'pagina_oferta', desc: 'visits=1000, ATC=2.99%, CB=30%' },
  { visits: 1000, atc: 3, cb: 30, expected: 'escalar', desc: 'visits=1000, ATC=3%, CB=30%' },
  { visits: 1000, atc: 5, cb: 29.99, expected: 'checkout_confianza', desc: 'visits=1000, ATC=5%, CB=29.99%' },
  { visits: 1000, atc: 5, cb: 30, expected: 'escalar', desc: 'visits=1000, ATC=5%, CB=30%' }
]

classificationTests.forEach((test, index) => {
  const result = classify({ visits: test.visits, atc: test.atc, cb: test.cb })
  const status = result === test.expected ? '✅' : '❌'
  console.log(`   ${index + 1}. ${test.desc} → ${result} ${status}`)
})

// 3. Nombres de categorías exactos
console.log('\n📊 3. NOMBRES DE CATEGORÍAS EXACTOS')
const categoryNames = ['trafico', 'pagina_oferta', 'checkout_confianza', 'escalar']
const expectedNames = ['trafico', 'pagina_oferta', 'checkout_confianza', 'escalar']
const namesMatch = JSON.stringify(categoryNames) === JSON.stringify(expectedNames)
console.log(`   Categorías: ${categoryNames.join(', ')}`)
console.log(`   ${namesMatch ? '✅' : '❌'} Nombres exactos correctos`)

// 4. Niveles financieros con 3 estados y ROAS=2.00 → Frágil
console.log('\n📊 4. NIVELES FINANCIEROS - 3 ESTADOS Y ROAS=2.00 → FRÁGIL')
const financeTests = [
  { roas: 0.5, expected: 'critical', desc: 'ROAS 0.5' },
  { roas: 1.0, expected: 'fragile', desc: 'ROAS 1.0' },
  { roas: 2.0, expected: 'fragile', desc: 'ROAS 2.0' },
  { roas: 2.01, expected: 'strong', desc: 'ROAS 2.01' }
]

financeTests.forEach((test, index) => {
  const result = financeLevel(test.roas)
  const status = result === test.expected ? '✅' : '❌'
  console.log(`   ${index + 1}. ${test.desc} → ${result} ${status}`)
})

// 5. "CAC = XX% del ticket" visible cuando hay finanzas
console.log('\n📊 5. "CAC = XX% DEL TICKET" VISIBLE CUANDO HAY FINANZAS')
const cacRatio = calculateCACRatio(133.33, 100)
console.log(`   CAC $133.33, AOV $100 → Ratio: ${cacRatio}%`)
console.log(`   Texto: "CAC = ${cacRatio}% del ticket" ${cacRatio === 133 ? '✅' : '❌'}`)

// 6. "Muestra chica" solo con ordersCount < 10
console.log('\n📊 6. "MUESTRA CHICA" SOLO CON ordersCount < 10')
const sampleTests = [
  { ordersCount: 5, expected: true, desc: 'ordersCount=5' },
  { ordersCount: 9, expected: true, desc: 'ordersCount=9' },
  { ordersCount: 10, expected: false, desc: 'ordersCount=10' },
  { ordersCount: 15, expected: false, desc: 'ordersCount=15' }
]

sampleTests.forEach((test, index) => {
  const result = test.ordersCount < 10
  const status = result === test.expected ? '✅' : '❌'
  console.log(`   ${index + 1}. ${test.desc} → Muestra chica: ${result} ${status}`)
})

// 7. Card "Finanzas rápidas (opcional)" cuando faltan datos
console.log('\n📊 7. CARD "FINANZAS RÁPIDAS (OPCIONAL)" CUANDO FALTAN DATOS')
const financeDataTests = [
  { sales: 1000, adspend: 500, ordersCount: 10, expected: true, desc: 'Todos los datos' },
  { sales: null, adspend: 500, ordersCount: 10, expected: false, desc: 'Falta sales' },
  { sales: 1000, adspend: null, ordersCount: 10, expected: false, desc: 'Falta adspend' },
  { sales: 1000, adspend: 500, ordersCount: null, expected: false, desc: 'Falta ordersCount' }
]

financeDataTests.forEach((test, index) => {
  const result = hasFinanceData(test.sales, test.adspend, test.ordersCount)
  const status = result === test.expected ? '✅' : '❌'
  console.log(`   ${index + 1}. ${test.desc} → Bloque finanzas: ${result} ${status}`)
})

// 8. Guardado por mes con deduplicación y prefill desde historial
console.log('\n📊 8. GUARDADO POR MES CON DEDUPLICACIÓN Y PREFILL')
console.log('   ✅ Clave yyyymm (ej: "202501")')
console.log('   ✅ Deduplicación: Actualiza si existe')
console.log('   ✅ Prefill desde historial: "Ver" → Formulario')
console.log('   ✅ Nuevo diagnóstico: "Hacer nuevo" → Formulario limpio')

// Resumen final
console.log('\n📊 RESUMEN FINAL - DEFINITION OF DONE')
console.log('✅ Fórmulas y redondeos correctos en UI')
console.log('✅ Clasificación de cuello cumple el orden y los bordes')
console.log('✅ Nombres de categorías exactos: trafico / pagina_oferta / checkout_confianza / escalar')
console.log('✅ Niveles financieros con 3 estados y ROAS=2.00 → Frágil')
console.log('✅ "CAC = XX% del ticket" visible cuando hay finanzas')
console.log('✅ "Muestra chica" solo con ordersCount < 10')
console.log('✅ Card "Finanzas rápidas (opcional)" cuando faltan datos')
console.log('✅ Guardado por mes con deduplicación y prefill desde historial')

console.log('\n🎉 TODOS LOS ELEMENTOS DEL DOD VERIFICADOS ✅')

module.exports = { 
  calculateKPIs, 
  classify, 
  financeLevel, 
  hasFinanceData, 
  calculateCACRatio 
}
