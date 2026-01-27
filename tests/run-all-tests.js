#!/usr/bin/env node

/**
 * Runner para ejecutar todos los tests UAT
 * Ejecuta todos los tests y genera un reporte consolidado
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 RUNNER DE TESTS UAT - DIAGNÓSTICO E-COMMERCE\n');
console.log('=' .repeat(60));

const testFiles = [
  'diagnosis-uat.test.js',
  'radar-casos-13.test.js',
  'finance-uat.test.js',
  'implementation-decisions.test.js',
  'dod-final.test.js'
];

let totalTests = 0;
let passedTests = 0;
const results = [];

testFiles.forEach((testFile, index) => {
  const testPath = path.join(__dirname, testFile);
  
  if (!fs.existsSync(testPath)) {
    console.log(`❌ Test file not found: ${testFile}`);
    return;
  }

  console.log(`\n📊 EJECUTANDO: ${testFile}`);
  console.log('-'.repeat(40));

  try {
    const output = execSync(`node "${testPath}"`, { 
      encoding: 'utf8',
      cwd: __dirname 
    });
    
    console.log(output);
    
    // Contar tests pasados (buscar líneas con "PASÓ" o "CORRECTO")
    const lines = output.split('\n');
    const passedLines = lines.filter(line => 
      line.includes('✅ PASÓ') || 
      line.includes('✅ CORRECTO') ||
      line.includes('✅') && (line.includes('PASÓ') || line.includes('CORRECTO'))
    );
    
    const testPassed = passedLines.length > 0;
    results.push({ file: testFile, passed: testPassed, count: passedLines.length });
    
    if (testPassed) {
      passedTests++;
      totalTests++;
    }
    
  } catch (error) {
    console.log(`❌ Error ejecutando ${testFile}:`);
    console.log(error.message);
    results.push({ file: testFile, passed: false, count: 0 });
    totalTests++;
  }
});

console.log('\n' + '='.repeat(60));
console.log('📊 REPORTE CONSOLIDADO DE TESTS');
console.log('='.repeat(60));

results.forEach((result, index) => {
  const status = result.passed ? '✅' : '❌';
  console.log(`${index + 1}. ${result.file}: ${status} ${result.count} tests`);
});

console.log(`\n📈 RESUMEN FINAL:`);
console.log(`   Tests ejecutados: ${totalTests}`);
console.log(`   Tests pasaron: ${passedTests}`);
console.log(`   Tests fallaron: ${totalTests - passedTests}`);
console.log(`   Porcentaje éxito: ${totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0}%`);

if (passedTests === totalTests && totalTests > 0) {
  console.log('\n🎉 ¡TODOS LOS TESTS PASARON!');
  console.log('✅ Sistema listo para producción');
  process.exit(0);
} else {
  console.log('\n⚠️  ALGUNOS TESTS FALLARON');
  console.log('❌ Revisar implementación antes de producción');
  process.exit(1);
}
