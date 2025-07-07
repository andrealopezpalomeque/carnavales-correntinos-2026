# Sistema de Autenticación Mejorado - Carnavales Correntinos 2026

## Resumen de la Implementación

Este documento describe el sistema de autenticación completo implementado que combina Firebase Auth con perfiles de usuario personalizados en Firestore.

## 🏗️ Arquitectura del Sistema

### Firebase Auth vs Perfiles de Usuario

**Firebase Auth (Autenticación)**
- Maneja login/logout y verificación de identidad
- Datos básicos: UID, email, displayName, photoURL, emailVerified
- Almacenado en servidores de Firebase Auth
- Limitado a datos del proveedor de autenticación

**Perfiles de Usuario (Firestore)**
- Perfiles completos con datos personalizados
- Campos adicionales: firstName, lastName, bio, preferences, role, etc.
- Almacenado en tu base de datos Firestore
- Control total sobre estructura y datos

### Flujo de Autenticación

```
Usuario hace login → Firebase Auth autentica → Verificar/crear perfil en Firestore → Sincronizar datos
```

## 📁 Estructura de Archivos

### Composables
- `composables/useAuthEnhanced.ts` - Gestión de autenticación y perfiles
- `composables/useFileUpload.ts` - Carga de archivos (avatares)
- `composables/useNotifications.ts` - Sistema de notificaciones

### Componentes
- `components/UserProfile.vue` - Componente principal de perfil
- `components/UserProfileSetup.vue` - Configuración inicial de perfil
- `components/AvatarUpload.vue` - Carga de avatares
- `components/NotificationContainer.vue` - Contenedor de notificaciones
- `components/MenuBar.vue` - Barra de navegación (actualizada)

### Páginas
- `pages/profile/index.vue` - Página de perfil de usuario
- `pages/profile/setup.vue` - Página de configuración inicial
- `pages/admin/users.vue` - Panel de administración de usuarios
- `pages/users/index.vue` - Directorio público de usuarios

### Middleware
- `middleware/auth.ts` - Protección de rutas autenticadas
- `middleware/admin.ts` - Protección de rutas de administrador
- `middleware/guest.ts` - Redirección de usuarios autenticados

### Utilidades
- `utils/database.ts` - Servicios de base de datos centralizados
- `types/user.ts` - Definiciones TypeScript

### Configuración
- `firestore.rules` - Reglas de seguridad de Firestore
- `firestore.indexes.json` - Índices de base de datos

## 🔧 Configuración

### 1. Firebase Configuration
Asegúrate de que `firebase.json` incluye la configuración de Firestore:

```json
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  }
}
```

### 2. Environment Variables
Configura las variables de entorno en `.env`:

```env
NUXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
NUXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NUXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

## 🎯 Características Implementadas

### ✅ Autenticación Básica
- [x] Login con Google
- [x] Logout
- [x] Estado de autenticación global
- [x] Manejo de errores
- [x] Notificaciones de estado

### ✅ Gestión de Perfiles
- [x] Creación automática de perfiles
- [x] Actualización de perfiles
- [x] Sincronización con Firebase Auth
- [x] Configuración de preferencias
- [x] Configuración de privacidad

### ✅ Carga de Archivos
- [x] Carga de avatares
- [x] Redimensionamiento de imágenes
- [x] Validación de archivos
- [x] Preview en tiempo real
- [x] Eliminación de archivos

### ✅ Sistema de Roles
- [x] Roles: admin, moderator, user
- [x] Middleware de protección
- [x] Verificación de permisos
- [x] Panel de administración

### ✅ Notificaciones
- [x] Notificaciones en tiempo real
- [x] Diferentes tipos (success, error, warning, info)
- [x] Acciones en notificaciones
- [x] Auto-dismissal temporizado

### ✅ Registro de Actividad
- [x] Log de login/logout
- [x] Log de actualizaciones de perfil
- [x] Log de registro de usuarios
- [x] Metadatos de actividad

### ✅ Directorio de Usuarios
- [x] Búsqueda de usuarios
- [x] Filtros por rol
- [x] Perfiles públicos
- [x] Respeto a configuraciones de privacidad

### ✅ Seguridad
- [x] Reglas de Firestore granulares
- [x] Validación de datos
- [x] Protección de rutas
- [x] Configuraciones de privacidad

## 🚀 Uso del Sistema

### Migración del Composable Anterior

```vue
<script setup>
// ANTES
const { user, isAuthenticated, signInWithGoogle } = useAuth()

// DESPUÉS
const { 
  authUser, 
  userProfile, 
  isAuthenticated, 
  signInWithGoogle 
} = useAuthEnhanced()
</script>
```

### Protección de Rutas

```vue
<script setup>
// Para rutas que requieren autenticación
definePageMeta({
  middleware: 'auth'
})

// Para rutas de administrador
definePageMeta({
  middleware: 'admin'
})

// Para rutas solo para invitados
definePageMeta({
  middleware: 'guest'
})
</script>
```

### Usando Notificaciones

```vue
<script setup>
const { notifySuccess, notifyError } = useNotifications()

const handleAction = async () => {
  try {
    await someAction()
    notifySuccess('Éxito', 'Acción completada correctamente')
  } catch (error) {
    notifyError('Error', 'Algo salió mal')
  }
}
</script>
```

### Gestión de Perfiles

```vue
<script setup>
const { updateUserProfile, userProfile } = useAuthEnhanced()

const updateProfile = async () => {
  await updateUserProfile({
    displayName: 'Nuevo Nombre',
    bio: 'Mi nueva biografía',
    preferences: {
      theme: 'dark',
      notifications: { email: false }
    }
  })
}
</script>
```

## 📊 Estructura de Base de Datos

### Colección: users/{userId}
```typescript
{
  uid: string
  email: string
  displayName: string
  photoURL: string | null
  firstName: string | null
  lastName: string | null
  bio: string | null
  preferences: {
    theme: 'light' | 'dark' | 'system'
    language: 'es' | 'en'
    notifications: {
      email: boolean
      push: boolean
      marketing: boolean
    }
    privacy: {
      showEmail: boolean
      showProfile: boolean
    }
  }
  role: 'admin' | 'moderator' | 'user'
  isActive: boolean
  isNewUser: boolean
  createdAt: timestamp
  updatedAt: timestamp
  lastLoginAt: timestamp
}
```

### Subcolecciones

- `users/{userId}/private/{document}` - Datos privados del usuario
- `users/{userId}/notifications/{notificationId}` - Notificaciones del usuario
- `logs/{logId}` - Registro de actividad del sistema

## 🔒 Reglas de Seguridad

Las reglas implementadas permiten:

1. **Usuarios** pueden leer/escribir su propio perfil
2. **Administradores** pueden gestionar todos los usuarios
3. **Perfiles públicos** son visibles para usuarios autenticados
4. **Datos privados** solo accesibles por el propietario
5. **Logs** solo accesibles por administradores

## 🎨 Componentes de UI

### UserProfile
Componente completo de gestión de perfil con:
- Edición inline
- Carga de avatar
- Configuración de preferencias
- Estadísticas de cuenta

### AvatarUpload
Componente especializado para carga de avatares:
- Redimensionamiento automático
- Preview en tiempo real
- Validación de archivos
- Manejo de errores

### NotificationContainer
Sistema de notificaciones global:
- Múltiples tipos de notificación
- Animaciones suaves
- Acciones personalizadas
- Auto-dismissal

## 📱 Responsive Design

Todos los componentes están optimizados para:
- Desktop (1024px+)
- Tablet (768px - 1023px)  
- Mobile (< 768px)

## 🔄 Flujo de Usuario Nuevo

1. Usuario hace login con Google
2. Firebase Auth autentica
3. Sistema verifica si existe perfil en Firestore
4. Si no existe, crea perfil automáticamente
5. Marca usuario como `isNewUser: true`
6. Redirige a `/profile/setup`
7. Usuario completa configuración
8. Marca `isNewUser: false`
9. Redirige a la aplicación principal

## 🛠️ Comandos de Deployment

```bash
# Deployar reglas de Firestore
firebase deploy --only firestore:rules

# Deployar toda la aplicación
npm run build
firebase deploy

# Solo hosting
firebase deploy --only hosting
```

## 🚨 Consideraciones de Seguridad

1. **Nunca** exponer API keys en el frontend
2. **Siempre** validar datos en Firestore rules
3. **Respetar** configuraciones de privacidad
4. **Logs** de actividad para auditoría
5. **Tokens** de acceso se refrescan automáticamente

## 📈 Métricas y Analytics

El sistema registra automáticamente:
- Logins y logouts
- Actualizaciones de perfil
- Registro de nuevos usuarios
- Errores de autenticación

## 🔮 Próximas Mejoras

- [ ] Autenticación de dos factores
- [ ] OAuth con más proveedores
- [ ] Sistema de amigos/seguimiento
- [ ] Notificaciones push
- [ ] Chat en tiempo real
- [ ] Importación de contactos
- [ ] API REST para integración externa

## 📞 Soporte

Para preguntas o problemas con el sistema de autenticación:

1. Revisa los logs de Firebase Console
2. Verifica las reglas de Firestore
3. Confirma configuración de environment variables
4. Revisa este documento de implementación

---

**Última actualización:** Julio 2025  
**Versión:** 1.0.0  
**Autor:** Claude AI Assistant