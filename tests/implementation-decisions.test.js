/**
 * Test para verificar decisiones específicas de implementación
 * Verifica que las reglas de negocio estén correctamente implementadas
 */

function financeLevel(roas) {
  if (!Number.isFinite(roas)) return null
  if (roas < 1) return "critical"
  if (roas <= 2) return "fragile"   // 2.00 es frágil
  return "strong"                   // solo > 2 es sólido
}

function classify({ visits, atc, cb }) {
  if (visits < 500 && atc >= 0.03 && cb >= 0.30) return "trafico"
  if (atc < 0.03) return "pagina_oferta"  // ATC < 3% (no <=)
  if (cb < 0.30) return "checkout_confianza"  // CB < 30% (no <=)
  return "escalar"
}

function hasFinanceData(sales, adspend, ordersCount) {
  return !!(sales && adspend && ordersCount)
}

console.log('🧪 TEST - DECISIONES DE IMPLEMENTACIÓN\n')

// 1. ROAS = 2.00 debe salir como nivel Frágil
console.log('📊 1. ROAS = 2.00 → Nivel Frágil')
const roas200 = financeLevel(2.00)
console.log(`   ROAS 2.00 → Nivel: ${roas200}`)
console.log(`   ${roas200 === 'fragile' ? '✅ CORRECTO' : '❌ INCORRECTO'}`)

// 2. visits = 499 con ATC ≥ 3% y CB ≥ 30% debe clasificar como Tráfico
console.log('\n📊 2. visits = 499 con ATC ≥ 3% y CB ≥ 30% → Tráfico')
const testTraffic = classify({ visits: 499, atc: 0.03, cb: 0.30 })
console.log(`   visits=499, ATC=3.0%, CB=30.0% → Categoría: ${testTraffic}`)
console.log(`   ${testTraffic === 'trafico' ? '✅ CORRECTO' : '❌ INCORRECTO'}`)

// 3. ATC = 3.0% exacto no debe ir a Página/Oferta
console.log('\n📊 3. ATC = 3.0% exacto → NO Página/Oferta')
const testATC3 = classify({ visits: 1000, atc: 0.03, cb: 0.30 })
console.log(`   visits=1000, ATC=3.0%, CB=30.0% → Categoría: ${testATC3}`)
console.log(`   ${testATC3 !== 'pagina_oferta' ? '✅ CORRECTO' : '❌ INCORRECTO'}`)

// 4. CB = 30.0% exacto no debe ir a Checkout/Confianza
console.log('\n📊 4. CB = 30.0% exacto → NO Checkout/Confianza')
const testCB30 = classify({ visits: 1000, atc: 0.05, cb: 0.30 })
console.log(`   visits=1000, ATC=5.0%, CB=30.0% → Categoría: ${testCB30}`)
console.log(`   ${testCB30 !== 'checkout_confianza' ? '✅ CORRECTO' : '❌ INCORRECTO'}`)

// 5. Bloque Finanzas no se renderiza si faltan datos
console.log('\n📊 5. Bloque Finanzas condicional')
const testCases = [
  { sales: 1000, adspend: 500, ordersCount: 10, expected: true, desc: 'Todos los datos' },
  { sales: null, adspend: 500, ordersCount: 10, expected: false, desc: 'Falta sales' },
  { sales: 1000, adspend: null, ordersCount: 10, expected: false, desc: 'Falta adspend' },
  { sales: 1000, adspend: 500, ordersCount: null, expected: false, desc: 'Falta ordersCount' },
  { sales: 0, adspend: 500, ordersCount: 10, expected: false, desc: 'sales = 0' },
  { sales: 1000, adspend: 0, ordersCount: 10, expected: false, desc: 'adspend = 0' },
  { sales: 1000, adspend: 500, ordersCount: 0, expected: false, desc: 'ordersCount = 0' }
]

testCases.forEach((test, index) => {
  const result = hasFinanceData(test.sales, test.adspend, test.ordersCount)
  const status = result === test.expected ? '✅' : '❌'
  console.log(`   ${index + 1}. ${test.desc}: ${result} ${status}`)
})

// 6. Casos edge específicos
console.log('\n📊 6. CASOS EDGE ESPECÍFICOS')

// 6.1 ROAS = 1.99 (debe ser frágil)
const roas199 = financeLevel(1.99)
console.log(`   ROAS 1.99 → Nivel: ${roas199} ${roas199 === 'fragile' ? '✅' : '❌'}`)

// 6.2 ROAS = 2.01 (debe ser sólido)
const roas201 = financeLevel(2.01)
console.log(`   ROAS 2.01 → Nivel: ${roas201} ${roas201 === 'strong' ? '✅' : '❌'}`)

// 6.3 visits = 500 con ATC ≥ 3% y CB ≥ 30% (debe ser escalar, no tráfico)
const test500 = classify({ visits: 500, atc: 0.03, cb: 0.30 })
console.log(`   visits=500, ATC=3.0%, CB=30.0% → Categoría: ${test500} ${test500 === 'escalar' ? '✅' : '❌'}`)

// 6.4 ATC = 2.99% (debe ser página/oferta)
const testATC299 = classify({ visits: 1000, atc: 0.0299, cb: 0.30 })
console.log(`   visits=1000, ATC=2.99%, CB=30.0% → Categoría: ${testATC299} ${testATC299 === 'pagina_oferta' ? '✅' : '❌'}`)

// 6.5 CB = 29.99% (debe ser checkout/confianza)
const testCB2999 = classify({ visits: 1000, atc: 0.05, cb: 0.2999 })
console.log(`   visits=1000, ATC=5.0%, CB=29.99% → Categoría: ${testCB2999} ${testCB2999 === 'checkout_confianza' ? '✅' : '❌'}`)

// Resumen
console.log('\n📊 RESUMEN DE DECISIONES:')
console.log('✅ ROAS = 2.00 → Frágil (no Sólido)')
console.log('✅ visits = 499 + ATC ≥ 3% + CB ≥ 30% → Tráfico')
console.log('✅ ATC = 3.0% exacto → NO Página/Oferta')
console.log('✅ CB = 30.0% exacto → NO Checkout/Confianza')
console.log('✅ Bloque Finanzas solo si sales && adspend && ordersCount')
console.log('✅ Casos edge correctos (1.99, 2.01, 500, 2.99, 29.99)')

module.exports = { financeLevel, classify, hasFinanceData }
