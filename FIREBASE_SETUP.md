# 🔥 Configuración Firebase para Producción

## 📋 Pasos para configurar Firebase

### 1. Crear proyecto en Firebase Console
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. Habilita Authentication (Google)
4. Habilita Firestore Database

### 2. Obtener credenciales
1. En Firebase Console → Project Settings → General
2. Scroll down a "Your apps" → Web app
3. Copia las credenciales

### 3. Crear archivo .env.local
Crea un archivo `.env.local` en la raíz del proyecto con:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=tu-api-key-aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### 4. Configurar reglas de Firestore
En Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Solo usuarios autenticados pueden leer/escribir sus propios datos
    match /users/{userId}/metrics/{document} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 5. Configurar Authentication
En Firebase Console → Authentication → Sign-in method:
1. Habilita "Google"
2. Agrega tu dominio de producción
3. Configura OAuth consent screen

### 6. Verificar configuración
```bash
# Instalar dependencias
npm install

# Ejecutar tests
npm run test:uat

# Build para producción
npm run build

# Probar en desarrollo
npm run dev
```

## 🚀 Deploy a Vercel

### 1. Conectar con Vercel
1. Ve a [Vercel](https://vercel.com/)
2. Conecta tu repositorio de GitHub
3. Configura las variables de entorno en Vercel

### 2. Variables de entorno en Vercel
En Vercel Dashboard → Project Settings → Environment Variables:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

### 3. Deploy
```bash
# Push a main branch
git push origin main

# Vercel automáticamente hace deploy
```

## ✅ Checklist de Producción

- [ ] Proyecto Firebase creado
- [ ] Authentication habilitado
- [ ] Firestore configurado
- [ ] Reglas de Firestore configuradas
- [ ] Variables de entorno configuradas
- [ ] Tests UAT pasando
- [ ] Build exitoso
- [ ] Deploy a Vercel
- [ ] Dominio configurado
- [ ] Funcionalidad probada en producción

## 🔧 Troubleshooting

### Si Firebase no conecta:
- Verificar que las variables de entorno estén correctas
- Verificar que el proyecto esté activo en Firebase
- Verificar que las reglas de Firestore permitan acceso

### Si la autenticación falla:
- Verificar que Google OAuth esté habilitado
- Verificar que el dominio esté autorizado
- Verificar que las claves sean correctas

### Si el guardado no funciona:
- Verificar reglas de Firestore
- Verificar que el usuario esté autenticado
- Verificar la estructura de datos
