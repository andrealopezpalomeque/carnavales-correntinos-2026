<template>
  <div class="bg-white rounded-lg shadow-md p-4 sm:p-6">
    <div class="flex items-start space-x-3 sm:space-x-4">
      <!-- User Avatar -->
      <img 
        v-if="authUser?.photoURL" 
        :src="authUser.photoURL" 
        :alt="authUser.displayName || 'Usuario'"
        class="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"
      />
      <div 
        v-else 
        class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-500 text-white flex items-center justify-center text-base sm:text-lg font-bold flex-shrink-0"
      >
        {{ getInitials(authUser?.displayName || authUser?.email || 'U') }}
      </div>

      <!-- Post Form -->
      <div class="flex-1">
        <form @submit.prevent="createPost" class="space-y-4">
          <!-- Post Content -->
          <div>
            <label for="post-content" class="sr-only">¿Qué estás pensando?</label>
            <textarea
              id="post-content"
              v-model="postContent"
              :placeholder="getPlaceholderText()"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              :maxlength="POST_CONSTRAINTS.MAX_CONTENT_LENGTH"
              @input="updateCharacterCount"
            />
            <div class="flex justify-between items-center mt-2">
              <span class="text-sm text-gray-500">
                {{ characterCount }}/{{ POST_CONSTRAINTS.MAX_CONTENT_LENGTH }}
              </span>
              <span v-if="characterCount > POST_CONSTRAINTS.MAX_CONTENT_LENGTH * 0.9" class="text-sm text-orange-500">
                Acercándose al límite
              </span>
            </div>
          </div>

          <!-- Post Options -->
          <div class="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 sm:gap-4">
            <!-- Privacy Setting -->
            <div class="flex items-center space-x-2 w-full sm:w-auto">
              <label for="privacy" class="text-sm font-medium text-gray-700 shrink-0">Privacidad:</label>
              <select
                id="privacy"
                v-model="postPrivacy"
                class="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-500 flex-1 sm:flex-none"
              >
                <option value="public">🌍 Público</option>
                <option value="friends">👥 Solo amigos</option>
                <option v-if="userProfile?.favoriteComparsa" value="comparsa">
                  🎆 Mi comparsa ({{ userProfile.favoriteComparsa }})
                </option>
                <option v-if="userProfile?.favoriteAgrupacion" value="agrupacion">
                  🎵 Mi agrupación ({{ userProfile.favoriteAgrupacion }})
                </option>
              </select>
            </div>

            <!-- Location (Optional) -->
            <div class="flex items-center space-x-2 w-full sm:w-auto">
              <label for="location" class="text-sm font-medium text-gray-700 shrink-0">📍</label>
              <select
                id="location"
                v-model="postLocation"
                class="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-500 flex-1 sm:flex-none"
              >
                <option value="">Seleccionar ubicación...</option>
                <optgroup label="🏛️ Corrientes Capital">
                  <option value="Centro de Corrientes">Centro de Corrientes</option>
                  <option value="Costanera de Corrientes">Costanera de Corrientes</option>
                  <option value="Plaza 25 de Mayo">Plaza 25 de Mayo</option>
                  <option value="Puente General Belgrano">Puente General Belgrano</option>
                  <option value="Teatro Juan de Vera">Teatro Juan de Vera</option>
                </optgroup>
                <optgroup label="🎭 Lugares de Carnaval">
                  <option value="Corsódromo">Corsódromo</option>
                  <option value="Anfiteatro Cocomarola">Anfiteatro Cocomarola</option>
                  <option value="Plaza de la Cruz">Plaza de la Cruz</option>
                  <option value="Boulevard Pocho Roch">Boulevard Pocho Roch</option>
                  <option value="Centro Cultural Alternativo">Centro Cultural Alternativo</option>
                </optgroup>
                <optgroup label="🏘️ Barrios">
                  <option value="Barrio San Benito">Barrio San Benito</option>
                  <option value="Barrio Pirayuí">Barrio Pirayuí</option>
                  <option value="Barrio Quilmes">Barrio Quilmes</option>
                  <option value="Barrio Esperanza">Barrio Esperanza</option>
                  <option value="Barrio San Cayetano">Barrio San Cayetano</option>
                </optgroup>
                <optgroup label="🌊 Zona Costera">
                  <option value="Playa Arazaty">Playa Arazaty</option>
                  <option value="Punta Arazaty">Punta Arazaty</option>
                  <option value="Riachuelo">Riachuelo</option>
                  <option value="Puerto de Corrientes">Puerto de Corrientes</option>
                </optgroup>
                <optgroup label="🏞️ Interior">
                  <option value="Empedrado">Empedrado</option>
                  <option value="Bella Vista">Bella Vista</option>
                  <option value="Goya">Goya</option>
                  <option value="Mercedes">Mercedes</option>
                  <option value="Paso de los Libres">Paso de los Libres</option>
                  <option value="Monte Caseros">Monte Caseros</option>
                </optgroup>
                <optgroup label="✍️ Personalizada">
                  <option value="custom">Escribir ubicación personalizada...</option>
                </optgroup>
              </select>
              <!-- Custom location input (shown when "custom" is selected) -->
              <input
                v-if="postLocation === 'custom'"
                v-model="customLocation"
                type="text"
                placeholder="Escribir ubicación..."
                class="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-500 flex-1 sm:flex-none ml-2"
                :maxlength="POST_CONSTRAINTS.MAX_LOCATION_LENGTH"
              />
            </div>
          </div>

          <!-- Tags (Optional) -->
          <div v-if="showAdvancedOptions">
            <label for="tags" class="block text-sm font-medium text-gray-700 mb-1">
              Etiquetas (separadas por comas)
            </label>
            <input
              id="tags"
              v-model="postTags"
              type="text"
              placeholder="#carnaval #comparsa #fiesta"
              class="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center justify-between pt-2">
            <div class="flex items-center space-x-2">
              <!-- Toggle Advanced Options -->
              <button
                type="button"
                @click="showAdvancedOptions = !showAdvancedOptions"
                class="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"/>
                </svg>
                <span>{{ showAdvancedOptions ? 'Menos opciones' : 'Más opciones' }}</span>
              </button>

              <!-- Character Count Warning -->
              <span v-if="isNearLimit" class="text-sm text-orange-500">
                ⚠️ Cerca del límite
              </span>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="!canSubmit || isSubmitting"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
            >
              <svg v-if="isSubmitting" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              <span>{{ isSubmitting ? 'Publicando...' : 'Publicar' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="mt-4 bg-red-50 border border-red-200 rounded-md p-3">
      <p class="text-red-700 text-sm">{{ error }}</p>
    </div>

    <!-- Success Message -->
    <div v-if="success" class="mt-4 bg-green-50 border border-green-200 rounded-md p-3">
      <p class="text-green-700 text-sm">¡Publicación creada exitosamente! 🎉</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { posts } from '~/utils/postService'
import { POST_CONSTRAINTS, type PostPrivacy, type CreatePostData } from '~/types/post'

// Composables
const { authUser, userProfile } = useAuthEnhanced()

// Emits
const emit = defineEmits<{
  postCreated: [post: any]
}>()

// Local state
const postContent = ref('')
const postPrivacy = ref<PostPrivacy>('public')
const postLocation = ref('')
const customLocation = ref('')
const postTags = ref('')
const showAdvancedOptions = ref(false)
const isSubmitting = ref(false)
const error = ref('')
const success = ref(false)

// Computed
const characterCount = computed(() => postContent.value.length)
const isNearLimit = computed(() => characterCount.value > POST_CONSTRAINTS.MAX_CONTENT_LENGTH * 0.9)
const canSubmit = computed(() => {
  return postContent.value.trim().length >= POST_CONSTRAINTS.MIN_CONTENT_LENGTH &&
         postContent.value.length <= POST_CONSTRAINTS.MAX_CONTENT_LENGTH &&
         !isSubmitting.value
})

// Methods
const getInitials = (name: string): string => {
  if (!name) return 'U'
  return name.split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
}

const getPlaceholderText = (): string => {
  const placeholders = [
    '¿Qué estás pensando sobre el carnaval?',
    'Comparte tus preparativos para el carnaval...',
    '¿Cómo van los ensayos?',
    'Cuéntanos sobre tu comparsa favorita...',
    '¿Qué planes tienes para el carnaval?'
  ]
  return placeholders[Math.floor(Math.random() * placeholders.length)]
}

const updateCharacterCount = () => {
  // This is called on input to update the character count
  // The computed property handles the actual counting
}

const parseTags = (tagString: string): string[] => {
  if (!tagString.trim()) return []
  
  return tagString
    .split(',')
    .map(tag => tag.trim().replace(/^#/, '')) // Remove leading # if present
    .filter(tag => tag.length > 0)
    .slice(0, POST_CONSTRAINTS.MAX_TAGS) // Limit number of tags
    .map(tag => tag.substring(0, POST_CONSTRAINTS.MAX_TAG_LENGTH)) // Limit tag length
}

const resetForm = () => {
  postContent.value = ''
  postPrivacy.value = 'public'
  postLocation.value = ''
  customLocation.value = ''
  postTags.value = ''
  showAdvancedOptions.value = false
  error.value = ''
}

const createPost = async () => {
  if (!canSubmit.value || !authUser.value) return

  try {
    isSubmitting.value = true
    error.value = ''
    success.value = false

    console.log('📝 Creating post for user:', authUser.value.uid)

    // Determine the final location value
    const finalLocation = postLocation.value === 'custom' 
      ? customLocation.value.trim() 
      : postLocation.value.trim()
    
    const postData: CreatePostData = {
      type: 'text',
      content: postContent.value.trim(),
      privacy: postPrivacy.value,
      location: finalLocation || undefined,
      tags: parseTags(postTags.value)
    }

    console.log('📄 Post data:', postData)

    const result = await posts.create(authUser.value.uid, postData)
    console.log('🔄 Post creation result:', result)

    if (result.success && result.data) {
      success.value = true
      console.log('✅ Post created successfully:', result.data)
      emit('postCreated', result.data)
      
      // Reset form after successful creation
      setTimeout(() => {
        resetForm()
        success.value = false
      }, 2000)
    } else {
      console.error('❌ Post creation failed:', result.error)
      error.value = result.error || 'Error al crear la publicación'
    }
  } catch (err: any) {
    console.error('❌ Error creating post:', err)
    error.value = 'Error inesperado al crear la publicación'
  } finally {
    isSubmitting.value = false
  }
}

// Watch for privacy setting based on user's carnival preferences
watch([userProfile], ([newProfile]) => {
  if (newProfile && (newProfile.favoriteComparsa || newProfile.favoriteAgrupacion)) {
    // Keep current selection, just reactive options will show
  }
}, { immediate: true })
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

/* Custom scrollbar for textarea */
textarea::-webkit-scrollbar {
  width: 6px;
}

textarea::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

textarea::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

textarea::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>