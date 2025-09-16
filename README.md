# App de Diagnóstico E-commerce MVP

Una aplicación web para diagnosticar problemas de conversión en tiendas online con marca propia, con análisis financiero opcional para screening de leads.

## 🚀 Características

### Capa 1 - Diagnóstico Core (Obligatorio)
- **Diagnóstico sin login**: Formulario simple con 3 métricas básicas
- **Análisis automático**: Calcula %CV, %CC y %TC con umbrales inteligentes
- **Recomendaciones personalizadas**: Plan de acción de 7 días según el diagnóstico
- **CTAs directos**: Enlaces a Calendly para agendar llamada

### Capa 2 - Análisis Financiero (Opcional)
- **Acordeón colapsable**: "Mejorá la precisión (opcional)"
- **Cálculos financieros**: ROAS, AOV (ticket medio), CAC
- **Alertas por umbral**: Detección de problemas de rentabilidad
- **Screening inteligente**: Identifica leads de mayor calidad

### Características Generales
- **Mobile-first**: Diseño optimizado para dispositivos móviles
- **Tracking de eventos**: Integración con Google Analytics y GTM
- **Dos capas separadas**: Reduce fricción, mantiene el foco en el diagnóstico

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Backend**: Firebase (Auth + Firestore)
- **Deploy**: Vercel
- **Analytics**: Google Analytics 4, Google Tag Manager

## 📱 Flujo Principal

### Flujo Core (Sin Fricción)
1. **Diagnóstico**: Usuario ingresa visitas, carritos y compras
2. **Análisis**: Sistema calcula métricas y determina el problema principal
3. **Recomendaciones**: Muestra acciones específicas según el diagnóstico
4. **CTA**: Botón para agendar llamada gratuita (Calendly)

### Flujo Opcional (Enriquecimiento)
5. **Acordeón financiero**: "Mejorá la precisión (opcional)"
6. **Datos financieros**: Ventas totales, ad spend, número de pedidos
7. **Cálculos automáticos**: ROAS, AOV, CAC con alertas por umbral
8. **Screening**: Identifica leads de mayor calidad para la llamada

## 🏃‍♂️ Inicio Rápido

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Configurar variables de entorno**:
   ```bash
   cp .env.example .env.local
   # Editar .env.local con tus credenciales de Firebase
   ```

3. **Ejecutar en desarrollo**:
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**:
   ```
   http://localhost:3000
   ```

## 📊 Lógica de Diagnóstico

### Métricas Core (Obligatorias)
El sistema analiza 3 métricas clave:

- **%CV (Conversión a Carrito)**: `carritos / visitas` (target: 4-6%)
- **%CC (Conversión de Carrito)**: `compras / carritos` (target: 15-25%)
- **%TC (Conversión Total)**: `compras / visitas` (target: ~1%)

### Diagnósticos Posibles

- **Tráfico**: Pocas visitas y baja conversión total
- **Oferta & Web**: Buen tráfico pero baja conversión a carrito
- **Checkout**: Buena conversión a carrito pero baja conversión de carrito
- **Muestra Insuficiente**: Métricas buenas pero muestra muy pequeña
- **Saludable**: Todas las métricas en rangos óptimos

### Métricas Financieras (Opcionales)
Para leads de mayor calidad:

- **ROAS (Return on Ad Spend)**: `ventas_total / ad_spend` (target: ≥3)
- **AOV (Average Order Value)**: `ventas_total / pedidos` (target: ≥$10)
- **CAC (Customer Acquisition Cost)**: `ad_spend / pedidos` (target: ≤30% del AOV)

### Alertas por Umbral
- **ROAS < 2**: Riesgo de ineficiencia en ads
- **AOV < $10**: Posible fricción de envío/costos fijos
- **CAC > 30% del AOV**: Revisar creativos, targeting o oferta

## 🏗️ Arquitectura de Dos Capas

### Capa 1 - Core (Sin Fricción)
- **Objetivo**: Máxima conversión al diagnóstico
- **Campos**: Solo 3 métricas esenciales
- **Resultado**: Diagnóstico inmediato + CTA
- **Conversión**: Optimizada para captar leads

### Capa 2 - Financiero (Screening)
- **Objetivo**: Calificar leads de mayor calidad
- **Campos**: 3 métricas financieras opcionales
- **Resultado**: ROAS, AOV, CAC + alertas
- **Beneficio**: Mejor preparación para la llamada

### Ventajas del Diseño
- **Reduce fricción**: El diagnóstico core no requiere datos financieros
- **Mantiene el foco**: El "wow" del diagnóstico viene primero
- **Screening inteligente**: Los que completan financiero son leads de calidad
- **Flexibilidad**: Funciona con o sin datos financieros

## 🔧 Configuración Firebase

1. Crear proyecto en [Firebase Console](https://console.firebase.google.com)
2. Habilitar Authentication (Google) y Firestore
3. Configurar reglas de seguridad
4. Obtener credenciales y agregarlas a `.env.local`

## 💾 Modelo de Datos

### Estructura Firestore
```
/users/{uid}/metrics/{month}
  # Campos core (obligatorios)
  visits: number
  carts: number
  purchases: number
  month: string
  cv: number
  cc: number
  tc: number
  diagnosis: string
  
  # Campos financieros (opcionales)
  sales_total?: number | null
  ad_spend?: number | null
  orders?: number | null
  roas?: number | null
  aov?: number | null
  cac?: number | null
```

### Validaciones
- **Core**: Todos los campos son obligatorios
- **Financiero**: Todos los campos son opcionales (pueden ser null)
- **Cálculos**: Se realizan automáticamente al guardar
- **Seguridad**: Reglas de Firestore aíslan datos por usuario

## 📈 Tracking de Eventos

### Eventos Core
- `diag_start`: Inicio del diagnóstico
- `diag_submit`: Envío del formulario core
- `diag_result_view`: Visualización de resultados
- `salespage_cta_click`: Click en CTA de Calendly

### Eventos Financieros
- `financial_form_submit`: Envío del formulario financiero
- `financial_calculations_view`: Visualización de métricas financieras
- `financial_alert_view`: Visualización de alertas por umbral

### Eventos de Navegación
- `calendar_view`: Vista de página de agenda
- `calendar_booked`: Agendamiento de llamada

## 🚀 Deploy

1. **Vercel** (recomendado):
   ```bash
   npm run build
   # Conectar repositorio a Vercel
   ```

2. **Configurar dominio**:
   - Subdominio: `app.williambastidas.com`
   - Variables de entorno en Vercel

## 📋 Estado del Proyecto

### ✅ Completado
- [x] Diagnóstico core con 3 métricas básicas
- [x] Análisis financiero opcional con ROAS, AOV, CAC
- [x] Separación en dos capas (core + financiero)
- [x] Alertas por umbral y recomendaciones
- [x] Integración con Calendly
- [x] Tracking de eventos completo
- [x] Diseño mobile-first
- [x] Páginas de mentoría y agenda

### 🔄 En Progreso
- [ ] Dashboard de histórico (requiere Firebase)
- [ ] Autenticación Google (configuración pendiente)

### ⏳ Pendiente
- [ ] Deploy en Vercel
- [ ] Configuración de dominio
- [ ] Reglas de seguridad Firestore
- [ ] Variables de entorno de producción

## 📄 Licencia

MIT License - Ver archivo LICENSE para más detalles.