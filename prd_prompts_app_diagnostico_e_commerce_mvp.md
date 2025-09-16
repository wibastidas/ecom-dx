PRD + Prompts para Cursor – App de Diagnóstico E-commerce (MVP)

(secciones previas igual que las que ya definiste)

⸻

1.4 Alcance (MVP) – actualizado

Incluye:
	•	Form mínimo (mes actual default): visitas, carritos, compras.
	•	Resultado inmediato con diagnóstico (trafico, oferta_web, checkout, etc.).
	•	Opcionales post-resultado (no bloquean): ventas totales, ad spend, nº de ventas → calculan ROAS, ticket medio (AOV) y CAC. Se muestran en una tarjeta secundaria “Finanzas rápidas”.
	•	JSON de recomendaciones por diagnóstico.
	•	Firestore multi-tenant por uid.
	•	Pages: /, /mentoria, /agenda, /dashboard.
	•	Tracking de eventos (GTM/Analytics).

⸻

1.5 Lógica de diagnóstico (sin cambios)

(igual que lo que ya pusiste)

⸻

1.6 Cálculos financieros opcionales
	•	ROAS = sales_total / ad_spend (si ad_spend > 0).
	•	AOV (ticket medio) = sales_total / orders (si orders > 0).
	•	CAC aprox. = ad_spend / orders (si orders > 0).

Alertas (badges en UI):
	•	ROAS < 2 → rojo; 2–3 → ámbar; ≥3 → verde.
	•	CAC ≥ 30% del AOV → alerta.
	•	Si ad_spend = 0 → mostrar tip “ROAS no aplica (orgánico)”.

Nota en UI: “Estimaciones generales, no contemplan atribución por canal ni márgenes.”

⸻

2.3 Modelo de datos (Firestore) – actualizado

/users/{uid}
  email, name, createdAt
/users/{uid}/metrics/{docId}
  month: '2025-08'
  visits: number
  carts: number
  purchases: number
  sales_total?: number | null
  ad_spend?: number | null
  orders?: number | null
  cv: number
  cc: number
  tc: number
  roas?: number | null
  aov?: number | null
  cac?: number | null
  diagnosis: 'trafico'|'oferta_web'|'checkout'|'ok_sample_low'|'saludable'


⸻

5. Backlog de Tareas (con DoD) – actualizado
	1.	Setup proyecto (3h) – DoD: app arranca local.
	2.	Auth Google + Firestore (3h) – DoD: login muestra uid; rules aplicadas.
	3.	Diagnóstico sin login (4h) – DoD: form calcula dx y muestra ResultCard + CTA sales page.
	4.	Campos opcionales (finanzas rápidas) (3h) – DoD: acordeón colapsable debajo del resultado; si se completan datos, muestra FinanceCard con ROAS/AOV/CAC.
	5.	Guardar histórico (login-on-save) (4h) – DoD: crea/edita/borra registros; /dashboard lista y grafica.
	6.	Sales page & Agenda (3h) – DoD: /mentoria y /agenda operativos + tracking.
	7.	QA mobile + deploy (3h) – DoD: Lighthouse móvil ≥ 90; deploy en Vercel + subdominio.

⸻

6.3 Diagnóstico sin login – Prompt (ajustado)

“Construí MetricsForm con react-hook-form + zod (campos: visits, carts, purchases, month). Al submit, usá diagnose() y renderizá ResultCard. Dispará track('diag_result_view', { diagnosis }).
Debajo del resultado agregá un acordeón opcional con 3 inputs (sales_total, ad_spend, orders). Si se completan, calculá roas, aov, cac y renderizá FinanceCard con badges de color según umbrales. No bloquear flujo si están vacíos.”

⸻

12) Datos que guardamos (PII mínima)

Usuario (/users/{uid}): email, name, createdAt.
Métrica mensual (/users/{uid}/metrics/{month}):
	•	Core: visits, carts, purchases, derivados, diagnosis.
	•	Opcionales: sales_total, ad_spend, orders (+ derivados).
