<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4 max-w-4xl">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Gestión de Email Whitelist</h1>
        <p class="text-gray-600">Administra las direcciones de email autorizadas para acceder a la aplicación</p>
      </div>

      <!-- Current Whitelist -->
      <div class="bg-white rounded-lg shadow mb-6 p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Emails Autorizados Actuales</h2>
        
        <div class="space-y-3">
          <div
            v-for="(email, index) in currentWhitelist"
            :key="index"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div class="flex items-center space-x-3">
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
              <span class="font-medium text-gray-900">{{ email }}</span>
            </div>
            <span class="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
              Activo
            </span>
          </div>
        </div>

        <div class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 class="text-sm font-medium text-blue-900 mb-2">Información</h3>
          <ul class="text-sm text-blue-800 space-y-1">
            <li>• Solo usuarios con estos emails pueden iniciar sesión</li>
            <li>• Los cambios requieren actualización del código fuente</li>
            <li>• Los emails se validan tanto en cliente como en servidor</li>
          </ul>
        </div>
      </div>

      <!-- Whitelist Statistics -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Emails Autorizados</p>
              <p class="text-2xl font-bold text-gray-900">{{ currentWhitelist.length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-red-100 rounded-lg">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Intentos Bloqueados</p>
              <p class="text-2xl font-bold text-gray-900">{{ blockedAttempts }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Usuarios Activos</p>
              <p class="text-2xl font-bold text-gray-900">{{ activeUsers }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Access Attempts -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Intentos de Acceso Recientes</h2>
        
        <div v-if="recentAttempts.length === 0" class="text-center py-8">
          <p class="text-gray-500">No hay intentos de acceso registrados</p>
        </div>
        
        <div v-else class="space-y-3">
          <div
            v-for="attempt in recentAttempts"
            :key="attempt.id"
            class="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
          >
            <div class="flex items-center space-x-4">
              <div :class="[
                'w-3 h-3 rounded-full',
                attempt.success ? 'bg-green-500' : 'bg-red-500'
              ]"></div>
              <div>
                <p class="font-medium text-gray-900">{{ attempt.email }}</p>
                <p class="text-sm text-gray-500">{{ attempt.timestamp }}</p>
              </div>
            </div>
            <span :class="[
              'px-2 py-1 text-xs font-medium rounded-full',
              attempt.success 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            ]">
              {{ attempt.success ? 'Autorizado' : 'Bloqueado' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Instructions -->
      <div class="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 class="text-lg font-medium text-yellow-900 mb-3">Cómo Modificar la Whitelist</h3>
        <div class="text-sm text-yellow-800 space-y-2">
          <p><strong>1. Archivo de configuración:</strong> <code class="bg-yellow-100 px-1 rounded">utils/emailWhitelist.ts</code></p>
          <p><strong>2. Reglas de Firestore:</strong> <code class="bg-yellow-100 px-1 rounded">firestore.rules</code></p>
          <p><strong>3. Después de modificar:</strong> Ejecutar <code class="bg-yellow-100 px-1 rounded">firebase deploy --only firestore:rules</code></p>
          <p><strong>4. Para cambios inmediatos:</strong> Reiniciar la aplicación</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ALLOWED_EMAILS } from '~/utils/emailWhitelist'
import { dbService } from '~/utils/database'

// Page meta
definePageMeta({
  middleware: 'admin',
  layout: 'default'
})

// SEO
useSeoMeta({
  title: 'Gestión de Whitelist - Admin',
  description: 'Panel de administración para gestionar emails autorizados'
})

// State
const currentWhitelist = ref(ALLOWED_EMAILS)
const blockedAttempts = ref(0)
const activeUsers = ref(0)
const recentAttempts = ref([])

// Load statistics
const loadStats = async () => {
  try {
    // This would need to be implemented with proper logging queries
    // For now, showing placeholder data
    blockedAttempts.value = 5
    activeUsers.value = 2
    
    // Mock recent attempts
    recentAttempts.value = [
      {
        id: 1,
        email: 'unauthorized@example.com',
        success: false,
        timestamp: '2 horas atrás'
      },
      {
        id: 2,
        email: 'andrealopezpalomeque@gmail.com',
        success: true,
        timestamp: '5 horas atrás'
      },
      {
        id: 3,
        email: 'msofiarriiuca@gmail.com',
        success: true,
        timestamp: '1 día atrás'
      }
    ]
  } catch (error) {
    console.error('Error loading whitelist stats:', error)
  }
}

onMounted(() => {
  loadStats()
})
</script>