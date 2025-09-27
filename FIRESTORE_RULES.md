# 🔥 Reglas de Firestore para Sharings

## 📋 Reglas actualizadas

Agrega estas reglas a tu Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Solo usuarios autenticados pueden leer/escribir sus propios datos
    match /users/{userId}/metrics/{document} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Colección de sharings - solo lectura para admins, escritura para usuarios autenticados
    match /sharings/{document} {
      allow read: if request.auth != null && request.auth.token.admin == true;
      allow write: if request.auth != null;
    }
  }
}
```

## 🎯 Qué se guarda en sharings

Cada vez que un usuario comparte, se guarda:

```javascript
{
  uid: "user123",
  email: "user@example.com",
  diagnosis: "trafico",
  visits: 1000,
  carts: 50,
  orders: 15,
  atc: 0.05,
  cb: 0.30,
  cr: 0.015,
  shared_at: "2025-01-27T18:20:43Z",
  platform: "whatsapp"
}
```

## 📊 Beneficios del tracking

- **Analytics** - Saber cuántos usuarios comparten
- **Viral growth** - Identificar usuarios que más comparten
- **Checklist delivery** - Enviar checklist a usuarios que compartieron
- **Métricas** - Ver qué diagnósticos se comparten más

## 🔧 Implementación

La función `saveSharing` ya está implementada y se ejecuta automáticamente cuando el usuario comparte por WhatsApp.
