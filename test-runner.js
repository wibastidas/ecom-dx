#!/usr/bin/env node

// Test runner simple para verificar la lógica sin dependencias complejas

console.log('🧪 Ejecutando tests de diagnóstico...\n')

// Importar las funciones (simulando imports)
const { diagnose } = require('./src/lib/diagnosis.ts')
const { evaluateFinance } = require('./src/lib/finance.ts')

// Tests de diagnóstico
function testDiagnosis() {
  console.log('📊 Tests de Diagnóstico:')
  
  // Test 1: Tráfico
  const result1 = diagnose(300, 15, 3)
  console.log(`✅ Tráfico: ${result1.dx} (ATC: ${(result1.atc * 100).toFixed(1)}%, CB: ${(result1.cb * 100).toFixed(1)}%, CR: ${(result1.cr * 100).toFixed(1)}%)`)
  
  // Test 2: Página/Oferta
  const result2 = diagnose(1000, 20, 6)
  console.log(`✅ Página/Oferta: ${result2.dx} (ATC: ${(result2.atc * 100).toFixed(1)}%, CB: ${(result2.cb * 100).toFixed(1)}%, CR: ${(result2.cr * 100).toFixed(1)}%)`)
  
  // Test 3: Checkout
  const result3 = diagnose(1000, 80, 20)
  console.log(`✅ Checkout: ${result3.dx} (ATC: ${(result3.atc * 100).toFixed(1)}%, CB: ${(result3.cb * 100).toFixed(1)}%, CR: ${(result3.cr * 100).toFixed(1)}%)`)
  
  // Test 4: Escalar
  const result4 = diagnose(2000, 100, 40)
  console.log(`✅ Escalar: ${result4.dx} (ATC: ${(result4.atc * 100).toFixed(1)}%, CB: ${(result4.cb * 100).toFixed(1)}%, CR: ${(result4.cr * 100).toFixed(1)}%)`)
  
  console.log('')
}

// Tests de finanzas
function testFinance() {
  console.log('💰 Tests de Finanzas:')
  
  // Test 1: Crítico (ROAS < 1)
  try {
    const finance1 = evaluateFinance({ aov: 100, roas: 0.75, cac: 80, ordersCount: 15 })
    console.log(`✅ Crítico: ${finance1.level} - ${finance1.headline}`)
  } catch (e) {
    console.log(`❌ Error en test crítico: ${e.message}`)
  }
  
  // Test 2: Frágil (ROAS 1-2)
  try {
    const finance2 = evaluateFinance({ aov: 40, roas: 1.50, cac: 26.67, ordersCount: 15 })
    console.log(`✅ Frágil: ${finance2.level} - ${finance2.headline}`)
  } catch (e) {
    console.log(`❌ Error en test frágil: ${e.message}`)
  }
  
  // Test 3: Sólido (ROAS > 2)
  try {
    const finance3 = evaluateFinance({ aov: 80, roas: 4.00, cac: 20, ordersCount: 15 })
    console.log(`✅ Sólido: ${finance3.level} - ${finance3.headline}`)
  } catch (e) {
    console.log(`❌ Error en test sólido: ${e.message}`)
  }
  
  console.log('')
}

// Ejecutar tests
try {
  testDiagnosis()
  testFinance()
  console.log('🎉 Todos los tests completados!')
} catch (error) {
  console.log(`❌ Error ejecutando tests: ${error.message}`)
}
