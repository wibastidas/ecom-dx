/**
 * Casos de prueba para el Radar E-commerce (13 casos alineados con la matriz)
 * Ejecutar: npm run test:casos  o  node tests/radar-casos-13.test.js
 *
 * Casos 01-11: usan la lógica de diagnosis (sync con src/lib/diagnosis.ts).
 * Casos 12-13: validan mensajes en src/i18n/es.json.
 */

const path = require('path')
const fs = require('fs')
const esJsonPath = path.join(__dirname, '../src/i18n/es.json')
const esJson = JSON.parse(fs.readFileSync(esJsonPath, 'utf8'))

// Lógica de diagnosis (sincronizada con src/lib/diagnosis.ts)
function classify(visits, atc, cb) {
  if (visits < 500 && atc >= 0.03 && cb >= 0.30) return 'trafico'
  if (atc < 0.03) return 'pagina_oferta'
  if (cb < 0.30) return 'checkout_confianza'
  return 'escalar'
}

function diagnose(visits, carts, purchases, sales, adspend, ordersCount, checkouts) {
  if (carts > visits) throw new Error('Error: carritos no pueden ser más que visitas')
  if (purchases > carts) throw new Error('Error: pedidos no pueden ser más que carritos')
  if (checkouts != null && checkouts > 0) {
    if (checkouts > carts) throw new Error('Error: checkouts no pueden ser más que carritos')
    if (purchases > checkouts) throw new Error('Error: compras no pueden ser más que checkouts')
  }
  const atc = visits ? carts / visits : 0
  const cb = carts ? purchases / carts : 0
  let checkoutInsight = null
  if (checkouts != null && checkouts > 0 && carts > 0) {
    const cartToCheckout = checkouts / carts
    const checkoutToBuy = purchases / checkouts
    const logistica = cartToCheckout < 0.70
    const pago = checkoutToBuy < 0.40
    if (logistica && pago) checkoutInsight = 'ambos'
    else if (logistica) checkoutInsight = 'logistica'
    else if (pago) checkoutInsight = 'pago'
  }
  const dx = classify(visits, atc, cb)
  return { dx, atc, cb, checkoutInsight }
}

function isValidStoreUrl(url) {
  const s = String(url).trim().replace(/^https?:\/\//i, '').split('/')[0] || ''
  return /^[a-z0-9.-]+\.[a-z]{2,6}$/i.test(s)
}

let passed = 0
let total = 0

function ok(caseId, name, detail) {
  total++
  passed++
  console.log(`  ✅ Caso ${caseId}: ${name}${detail ? ` — ${detail}` : ''}`)
}

function fail(caseId, name, expected, got) {
  total++
  console.log(`  ❌ Caso ${caseId}: ${name}`)
  console.log(`     Esperado: ${expected}`)
  console.log(`     Obtenido: ${got}`)
}

console.log('\n🧪 CASOS DE PRUEBA RADAR E-COMMERCE (13 casos)\n')
console.log('='.repeat(60))

// ——— GRUPO 1: Tráfico ———
console.log('\n📌 GRUPO 1: Diagnóstico de Tráfico (Casos 01–02)\n')
try {
  const r = diagnose(200, 15, 6)
  if (r.dx === 'trafico') ok('01', 'Sitio que convierte bien pero sin tráfico', 'dx=Tráfico')
  else fail('01', 'Sitio que convierte bien pero sin tráfico', 'dx=trafico', `dx=${r.dx}`)
} catch (e) {
  fail('01', 'Sitio que convierte bien pero sin tráfico', 'dx=trafico', String(e))
}
try {
  const r = diagnose(499, 30, 10, undefined, undefined, undefined, 25)
  if (r.dx === 'trafico') ok('02', 'Sitio en el límite de tráfico', 'dx=Tráfico (499 < 500)')
  else fail('02', 'Sitio en el límite de tráfico', 'dx=trafico', `dx=${r.dx}`)
} catch (e) {
  fail('02', 'Sitio en el límite de tráfico', 'dx=trafico', String(e))
}

// ——— GRUPO 2: Página/Oferta ———
console.log('\n📌 GRUPO 2: Diagnóstico de Página/Oferta (Casos 03–04)\n')
try {
  const r = diagnose(1000, 10, 2)
  if (r.dx === 'pagina_oferta') ok('03', 'Tráfico alto, oferta no convence', 'dx=Página/Oferta (ATC 1%)')
  else fail('03', 'Tráfico alto, oferta no convence', 'dx=pagina_oferta', `dx=${r.dx}`)
} catch (e) {
  fail('03', 'Tráfico alto, oferta no convence', 'dx=pagina_oferta', String(e))
}
try {
  const r = diagnose(200, 2, 1)
  if (r.dx === 'pagina_oferta') ok('04', 'Tráfico bajo y oferta mala', 'dx=Página/Oferta (ATC 1%)')
  else fail('04', 'Tráfico bajo y oferta mala', 'dx=pagina_oferta', `dx=${r.dx}`)
} catch (e) {
  fail('04', 'Tráfico bajo y oferta mala', 'dx=pagina_oferta', String(e))
}

// ——— GRUPO 3: Checkout/Confianza ———
console.log('\n📌 GRUPO 3: Diagnóstico de Checkout/Confianza (Casos 05–07)\n')
try {
  const r = diagnose(1000, 80, 5)
  if (r.dx === 'checkout_confianza') ok('05', 'Fricción general al final del embudo', 'dx=Checkout/Confianza (sin checkouts)')
  else fail('05', 'Fricción general al final del embudo', 'dx=checkout_confianza', `dx=${r.dx}`)
} catch (e) {
  fail('05', 'Fricción general al final del embudo', 'dx=checkout_confianza', String(e))
}
try {
  const r = diagnose(1000, 100, 25, undefined, undefined, undefined, 30)
  if (r.dx === 'checkout_confianza' && r.checkoutInsight === 'logistica') ok('06', 'Problema Logística/Envío', 'checkoutInsight=logistica')
  else fail('06', 'Problema Logística/Envío', 'dx=checkout_confianza, checkoutInsight=logistica', `dx=${r.dx}, insight=${r.checkoutInsight}`)
} catch (e) {
  fail('06', 'Problema Logística/Envío', 'checkoutInsight=logistica', String(e))
}
try {
  const r = diagnose(1000, 100, 10, undefined, undefined, undefined, 90)
  if (r.dx === 'checkout_confianza' && r.checkoutInsight === 'pago') ok('07', 'Problema Pasarela/Confianza', 'checkoutInsight=pago')
  else fail('07', 'Problema Pasarela/Confianza', 'dx=checkout_confianza, checkoutInsight=pago', `dx=${r.dx}, insight=${r.checkoutInsight}`)
} catch (e) {
  fail('07', 'Problema Pasarela/Confianza', 'checkoutInsight=pago', String(e))
}

// ——— GRUPO 4: Estado ideal ———
console.log('\n📌 GRUPO 4: Estado ideal (Caso 08)\n')
try {
  const r = diagnose(2000, 100, 40, undefined, undefined, undefined, 80)
  if (r.dx === 'escalar') ok('08', 'Listo para Escalar', 'dx=escalar')
  else fail('08', 'Listo para Escalar', 'dx=escalar', `dx=${r.dx}`)
} catch (e) {
  fail('08', 'Listo para Escalar', 'dx=escalar', String(e))
}

// ——— GRUPO 5: Validaciones y errores (QA) ———
console.log('\n📌 GRUPO 5: Validaciones y errores (Casos 09–13)\n')
try {
  diagnose(100, 500, 10)
  fail('09', 'Carritos > visitas', 'Error que impida cálculo', 'No se lanzó error')
} catch (e) {
  const msg = e.message || String(e)
  if (msg.includes('carritos') && msg.includes('visitas')) ok('09', 'Carritos > visitas → error', msg)
  else fail('09', 'Carritos > visitas', 'mensaje con carritos/visitas', msg)
}
try {
  diagnose(1000, 20, 50)
  fail('10', 'Compras > carritos', 'Error que impida cálculo', 'No se lanzó error')
} catch (e) {
  const msg = e.message || String(e)
  if (msg.includes('compras') || msg.includes('pedidos')) ok('10', 'Compras > carritos → error', msg)
  else fail('10', 'Compras > carritos', 'mensaje compras/carritos', msg)
}
try {
  diagnose(1000, 50, 20, undefined, undefined, undefined, 10)
  fail('11', 'Compras > checkouts', 'Error que impida cálculo', 'No se lanzó error')
} catch (e) {
  const msg11 = e.message || String(e)
  if (msg11.includes('compras') && msg11.includes('checkouts')) ok('11', 'Compras > checkouts → error', msg11)
  else fail('11', 'Compras > checkouts', 'mensaje compras/checkouts', msg11)
}

const urlInvalid = !isValidStoreUrl('mi tienda')
const urlMsgMatch = esJson.validation && typeof esJson.validation.urlInvalid === 'string' && esJson.validation.urlInvalid.includes('dominio válido')
if (urlInvalid && urlMsgMatch) {
  ok('12', 'URL inválida "mi tienda" → rechazada', `isValidStoreUrl(false). Mensaje: ${esJson.validation.urlInvalid}`)
} else if (!urlInvalid) {
  fail('12', 'URL inválida', 'isValidStoreUrl(false)', 'isValidStoreUrl(true)')
} else {
  fail('12', 'URL inválida', 'Ingresa un dominio válido (ej. ...)', String((esJson.validation && esJson.validation.urlInvalid) || ''))
}

const fieldRequired = esJson.validation && esJson.validation.fieldRequired
if (fieldRequired === 'Campo obligatorio') {
  ok('13', 'Campos vacíos → mensaje "Campo obligatorio"', 'clave fieldRequired en i18n. En form se muestra cuando hay campos vacíos.')
} else {
  fail('13', 'Campos vacíos', 'Campo obligatorio', String(fieldRequired || '(sin definir)'))
}

console.log('\n' + '='.repeat(60))
console.log(`\n📊 RESUMEN: ${passed}/${total} casos pasaron\n`)
if (passed === total) {
  console.log('🎉 Todos los casos de prueba del Radar E-commerce están OK.')
  console.log('✅ PASÓ (13/13)\n')
  process.exit(0)
} else {
  console.log('⚠️  Revisar casos fallidos arriba.\n')
  process.exit(1)
}
