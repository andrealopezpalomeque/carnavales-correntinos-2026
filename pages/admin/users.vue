<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4 max-w-7xl">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Gestión de Usuarios</h1>
        <p class="text-gray-600">Administra usuarios, roles y permisos del sistema</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Usuarios</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.total }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Usuarios Activos</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.active }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-yellow-100 rounded-lg">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Nuevos Usuarios</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.newUsers }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 rounded-lg">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Administradores</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.admins }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="bg-white rounded-lg shadow mb-6 p-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Search -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <input
              v-model="searchTerm"
              type="text"
              placeholder="Buscar por nombre o email..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <!-- Role Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Rol</label>
            <select
              v-model="roleFilter"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Todos los roles</option>
              <option value="admin">Administrador</option>
              <option value="moderator">Moderador</option>
              <option value="user">Usuario</option>
            </select>
          </div>

          <!-- Status Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select
              v-model="statusFilter"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Todos</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
              <option value="new">Nuevos</option>
            </select>
          </div>

          <!-- Actions -->
          <div class="flex items-end space-x-2">
            <button
              @click="refreshUsers"
              :disabled="isLoading"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <svg v-if="isLoading" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              <span v-else>Actualizar</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Users Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">
            Lista de Usuarios ({{ filteredUsers.length }})
          </h3>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registrado
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Último acceso
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="user in paginatedUsers" :key="user.uid" class="hover:bg-gray-50">
                <!-- User Info -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <img 
                      v-if="user.photoURL" 
                      :src="user.photoURL" 
                      :alt="user.displayName"
                      class="w-10 h-10 rounded-full object-cover"
                    />
                    <div 
                      v-else 
                      class="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-medium"
                    >
                      {{ getInitials(user.displayName || user.email) }}
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ user.displayName || 'Sin nombre' }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ user.firstName }} {{ user.lastName }}
                      </div>
                    </div>
                  </div>
                </td>

                <!-- Email -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ user.email }}
                </td>

                <!-- Role -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <select
                    :value="user.role"
                    @change="updateUserRole(user.uid, $event.target.value)"
                    class="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="user">Usuario</option>
                    <option value="moderator">Moderador</option>
                    <option value="admin">Administrador</option>
                  </select>
                </td>

                <!-- Status -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center space-x-2">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                          :class="{
                            'bg-green-100 text-green-800': user.isActive,
                            'bg-red-100 text-red-800': !user.isActive
                          }">
                      {{ user.isActive ? 'Activo' : 'Inactivo' }}
                    </span>
                    <span v-if="user.isNewUser" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      Nuevo
                    </span>
                  </div>
                </td>

                <!-- Created Date -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(user.createdAt) }}
                </td>

                <!-- Last Login -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(user.lastLoginAt) }}
                </td>

                <!-- Actions -->
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end space-x-2">
                    <button
                      @click="viewUser(user)"
                      class="text-green-600 hover:text-green-900 p-1"
                      title="Ver perfil"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                    </button>
                    
                    <button
                      @click="toggleUserStatus(user)"
                      :class="user.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'"
                      class="p-1"
                      :title="user.isActive ? 'Desactivar' : 'Activar'"
                    >
                      <svg v-if="user.isActive" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636"/>
                      </svg>
                      <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </button>
                    
                    <button
                      @click="deleteUser(user)"
                      class="text-red-600 hover:text-red-900 p-1"
                      title="Eliminar usuario"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="px-6 py-4 border-t border-gray-200">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Mostrando {{ (currentPage - 1) * pageSize + 1 }} a {{ Math.min(currentPage * pageSize, filteredUsers.length) }} de {{ filteredUsers.length }} usuarios
            </div>
            <div class="flex space-x-2">
              <button
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <span class="px-3 py-1 text-sm bg-green-100 text-green-800 rounded">
                {{ currentPage }} / {{ totalPages }}
              </span>
              <button
                @click="currentPage++"
                :disabled="currentPage === totalPages"
                class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- User Detail Modal -->
    <div v-if="selectedUser" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="closeModal">
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full m-4" @click.stop>
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Detalles del Usuario</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Nombre completo</label>
              <p class="text-sm text-gray-900">{{ selectedUser.displayName || 'Sin nombre' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <p class="text-sm text-gray-900">{{ selectedUser.email }}</p>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Biografía</label>
            <p class="text-sm text-gray-900">{{ selectedUser.bio || 'Sin biografía' }}</p>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Rol</label>
              <p class="text-sm text-gray-900 capitalize">{{ selectedUser.role }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Estado</label>
              <p class="text-sm text-gray-900">{{ selectedUser.isActive ? 'Activo' : 'Inactivo' }}</p>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Fecha de registro</label>
              <p class="text-sm text-gray-900">{{ formatDate(selectedUser.createdAt) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Último acceso</label>
              <p class="text-sm text-gray-900">{{ formatDate(selectedUser.lastLoginAt) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { dbService } from '~/utils/database'
import type { UserProfile } from '~/types/user'

// Page meta
definePageMeta({
  middleware: 'admin',
  layout: 'default'
})

// SEO
useSeoMeta({
  title: 'Administración de Usuarios - Carnavales Correntinos 2026',
  description: 'Panel de administración para gestionar usuarios del sistema'
})

// State
const users = ref<UserProfile[]>([])
const isLoading = ref(false)
const selectedUser = ref<UserProfile | null>(null)

// Filters
const searchTerm = ref('')
const roleFilter = ref('')
const statusFilter = ref('')

// Pagination
const currentPage = ref(1)
const pageSize = ref(10)

// Computed
const stats = computed(() => ({
  total: users.value.length,
  active: users.value.filter(u => u.isActive).length,
  newUsers: users.value.filter(u => u.isNewUser).length,
  admins: users.value.filter(u => u.role === 'admin').length
}))

const filteredUsers = computed(() => {
  let filtered = users.value

  // Search filter
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    filtered = filtered.filter(user =>
      user.displayName?.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.firstName?.toLowerCase().includes(term) ||
      user.lastName?.toLowerCase().includes(term)
    )
  }

  // Role filter
  if (roleFilter.value) {
    filtered = filtered.filter(user => user.role === roleFilter.value)
  }

  // Status filter
  if (statusFilter.value) {
    switch (statusFilter.value) {
      case 'active':
        filtered = filtered.filter(user => user.isActive)
        break
      case 'inactive':
        filtered = filtered.filter(user => !user.isActive)
        break
      case 'new':
        filtered = filtered.filter(user => user.isNewUser)
        break
    }
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / pageSize.value))

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredUsers.value.slice(start, end)
})

// Methods
const getInitials = (name: string): string => {
  if (!name) return 'U'
  return name.split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
}

const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const refreshUsers = async () => {
  try {
    isLoading.value = true
    users.value = await dbService.getUsers()
  } catch (error) {
    console.error('Error loading users:', error)
  } finally {
    isLoading.value = false
  }
}

const updateUserRole = async (userId: string, newRole: string) => {
  try {
    await dbService.updateUserProfile(userId, { role: newRole })
    await refreshUsers()
  } catch (error) {
    console.error('Error updating user role:', error)
    alert('Error al actualizar el rol del usuario')
  }
}

const toggleUserStatus = async (user: UserProfile) => {
  const newStatus = !user.isActive
  const action = newStatus ? 'activar' : 'desactivar'
  
  if (confirm(`¿Estás seguro de que quieres ${action} a ${user.displayName || user.email}?`)) {
    try {
      await dbService.updateUserProfile(user.uid, { isActive: newStatus })
      await refreshUsers()
    } catch (error) {
      console.error('Error updating user status:', error)
      alert('Error al actualizar el estado del usuario')
    }
  }
}

const deleteUser = async (user: UserProfile) => {
  if (confirm(`¿Estás ABSOLUTAMENTE seguro de que quieres eliminar a ${user.displayName || user.email}? Esta acción no se puede deshacer.`)) {
    try {
      await dbService.deleteUserProfile(user.uid)
      await refreshUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Error al eliminar el usuario')
    }
  }
}

const viewUser = (user: UserProfile) => {
  selectedUser.value = user
}

const closeModal = () => {
  selectedUser.value = null
}

// Lifecycle
onMounted(() => {
  refreshUsers()
})
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>