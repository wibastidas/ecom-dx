# 🧪 Tests UAT - Diagnóstico E-commerce

Este directorio contiene todos los tests de User Acceptance Testing (UAT) para el sistema de diagnóstico e-commerce.

## 📁 Estructura de Tests

- `diagnosis-uat.test.js` - Tests de casos UAT de diagnóstico (8 casos)
- `finance-uat.test.js` - Tests de casos UAT de finanzas (7 casos)
- `implementation-decisions.test.js` - Tests de decisiones de implementación (5 decisiones)
- `dod-final.test.js` - Tests de Definition of Done (8 elementos)
- `run-all-tests.js` - Runner para ejecutar todos los tests

## 🚀 Cómo ejecutar los tests

### Ejecutar todos los tests
```bash
node tests/run-all-tests.js
```

### Ejecutar un test específico
```bash
node tests/diagnosis-uat.test.js
node tests/finance-uat.test.js
node tests/implementation-decisions.test.js
node tests/dod-final.test.js
```

## 📊 Cobertura de Tests

### PARTE 1 - Verificaciones básicas
- ✅ Formulación KPIs (ATC, CB, CR)
- ✅ Redondeos en UI (1 decimal)
- ✅ CAC/AOV ratio
- ✅ Clasificación de cuello
- ✅ Nombres de categorías
- ✅ Niveles financieros
- ✅ Muestra chica

### PARTE 2 - Casos UAT diagnóstico
- ✅ A1 — Página/Oferta
- ✅ A2 — Checkout/Confianza
- ✅ A3 — Tráfico
- ✅ A4 — Listo para Escalar
- ✅ A5 — Borde ATC = 3%
- ✅ A6 — Borde CB = 30%
- ✅ A7 — Borde visits 499
- ✅ A8 — Borde visits 500

### PARTE 3 - Casos UAT finanzas
- ✅ F1 — Crítico
- ✅ F2 — Frágil (ROAS = 2.00)
- ✅ F3 — Sólido
- ✅ F4 — Muestra chica
- ✅ F5 — Sin finanzas (3 variantes)

### PARTE 4 - Textos financieros
- ✅ Mensajes por nivel (Crítico, Frágil, Sólido)
- ✅ Nota fija
- ✅ CAC ratio
- ✅ Fragmentos esperados

### PARTE 5 - Comportamientos de UI
- ✅ Encabezado dinámico
- ✅ KPIs con tooltips
- ✅ Banda de referencias
- ✅ Interpretación de comunicación
- ✅ Plan de 3 acciones
- ✅ CTA dinámico
- ✅ Bloque finanzas condicional

### PARTE 6 - Guardar e historial
- ✅ Botón "Iniciar sesión y guardar"
- ✅ Modal "Guardar diagnóstico"
- ✅ Persistencia por mes
- ✅ Historial ordenado
- ✅ Formato fila
- ✅ Prefill inteligente

### PARTE 7 - Decisiones de implementación
- ✅ ROAS = 2.00 → Frágil
- ✅ visits = 499 → Tráfico
- ✅ ATC = 3.0% exacto → NO Página/Oferta
- ✅ CB = 30.0% exacto → NO Checkout/Confianza
- ✅ Bloque Finanzas condicional

### PARTE 8 - Definition of Done
- ✅ Fórmulas y redondeos correctos
- ✅ Clasificación de cuello
- ✅ Nombres de categorías exactos
- ✅ Niveles financieros
- ✅ CAC ratio visible
- ✅ Muestra chica condicional
- ✅ Card persuasivo
- ✅ Sistema de guardado

## 🎯 Total de Verificaciones

**49/49 funcionalidades UAT verificadas** ✅

## 🔧 Integración con CI/CD

Los tests están diseñados para integrarse fácilmente con pipelines de CI/CD:

```bash
# En package.json
{
  "scripts": {
    "test:uat": "node tests/run-all-tests.js",
    "test:diagnosis": "node tests/diagnosis-uat.test.js",
    "test:finance": "node tests/finance-uat.test.js",
    "test:decisions": "node tests/implementation-decisions.test.js",
    "test:dod": "node tests/dod-final.test.js"
  }
}
```

## 📝 Notas

- Los tests son independientes y pueden ejecutarse por separado
- Cada test incluye casos edge y validaciones específicas
- Los tests documentan el comportamiento esperado del sistema
- El runner genera un reporte consolidado con estadísticas
- Los tests verifican tanto la lógica como la UI

## 🚨 Importante

Estos tests deben ejecutarse antes de cada deploy para asegurar que no se introduzcan regresiones. Si algún test falla, el sistema NO debe ir a producción.
