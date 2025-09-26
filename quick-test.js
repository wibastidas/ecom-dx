#!/usr/bin/env node

// Test rápido y simple para verificar la lógica
console.log('🧪 Test Rápido de Diagnóstico E-commerce\n');

// Datos de prueba
const testCases = [
  {
    name: 'Tráfico (pocas visitas, buenas tasas)',
    input: { visits: 300, carts: 15, orders: 5 },
    expected: 'trafico'
  },
  {
    name: 'Página/Oferta (baja ATC)',
    input: { visits: 1000, carts: 20, orders: 6 },
    expected: 'pagina_oferta'
  },
  {
    name: 'Checkout (baja CB)',
    input: { visits: 1000, carts: 80, orders: 20 },
    expected: 'checkout_confianza'
  },
  {
    name: 'Escalar (buenas tasas)',
    input: { visits: 2000, carts: 100, orders: 40 },
    expected: 'escalar'
  }
];

// Tests de casos borde
const edgeTestCases = [
  {
    name: 'ATC exactamente 3% (debe ser Página/Oferta)',
    input: { visits: 1000, carts: 30, orders: 9 }, // ATC = 30/1000 = 3%
    expected: 'pagina_oferta' // ATC = 3%, debe ser página/oferta
  },
  {
    name: 'CB exactamente 30% (debe ser Checkout)',
    input: { visits: 1000, carts: 50, orders: 15 }, // CB = 15/50 = 30%
    expected: 'checkout_confianza' // CB = 30%, debe ser checkout
  },
  {
    name: 'Visits = 499 (debe ser Tráfico)',
    input: { visits: 499, carts: 25, orders: 8 }, // ATC = 5%, CB = 32%
    expected: 'trafico'
  },
  {
    name: 'Visits = 500 (NO debe ser Tráfico)',
    input: { visits: 500, carts: 25, orders: 8 }, // ATC = 5%, CB = 32%
    expected: 'escalar' // No cumple visits < 500
  }
];

// Tests de validación de errores
const validationTestCases = [
  {
    name: 'Error: carts > visits (imposible)',
    input: { visits: 100, carts: 150, orders: 10 },
    shouldError: true
  },
  {
    name: 'Error: orders > carts (imposible)',
    input: { visits: 1000, carts: 50, orders: 80 },
    shouldError: true
  }
];

const financeTestCases = [
  {
    name: 'Finanzas Críticas (ROAS < 1)',
    input: { sales: 1500, adspend: 2000, ordersCount: 15 },
    expected: 'critical'
  },
  {
    name: 'Finanzas Frágiles (ROAS 1-2)',
    input: { sales: 600, adspend: 400, ordersCount: 15 },
    expected: 'fragile'
  },
  {
    name: 'Finanzas Sólidas (ROAS > 2)',
    input: { sales: 1200, adspend: 300, ordersCount: 15 },
    expected: 'strong'
  },
  {
    name: 'ROAS con adspend = 0 (debe manejar Infinity)',
    input: { sales: 1000, adspend: 0, ordersCount: 10 },
    expected: 'error' // Debe fallar graciosamente
  }
];

// Función de diagnóstico (simplificada)
function diagnose(visits, carts, orders, sales, adspend, ordersCount) {
  // Validaciones de datos imposibles
  if (carts > visits) {
    throw new Error('Error: carritos no pueden ser más que visitas');
  }
  if (orders > carts) {
    throw new Error('Error: pedidos no pueden ser más que carritos');
  }
  
  const atc = carts / visits;
  const cb = orders / carts;
  const cr = orders / visits;
  
  let dx;
  if (visits < 500 && atc >= 0.03 && cb >= 0.30) {
    dx = 'trafico';
  } else if (atc <= 0.03) { // Cambiado a <= para incluir exactamente 3%
    dx = 'pagina_oferta';
  } else if (cb <= 0.30) { // Cambiado a <= para incluir exactamente 30%
    dx = 'checkout_confianza';
  } else {
    dx = 'escalar';
  }
  
  let aov = null, roas = null, cac = null;
  if (sales && adspend && ordersCount) {
    aov = sales / ordersCount;
    roas = adspend > 0 ? sales / adspend : null;
    cac = ordersCount > 0 ? adspend / ordersCount : null;
  }
  
  return { dx, atc, cb, cr, aov, roas, cac };
}

// Función de evaluación financiera (simplificada)
function evaluateFinance({aov, roas, cac, ordersCount}) {
  if (!isFinite(aov) || !isFinite(roas) || !isFinite(cac) || roas === Infinity) {
    throw new Error('missing_finance_data');
  }

  if (roas < 1) {
    return { level: 'critical', headline: `Por cada $1 que invertiste en anuncios, volvieron $${roas.toFixed(2)}.` };
  }
  
  if (roas >= 1 && roas < 2) {
    return { level: 'fragile', headline: `Por cada $1 que invertiste en anuncios, volvieron $${roas.toFixed(2)}.` };
  }
  
  if (cac > aov) {
    return { level: 'fragile', headline: `Por cada $1 que invertiste en anuncios, volvieron $${roas.toFixed(2)}.` };
  }
  
  if (Math.abs(cac - aov) / aov < 0.1) {
    return { level: 'ok', headline: `Por cada $1 que invertiste en anuncios, volvieron $${roas.toFixed(2)}.` };
  }
  
  return { level: 'strong', headline: `Por cada $1 que invertiste en anuncios, volvieron $${roas.toFixed(2)}.` };
}

// Ejecutar tests de diagnóstico básicos
console.log('📊 Tests de Diagnóstico Básicos:');
testCases.forEach(test => {
  const result = diagnose(test.input.visits, test.input.carts, test.input.orders);
  const success = result.dx === test.expected;
  
  console.log(`${success ? '✅' : '❌'} ${test.name}`);
  console.log(`   Input: ${test.input.visits} visitas, ${test.input.carts} carritos, ${test.input.orders} pedidos`);
  console.log(`   Resultado: ${result.dx} (esperado: ${test.expected})`);
  console.log(`   ATC: ${(result.atc * 100).toFixed(1)}%, CB: ${(result.cb * 100).toFixed(1)}%, CR: ${(result.cr * 100).toFixed(1)}%`);
  console.log('');
});

// Ejecutar tests de casos borde
console.log('🎯 Tests de Casos Borde:');
edgeTestCases.forEach(test => {
  const result = diagnose(test.input.visits, test.input.carts, test.input.orders);
  const success = result.dx === test.expected;
  
  console.log(`${success ? '✅' : '❌'} ${test.name}`);
  console.log(`   Input: ${test.input.visits} visitas, ${test.input.carts} carritos, ${test.input.orders} pedidos`);
  console.log(`   Resultado: ${result.dx} (esperado: ${test.expected})`);
  console.log(`   ATC: ${(result.atc * 100).toFixed(1)}%, CB: ${(result.cb * 100).toFixed(1)}%, CR: ${(result.cr * 100).toFixed(1)}%`);
  console.log('');
});

// Ejecutar tests de validación
console.log('⚠️  Tests de Validación:');
validationTestCases.forEach(test => {
  try {
    const result = diagnose(test.input.visits, test.input.carts, test.input.orders);
    const success = !test.shouldError; // Si no debería fallar y no falló, está bien
    
    console.log(`${success ? '✅' : '❌'} ${test.name}`);
    console.log(`   Input: ${test.input.visits} visitas, ${test.input.carts} carritos, ${test.input.orders} pedidos`);
    console.log(`   Resultado: ${result.dx} (esperado: error)`);
    console.log('');
  } catch (error) {
    const success = test.shouldError; // Si debería fallar y falló, está bien
    
    console.log(`${success ? '✅' : '❌'} ${test.name}`);
    console.log(`   Input: ${test.input.visits} visitas, ${test.input.carts} carritos, ${test.input.orders} pedidos`);
    console.log(`   Error capturado: ${error.message}`);
    console.log('');
  }
});

// Ejecutar tests de finanzas
console.log('💰 Tests de Finanzas:');
financeTestCases.forEach(test => {
  const aov = test.input.sales / test.input.ordersCount;
  const roas = test.input.adspend > 0 ? test.input.sales / test.input.adspend : Infinity;
  const cac = test.input.adspend / test.input.ordersCount;
  
  try {
    const result = evaluateFinance({ aov, roas, cac, ordersCount: test.input.ordersCount });
    const success = result.level === test.expected;
    
    console.log(`${success ? '✅' : '❌'} ${test.name}`);
    console.log(`   Input: $${test.input.sales} ventas, $${test.input.adspend} ads, ${test.input.ordersCount} pedidos`);
    console.log(`   AOV: $${aov.toFixed(2)}, ROAS: ${roas === Infinity ? 'Infinity' : roas.toFixed(2)}, CAC: $${cac.toFixed(2)}`);
    console.log(`   Nivel: ${result.level} (esperado: ${test.expected})`);
    console.log(`   Headline: ${result.headline}`);
    console.log('');
  } catch (e) {
    const success = test.expected === 'error';
    
    console.log(`${success ? '✅' : '❌'} ${test.name}`);
    console.log(`   Input: $${test.input.sales} ventas, $${test.input.adspend} ads, ${test.input.ordersCount} pedidos`);
    console.log(`   Error capturado: ${e.message} (esperado: error)`);
    console.log('');
  }
});

console.log('🎉 Tests completados!');
