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
          <div class="text-xs text-white">{{ uploadPercent }}%</div>
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
    <div v-if="showActions" class="absolute top-full left-0 right-0 mt-2 flex space-x-2">
      <button
        @click="triggerFileInput"
        :disabled="isUploading"
        class="flex-1 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
      >
        Cambiar foto
      </button>
      <button
        v-if="currentAvatarUrl && allowRemove"
        @click="removeAvatar"
        :disabled="isUploading"
        class="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
      >
        Eliminar
      </button>
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
  },
  userId: {
    type: String,
    required: true
  }
})

// Emits
const emit = defineEmits(['upload-success', 'upload-error', 'remove-avatar'])

// Composables
const { uploadAvatar, deleteFile, isUploading, uploadProgress, error, createPreview, revokePreview } = useFileUpload()

// Refs
const fileInput = ref<HTMLInputElement | null>(null)
const previewUrl = ref<string | null>(null)

// Computed
const currentAvatarUrl = computed(() => previewUrl.value || props.currentUrl)

const uploadPercent = computed(() => {
  return Math.round(uploadProgress.value.percentage)
})

const avatarClasses = computed(() => {
  const sizeClasses = {
    sm: 'w-12 h-12 text-sm',
    md: 'w-16 h-16 text-lg',
    lg: 'w-20 h-20 text-xl',
    xl: 'w-32 h-32 text-3xl'
  }
  
  return `${sizeClasses[props.size]} rounded-full`
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
  
  if (!file) return
  
  try {
    // Show preview immediately
    if (previewUrl.value) {
      revokePreview(previewUrl.value)
    }
    previewUrl.value = createPreview(file)
    
    // Upload file
    const result = await uploadAvatar(file, props.userId)
    
    if (result.success && result.url) {
      // Clean up preview
      if (previewUrl.value) {
        revokePreview(previewUrl.value)
        previewUrl.value = null
      }
      
      emit('upload-success', result.url)
    } else {
      // Revert preview on error
      if (previewUrl.value) {
        revokePreview(previewUrl.value)
        previewUrl.value = null
      }
      
      emit('upload-error', result.error || 'Error al subir la imagen')
    }
  } catch (uploadError) {
    console.error('Error in file upload:', uploadError)
    
    // Clean up preview
    if (previewUrl.value) {
      revokePreview(previewUrl.value)
      previewUrl.value = null
    }
    
    emit('upload-error', 'Error inesperado al subir la imagen')
  }
  
  // Clear file input
  if (target) {
    target.value = ''
  }
}

const removeAvatar = async () => {
  if (!props.currentUrl) return
  
  const confirmed = confirm('¿Estás seguro de que quieres eliminar tu foto de perfil?')
  if (!confirmed) return
  
  try {
    const result = await deleteFile(props.currentUrl)
    
    if (result.success) {
      emit('remove-avatar')
    } else {
      emit('upload-error', result.error || 'Error al eliminar la imagen')
    }
  } catch (deleteError) {
    console.error('Error removing avatar:', deleteError)
    emit('upload-error', 'Error inesperado al eliminar la imagen')
  }
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