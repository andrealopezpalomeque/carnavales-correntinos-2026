<template>
  <div class="relative">
    <!-- Current Avatar -->
    <div class="relative inline-block">
      <img 
        v-if="currentAvatarUrl" 
        :src="currentAvatarUrl" 
        :alt="altText"
        :class="avatarClasses"
        class="object-cover border-4 border-gray-200"
      />
      <div 
        v-else 
        :class="avatarClasses"
        class="bg-green-500 text-white flex items-center justify-center font-bold border-4 border-gray-200"
      >
        {{ initials }}
      </div>
      
      <!-- Upload Button Overlay -->
      <div class="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 cursor-pointer"
           @click="triggerFileInput">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
      </div>
      
      <!-- Loading Overlay -->
      <div v-if="isUploading" class="absolute inset-0 bg-black bg-opacity-70 rounded-full flex items-center justify-center">
        <div class="text-center">
          <svg class="animate-spin h-6 w-6 text-white mx-auto mb-1" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          <div class="text-xs text-white">{{ uploadProgress }}%</div>
        </div>
      </div>
    </div>
    
    <!-- Edit Button -->
    <button
      v-if="showEditButton"
      @click="triggerFileInput"
      class="absolute bottom-0 right-0 bg-green-600 text-white rounded-full p-2 hover:bg-green-700 transition-colors shadow-lg"
      :disabled="isUploading"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
      </svg>
    </button>
    
    <!-- Hidden File Input -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      @change="handleFileSelect"
      class="hidden"
    />
    
    <!-- Error Message -->
    <div v-if="error" class="absolute top-full left-0 right-0 mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
      {{ error }}
    </div>
    
    <!-- Actions -->
    <div v-if="showActions" class="absolute top-full left-0 right-0 mt-2 flex space-x-2 z-10">
      <button
        @click="triggerFileInput"
        :disabled="isUploading"
        class="flex-1 px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 font-medium shadow-sm"
      >
        Cambiar foto
      </button>
      <button
        v-if="currentUrl && allowRemove"
        @click="showRemoveConfirmation"
        :disabled="isUploading"
        class="px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 font-medium shadow-sm"
      >
        Eliminar
      </button>
    </div>
    
    <!-- Remove Avatar Confirmation Modal -->
    <div v-if="showRemoveModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Eliminar foto de perfil</h3>
        <p class="text-gray-700 mb-6">
          ¿Estás seguro de que quieres eliminar tu foto de perfil?
        </p>
        
        <div class="flex gap-3">
          <button
            @click="cancelRemove"
            class="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="confirmRemove"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Props
const props = defineProps({
  currentUrl: {
    type: String,
    default: ''
  },
  altText: {
    type: String,
    default: 'Avatar'
  },
  initials: {
    type: String,
    default: 'U'
  },
  size: {
    type: String,
    default: 'lg', // sm, md, lg, xl
    validator: (value: string) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  showEditButton: {
    type: Boolean,
    default: true
  },
  showActions: {
    type: Boolean,
    default: false
  },
  allowRemove: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits(['upload-success', 'upload-error', 'remove-avatar'])

// Composables
const { processAvatar, isUploading, uploadProgress, error, createPreview, revokePreview } = useAvatarUpload()

// Refs
const fileInput = ref<HTMLInputElement | null>(null)
const previewUrl = ref<string | null>(null)
const showRemoveModal = ref(false)

// Computed
const currentAvatarUrl = computed(() => previewUrl.value || props.currentUrl)

const avatarClasses = computed(() => {
  const sizeClasses = {
    sm: 'w-12 h-12 min-w-[3rem] min-h-[3rem] text-sm',
    md: 'w-16 h-16 min-w-[4rem] min-h-[4rem] text-lg',
    lg: 'w-20 h-20 min-w-[5rem] min-h-[5rem] sm:w-24 sm:h-24 sm:min-w-[6rem] sm:min-h-[6rem] text-xl',
    xl: 'w-24 h-24 min-w-[6rem] min-h-[6rem] sm:w-32 sm:h-32 sm:min-w-[8rem] sm:min-h-[8rem] text-2xl sm:text-3xl'
  }
  
  return `${sizeClasses[props.size]} rounded-full flex-shrink-0 aspect-square`
})

// Methods
const triggerFileInput = () => {
  if (!isUploading.value && fileInput.value) {
    fileInput.value.click()
  }
}

const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) {
    return
  }
  
  try {
    // Show preview immediately
    if (previewUrl.value) {
      revokePreview(previewUrl.value)
    }
    previewUrl.value = createPreview(file)
    
    // Process file to base64
    const result = await processAvatar(file)
    
    if (result.success && result.dataUrl) {
      // Clean up preview
      if (previewUrl.value) {
        revokePreview(previewUrl.value)
        previewUrl.value = null
      }
      
      emit('upload-success', result.dataUrl)
    } else {
      // Revert preview on error
      if (previewUrl.value) {
        revokePreview(previewUrl.value)
        previewUrl.value = null
      }
      
      emit('upload-error', result.error || 'Error al procesar la imagen')
    }
  } catch (uploadError) {
    // Clean up preview
    if (previewUrl.value) {
      revokePreview(previewUrl.value)
      previewUrl.value = null
    }
    
    emit('upload-error', 'Error inesperado al procesar la imagen')
  }
  
  // Clear file input
  if (target) {
    target.value = ''
  }
}

const showRemoveConfirmation = () => {
  if (!props.currentUrl) return
  showRemoveModal.value = true
}

const confirmRemove = () => {
  showRemoveModal.value = false
  emit('remove-avatar')
}

const cancelRemove = () => {
  showRemoveModal.value = false
}

// Cleanup
onUnmounted(() => {
  if (previewUrl.value) {
    revokePreview(previewUrl.value)
  }
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