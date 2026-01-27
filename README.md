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

- **Frontend**: Next.js 15+ (App Router), TypeScript, Tailwind CSS
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

## 🔧 Troubleshooting

### Error de permisos al iniciar el servidor (macOS)

**¿Dejó de funcionar después de actualizar macOS?** Las actualizaciones suelen resetear permisos de red y privacidad. → **Guía rápida post-actualización:** [`MACOS_PERMISOS.md`](./MACOS_PERMISOS.md#-se-te-rompió-después-de-actualizar-macos) (sección “¿Se te rompió después de actualizar macOS?”).

Si encuentras el error `EPERM: operation not permitted` al ejecutar `npm run dev`, sigue estos pasos:

#### 1. Configurar permisos del Firewall en macOS

**Paso a paso:**

1. **Abrir Preferencias del Sistema**:
   - Clic en el menú Apple (🍎) → **Preferencias del Sistema**
   - O busca "Preferencias del Sistema" con Spotlight (⌘ + Espacio)

2. **Ir a Seguridad y Privacidad**:
   - Clic en **Seguridad y Privacidad** (o "Security & Privacy")
   - Si está bloqueado, haz clic en el candado 🔒 y escribe tu contraseña

3. **Configurar el Firewall**:
   - Ve a la pestaña **Firewall**
   - Si el firewall está **desactivado**, puedes activarlo o dejarlo desactivado (recomendado para desarrollo)
   - Si está **activado**, haz clic en **Opciones del Firewall...**

4. **Permitir Node.js**:
   - En la lista de aplicaciones, busca **Node** o **node**
   - Si aparece, asegúrate de que esté configurado como **Permitir conexiones entrantes**
   - Si no aparece, haz clic en el botón **+** y navega a:
     ```
     /usr/local/bin/node
     ```
     O si usas nvm:
     ```
     ~/.nvm/versions/node/[tu-versión]/bin/node
     ```
   - Selecciona **Permitir conexiones entrantes**

5. **Aplicar cambios**:
   - Haz clic en **OK** para guardar

#### 2. Verificar si el puerto está en uso

```bash
# Verificar qué proceso está usando el puerto 3000
lsof -ti:3000

# Si hay un proceso, ver detalles:
lsof -i:3000

# Para detener el proceso (reemplaza PID con el número que aparezca):
kill -9 PID
```

#### 3. Usar un puerto diferente (solución rápida)

Si el problema persiste, usa un puerto diferente:

```bash
PORT=3001 npm run dev
```

Luego accede a `http://localhost:3001`

#### 4. Verificar permisos de Terminal/Editor

Si estás ejecutando desde Cursor o VS Code, asegúrate de que tengan permisos de red:

1. **Preferencias del Sistema** → **Seguridad y Privacidad** → **Privacidad**
2. Busca **Acceso completo al disco** o **Full Disk Access**
3. Asegúrate de que **Terminal** (o tu editor) esté en la lista y habilitado

#### 5. Solución alternativa: Ejecutar desde Terminal nativa

Si nada funciona, ejecuta el servidor directamente desde la Terminal de macOS:

```bash
cd /Users/williambastidas/Documents/Fuentes/ecom-dx
npm run dev
```

Esto evita posibles restricciones de permisos de aplicaciones de terceros.

### Error: Cannot find module

Si encuentras errores de módulos no encontrados:

```bash
# Eliminar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Variables de entorno no cargadas

Asegúrate de que el archivo `.env.local` existe y contiene todas las variables necesarias. Ver `FIREBASE_SETUP.md` para más detalles.

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

El deploy **habitual** de este proyecto se hace **desde la máquina local** con la CLI de Vercel. Los pushes a GitHub pueden disparar deploys automáticos si el repo está conectado, pero el flujo estándar que usamos es **desplegar con `npx vercel --prod`** desde la carpeta del proyecto.

---

### **Forma habitual: deploy desde aquí (CLI)**

Desde la raíz del proyecto, en tu terminal:

```bash
npx vercel --prod
```

Eso sube el código actual, hace el build en Vercel y publica en producción. Es la forma **normal** que usamos para publicar cambios.

**Requisitos:**

- Estar en la carpeta del proyecto (por ejemplo `ecom-dx`).
- Tener el proyecto ya vinculado a Vercel (ver “Primera vez” más abajo).
- Estar autenticado en Vercel (ver “Autenticación y token” si aparece error de token).

---

### **Autenticación y token**

Si al ejecutar `npx vercel --prod` ves:

```text
Error: The specified token is not valid. Use `vercel login` to generate a new token.
```

el token de Vercel ya no es válido (caducado, revocado o nunca configurado). Hay que volver a iniciar sesión:

```bash
npx vercel logout
npx vercel login
```

Durante `vercel login` te pedirá enlazar con email o con GitHub y abrirá el navegador para autorizar. Cuando termines, ejecutá de nuevo:

```bash
npx vercel --prod
```

**Token desde el dashboard (opcional):**

1. Ir a [vercel.com/account/tokens](https://vercel.com/account/tokens).
2. Crear un token y copiarlo.
3. En la misma sesión donde vas a hacer deploy:
   ```bash
   export VERCEL_TOKEN="tu_nuevo_token"
   npx vercel --prod
   ```

---

### **Primera vez: conectar repo a Vercel**

Antes de poder usar `npx vercel --prod` con este proyecto, el proyecto tiene que existir en Vercel (una sola vez):

1. Entrá a [vercel.com/dashboard](https://vercel.com/dashboard).
2. **Add New…** → **Project** (o **Import Project**).
3. En **Import Git Repository**:
   - Conectá GitHub si hace falta (**Connect Git Provider** → GitHub → autorizar).
   - Elegí el repo **wibastidas/ecom-dx** (o el tuyo).
4. **Configure Project**:
   - **Framework Preset**: Next.js.
   - **Root Directory**: vacío si el código está en la raíz.
   - **Build Command**: `npm run build`.
   - **Output Directory**: `.next`.
5. **Environment Variables**: cargá las de `.env.local` en **Project Settings** → **Environment Variables** (Firebase, analytics, etc.).
6. **Deploy**: así se crea el proyecto y se hace el primer deploy.

Después de eso, **el flujo normal es seguir desplegando con `npx vercel --prod`** desde la carpeta del proyecto.

---

### **Deploy automático por push (alternativa)**

Si el repositorio está conectado en Vercel, cada push a la rama de producción también puede generar un deploy automático. Desde la carpeta del proyecto:

```bash
git add .
git commit -m "Tu mensaje"
git push origin main
```

Vercel detecta el push a `main` y lanza un nuevo deploy. Los builds se ven en **Vercel** → tu proyecto → **Deployments**.

Aun así, **la forma estándar que usamos para publicar es `npx vercel --prod` desde aquí**, porque nos permite decidir exactamente cuándo se publica y no depender del push.

---

### **Si el deploy falla o no se ejecuta**

Revisar en este orden:

1. **Token / login**  
   Si usás `npx vercel --prod`, asegurate de estar logueado (`npx vercel login`). Si usás `VERCEL_TOKEN`, que sea un token válido y reciente.

2. **Rama en Vercel**  
   Vercel → proyecto → **Settings** → **Git** → **Production Branch** debe ser `main` (o la rama que uses para producción).

3. **Repo conectado**  
   En **Settings** → **Git** tiene que estar el repo de GitHub. Si no, hay que importar de nuevo el mismo repo.

4. **Push a GitHub**  
   Si confiás en el deploy por push: `git push origin main` debe terminar sin error y los commits tienen que verse en GitHub en la rama correcta.

5. **Logs en Vercel**  
   **Deployments** → el deployment que corresponda → **Building** / **Logs** para ver si falla el build, variables de entorno, etc.

---

### **Configuración de producción (referencia)**

- **Dominio**: `ecom-dx.vercel.app` (o el que tenga tu proyecto en Vercel).
- **Variables de entorno**: Vercel → proyecto → **Settings** → **Environment Variables**.
- **Framework**: Next.js.
- **Build command**: `npm run build`.
- **Output directory**: `.next`.

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
- [ ] Configuración de dominio personalizado
- [ ] Reglas de seguridad Firestore

## 📄 Licencia

MIT License - Ver archivo LICENSE para más detalles.