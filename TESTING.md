# 🧪 Guía de Testing - Diagnóstico E-commerce

Esta guía te explica cómo probar que toda la lógica del diagnóstico funcione correctamente.

## 🚀 Tests Rápidos

### 1. Test desde Terminal (Más Simple)
```bash
node quick-test.js
```
Este comando ejecuta tests automáticos que verifican:
- ✅ Clasificación de diagnósticos (Tráfico, Página/Oferta, Checkout, Escalar)
- ✅ Cálculos de KPIs (ATC, CB, CR)
- ✅ Evaluación financiera (ROAS, AOV, CAC)
- ✅ Niveles de riesgo (Crítico, Frágil, Sólido)

### 2. Test en Navegador (Interactivo)
Abre `test-browser.html` en tu navegador para:
- 🔍 Tests automáticos con un clic
- 🎯 Tests manuales con tus propios datos
- 📊 Visualización clara de resultados

## 📋 Datos de Prueba

### Escenarios Básicos
| Escenario | Visitas | Carritos | Pedidos | Resultado Esperado |
|-----------|---------|----------|---------|-------------------|
| **Tráfico** | 300 | 15 | 5 | `trafico` (ATC: 5%, CB: 33.3%) |
| **Página/Oferta** | 1000 | 20 | 6 | `pagina_oferta` (ATC: 2%, CB: 30%) |
| **Checkout** | 1000 | 80 | 20 | `checkout_confianza` (ATC: 8%, CB: 25%) |
| **Escalar** | 2000 | 100 | 40 | `escalar` (ATC: 5%, CB: 40%) |

### Escenarios Financieros
| Escenario | Ventas | Ads | Pedidos | ROAS | Nivel Esperado |
|-----------|--------|-----|---------|------|----------------|
| **Crítico** | $1,500 | $2,000 | 15 | 0.75 | `critical` |
| **Frágil** | $600 | $400 | 15 | 1.50 | `fragile` |
| **Sólido** | $1,200 | $300 | 15 | 4.00 | `strong` |

## 🎯 Umbrales de Clasificación

### Diagnóstico Básico
- **Tráfico**: `visits < 500` AND `atc >= 3%` AND `cb >= 30%`
- **Página/Oferta**: `atc < 3%`
- **Checkout/Confianza**: `cb < 30%`
- **Escalar**: Todo lo demás

### Evaluación Financiera
- **Crítico**: `ROAS < 1` (perdiendo dinero)
- **Frágil**: `ROAS 1-2` (cubre costos, sin margen)
- **Sólido**: `ROAS > 2` (eficiencia buena)

## 🎯 Casos Borde y Validaciones

### Tests de Casos Borde
- **ATC = 3% exacto**: Debe ser "Página/Oferta" (no "Checkout")
- **CB = 30% exacto**: Debe ser "Checkout" (no "Página/Oferta")
- **Visits = 499**: Debe ser "Tráfico"
- **Visits = 500**: NO debe ser "Tráfico" (debe ser "Escalar")

### Tests de Validación
- **carts > visits**: Debe fallar con error
- **orders > carts**: Debe fallar con error
- **adspend = 0**: Debe manejar Infinity graciosamente

## 🔧 Cómo Agregar Nuevos Tests

### 1. Test Básico
```javascript
{
  name: 'Mi Test Personalizado',
  input: { visits: 500, carts: 25, orders: 10 },
  expected: 'escalar'
}
```

### 2. Test de Caso Borde
```javascript
{
  name: 'Mi Test de Borde',
  input: { visits: 1000, carts: 30, orders: 9 }, // ATC = 3%
  expected: 'pagina_oferta'
}
```

### 3. Test de Validación
```javascript
{
  name: 'Mi Test de Error',
  input: { visits: 100, carts: 150, orders: 10 },
  shouldError: true
}
```

### 4. Test Financiero
```javascript
{
  name: 'Mi Test Financiero',
  input: { sales: 800, adspend: 400, ordersCount: 20 },
  expected: 'fragile'
}
```

## 🐛 Debugging

Si un test falla:
1. **Verifica los cálculos**: ATC = carritos/visitas, CB = compras/carritos
2. **Revisa los umbrales**: Asegúrate que los datos cumplan las condiciones
3. **Chequea la lógica**: La función `classify()` evalúa en orden específico

## 📊 Interpretación de Resultados

### KPIs Básicos
- **ATC (Agregar al Carrito)**: % de visitantes que agregan al carrito
- **CB (Cart→Buy)**: % de carritos que se convierten en compra
- **CR (Conversión Total)**: % de visitantes que compran

### Métricas Financieras
- **AOV (Ticket Promedio)**: ventas / pedidos
- **ROAS (Retorno de Ads)**: ventas / gasto en ads
- **CAC (Costo por Cliente)**: gasto en ads / pedidos

## ✅ Checklist de Validación

Antes de hacer deploy, verifica:
- [ ] Todos los tests básicos pasan
- [ ] Todos los tests financieros pasan
- [ ] Los umbrales están correctos
- [ ] Los cálculos son precisos
- [ ] Los mensajes son claros

---

**💡 Tip**: Ejecuta `node quick-test.js` antes de cada commit para asegurar que todo funcione correctamente.
