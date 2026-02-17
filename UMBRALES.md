# Umbrales de métricas – Diagnóstico E-commerce

Referencia de los umbrales **bajo**, **en rango** y **alto** usados en la aplicación para cada métrica.

---

## 1. Carritos vs. Visitas (ATC)

**Cálculo:** `(carritos / visitas) × 100` (o checkouts/visitas en modo Compra Rápida)

| Estado    | Umbral    | Mensaje en UI                    |
|-----------|-----------|-----------------------------------|
| **Bajo**  | &lt; 4%   | Por Debajo → Hay que mejorar     |
| **En rango** | 4% – 6% | En el rango normal               |
| **Alto**  | &gt; 6%   | Por Encima → Excelente           |

**Definición en código:** `src/lib/metricsHelpers.ts` → `NORMAL_RANGES.ATC = { min: 4.0, max: 6.0 }`

**Diagnóstico (cuello de botella):** En `src/lib/diagnosis.ts`, si **ATC &lt; 3%** se clasifica como **Página / Oferta**. Es un umbral distinto al “rango normal” (4–6%) usado en las cards.

---

## 2. Compras vs. Carritos (CB – Cart→Buy)

**Cálculo:** `(compras / carritos) × 100` (o compras/checkouts en modo Compra Rápida)

| Estado    | Umbral     | Mensaje en UI                    |
|-----------|------------|-----------------------------------|
| **Bajo**  | &lt; 15%   | Por Debajo → Hay que mejorar     |
| **En rango** | 15% – 25% | En el rango normal               |
| **Alto**  | &gt; 25%   | Por Encima → Excelente           |

**Definición en código:** `src/lib/metricsHelpers.ts` → `NORMAL_RANGES.CB = { min: 15.0, max: 25.0 }`

**Diagnóstico:** Si **CB &lt; 30%** se clasifica como **Checkout / Confianza**. El 30% es el umbral de “problema”; el rango 15–25% es el “normal” mostrado en las cards.

---

## 3. Tasa de Conversión (CR)

**Cálculo:** `(compras / visitas) × 100`

| Estado    | Umbral   | Mensaje en UI                    |
|-----------|----------|-----------------------------------|
| **Bajo**  | &lt; 1%  | Por Debajo → Hay que mejorar     |
| **En rango** | = 1%  | En el rango normal               |
| **Alto**  | &gt; 1%  | Por Encima → Excelente           |

**Definición en código:** `src/lib/metricsHelpers.ts` → `NORMAL_RANGES.CR = { min: 1.0, max: 1.0 }`

---

## 4. Checkout (sub-métricas)

Cuando se ingresan **Pagos iniciados (Checkout)**, la app calcula dos tasas y usa umbrales fijos para el insight **“Dónde se rompe el proceso”**. No hay estados “bajo / en rango / alto” en cards para estas métricas.

### Cart→Checkout (checkouts / carritos)

| Estado en lógica | Umbral   | Insight                          |
|------------------|----------|-----------------------------------|
| Problema         | &lt; 70% | Logística (envío, plazos, umbral gratis) |
| OK               | ≥ 70%    | No se marca problema             |

### Checkout→Buy (compras / checkouts)

| Estado en lógica | Umbral   | Insight                          |
|------------------|----------|-----------------------------------|
| Problema         | &lt; 40% | Pago (pasarela, cuotas, confianza) |
| OK               | ≥ 40%    | No se marca problema             |

Si **ambas** están por debajo de su umbral → insight **“ambos”** (logística y pago).

**Definición en código:** `src/lib/diagnosis.ts` (constantes `0.70` y `0.40` en la lógica de `checkoutInsight`).

---

## Resumen de archivos

| Qué                    | Dónde                        |
|------------------------|-----------------------------|
| Rangos normales ATC/CB/CR | `src/lib/metricsHelpers.ts` |
| Clasificación diagnóstico (3%, 30%) | `src/lib/diagnosis.ts` → `classify()` |
| Umbrales checkout (70%, 40%)       | `src/lib/diagnosis.ts` → bloque `checkoutInsight` |
| Textos UI (below, equal, above)    | `src/i18n/es.json` → `metrics.*` |

---

## Nota sobre diagnóstico vs. rango normal

- **Rango normal (metricsHelpers):** Se usa para el color y el mensaje en las 3 cards (Bajo / En rango / Alto).
- **Umbrales de diagnóstico (diagnosis.ts):** Deciden el cuello de botella (Tráfico, Página/Oferta, Checkout/Confianza, Listo para Escalar).

Por eso existen dos criterios: ATC 3% para “Página/Oferta” y 4–6% para “rango normal”; CB 30% para “Checkout/Confianza” y 15–25% para “rango normal”. Si se desea unificar criterios, habría que ajustar `classify()` y validar los casos de UAT.
