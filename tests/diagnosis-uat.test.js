/**
 * Test UAT para casos de diagnóstico
 * Verifica que la lógica de clasificación funcione correctamente
 */

function diagnose(visits, carts, orders) {
  // Validaciones que deben bloquear cálculo
  if (carts > visits) {
    throw new Error('Error: carritos no pueden ser más que visitas')
  }
  if (orders > carts) {
    throw new Error('Error: pedidos no pueden ser más que carritos')
  }

  // KPIs básicos
  const atc = visits ? carts / visits : 0
  const cb = carts ? orders / carts : 0
  const cr = visits ? orders / visits : 0

  // Clasificación
  if (visits < 500 && atc >= 0.03 && cb >= 0.30) return "trafico"
  if (atc < 0.03) return "pagina_oferta"
  if (cb < 0.30) return "checkout_confianza"
  return "escalar"
}

function getDiagnosisLabel(dx) {
  const labels = {
    trafico: 'Tráfico',
    pagina_oferta: 'Página / Oferta',
    checkout_confianza: 'Checkout / Confianza',
    escalar: 'Listo para Escalar'
  }
  return labels[dx]
}

console.log('🧪 TEST UAT - CASOS DE DIAGNÓSTICO\n')

const testCases = [
  {
    name: 'A1 — Página/Oferta',
    input: { visits: 1000, carts: 20, orders: 6 },
    expected: { atc: 2.0, cb: 30.0, cr: 0.6, dx: 'pagina_oferta' }
  },
  {
    name: 'A2 — Checkout/Confianza',
    input: { visits: 1000, carts: 80, orders: 20 },
    expected: { atc: 8.0, cb: 25.0, cr: 2.0, dx: 'checkout_confianza' }
  },
  {
    name: 'A3 — Tráfico',
    input: { visits: 300, carts: 15, orders: 5 },
    expected: { atc: 5.0, cb: 33.3, cr: 1.7, dx: 'trafico' }
  },
  {
    name: 'A4 — Listo para Escalar',
    input: { visits: 2000, carts: 100, orders: 40 },
    expected: { atc: 5.0, cb: 40.0, cr: 2.0, dx: 'escalar' }
  },
  {
    name: 'A5 — Borde ATC = 3%',
    input: { visits: 1000, carts: 30, orders: 10 },
    expected: { atc: 3.0, cb: 33.3, cr: 1.0, dx: 'escalar' }
  },
  {
    name: 'A6 — Borde CB = 30%',
    input: { visits: 1000, carts: 100, orders: 30 },
    expected: { atc: 10.0, cb: 30.0, cr: 3.0, dx: 'escalar' }
  },
  {
    name: 'A7 — Borde visits 499',
    input: { visits: 499, carts: 20, orders: 7 },
    expected: { atc: 4.0, cb: 35.0, cr: 1.4, dx: 'trafico' }
  },
  {
    name: 'A8 — Borde visits 500',
    input: { visits: 500, carts: 20, orders: 7 },
    expected: { atc: 4.0, cb: 35.0, cr: 1.4, dx: 'escalar' }
  }
]

let passed = 0
let total = testCases.length

testCases.forEach(test => {
  console.log(`\n📊 ${test.name}`)
  console.log(`Input: visits=${test.input.visits}, carts=${test.input.carts}, orders=${test.input.orders}`)
  
  try {
    const atc = (test.input.carts / test.input.visits) * 100
    const cb = (test.input.orders / test.input.carts) * 100
    const cr = (test.input.orders / test.input.visits) * 100
    const dx = diagnose(test.input.visits, test.input.carts, test.input.orders)
    
    const atcMatch = Math.abs(atc - test.expected.atc) < 0.1
    const cbMatch = Math.abs(cb - test.expected.cb) < 0.1
    const crMatch = Math.abs(cr - test.expected.cr) < 0.1
    const dxMatch = dx === test.expected.dx
    
    const testPassed = atcMatch && cbMatch && crMatch && dxMatch
    
    console.log(`Resultado:`)
    console.log(`  ATC: ${atc.toFixed(1)}% (esperado: ${test.expected.atc}%) ${atcMatch ? '✅' : '❌'}`)
    console.log(`  CB:  ${cb.toFixed(1)}% (esperado: ${test.expected.cb}%) ${cbMatch ? '✅' : '❌'}`)
    console.log(`  CR:  ${cr.toFixed(1)}% (esperado: ${test.expected.cr}%) ${crMatch ? '✅' : '❌'}`)
    console.log(`  DX:  ${getDiagnosisLabel(dx)} (esperado: ${getDiagnosisLabel(test.expected.dx)}) ${dxMatch ? '✅' : '❌'}`)
    console.log(`  ${testPassed ? '✅ PASÓ' : '❌ FALLÓ'}`)
    
    if (testPassed) passed++
    
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`)
  }
})

console.log(`\n📊 RESUMEN: ${passed}/${total} casos pasaron`)

// Test de validaciones
console.log('\n🔒 VALIDACIONES:')
const validationCases = [
  {
    name: 'carts > visits',
    input: { visits: 100, carts: 150, orders: 10 },
    shouldError: true
  },
  {
    name: 'orders > carts',
    input: { visits: 1000, carts: 50, orders: 80 },
    shouldError: true
  }
]

validationCases.forEach(test => {
  try {
    diagnose(test.input.visits, test.input.carts, test.input.orders)
    console.log(`❌ ${test.name}: Debería haber fallado pero no falló`)
  } catch (error) {
    console.log(`✅ ${test.name}: ${error.message}`)
  }
})

module.exports = { diagnose, getDiagnosisLabel }
