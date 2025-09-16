# Configuración del Proyecto

## Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Analytics (Opcional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

## Configuración de Firebase

1. **Crear proyecto en Firebase Console**:
   - Ve a [Firebase Console](https://console.firebase.google.com)
   - Crea un nuevo proyecto
   - Habilita Authentication (Google) y Firestore

2. **Obtener credenciales**:
   - Ve a Project Settings > General
   - Copia las credenciales de configuración web
   - Péguelas en tu archivo `.env.local`

3. **Configurar reglas de Firestore**:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
         match /metrics/{docId} {
           allow read, write: if request.auth != null && request.auth.uid == userId;
         }
       }
     }
   }
   ```

## Configuración de Calendly

1. **Crear cuenta en Calendly**:
   - Ve a [calendly.com](https://calendly.com)
   - Crea una cuenta gratuita
   - Configura tu disponibilidad

2. **Actualizar URL en el código**:
   - Abre `src/app/agenda/page.tsx`
   - Reemplaza `CALENDLY_URL` con tu URL de Calendly

## Deploy en Vercel

1. **Conectar repositorio**:
   - Sube el código a GitHub
   - Conecta el repositorio a Vercel

2. **Configurar variables de entorno**:
   - Ve a Project Settings > Environment Variables
   - Agrega todas las variables de `.env.local`

3. **Configurar dominio**:
   - Ve a Project Settings > Domains
   - Agrega `app.williambastidas.com`

## Comandos útiles

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar en producción
npm start

# Linting
npm run lint
```
