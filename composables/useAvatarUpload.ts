import { ref } from 'vue'

export interface AvatarUploadResult {
  success: boolean
  dataUrl?: string
  error?: string
}

export const useAvatarUpload = () => {
  const isUploading = ref(false)
  const uploadProgress = ref(0)
  const error = ref<string | null>(null)

  // Validate file
  const validateFile = (file: File): { valid: boolean; error?: string } => {
    const maxSize = 2 * 1024 * 1024 // 2MB limit
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']

    if (!file) {
      return { valid: false, error: 'No se seleccionó ningún archivo' }
    }

    if (file.size > maxSize) {
      return { valid: false, error: 'El archivo debe ser menor a 2MB' }
    }

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Tipo de archivo no permitido. Use JPG, PNG o WebP' }
    }

    return { valid: true }
  }

  // Resize and compress image
  const resizeImage = (file: File, maxWidth: number = 300, maxHeight: number = 300, quality: number = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let { width, height } = img
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }

        canvas.width = width
        canvas.height = height

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height)
        
        // Convert to base64 with compression
        const dataUrl = canvas.toDataURL(file.type, quality)
        resolve(dataUrl)
      }

      img.onerror = () => reject(new Error('Error procesando la imagen'))
      img.src = URL.createObjectURL(file)
    })
  }

  // Process avatar upload
  const processAvatar = async (file: File): Promise<AvatarUploadResult> => {
    try {
      isUploading.value = true
      error.value = null
      uploadProgress.value = 0

      // Validate file
      const validation = validateFile(file)
      if (!validation.valid) {
        return { success: false, error: validation.error }
      }

      uploadProgress.value = 25

      // Resize and compress image
      const dataUrl = await resizeImage(file)
      uploadProgress.value = 75

      // Simulate upload completion
      await new Promise(resolve => setTimeout(resolve, 200))
      uploadProgress.value = 100

      return { success: true, dataUrl }
    } catch (uploadError: any) {
      const errorMessage = uploadError.message || 'Error al procesar la imagen'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isUploading.value = false
      setTimeout(() => {
        uploadProgress.value = 0
      }, 1000)
    }
  }

  // Generate preview URL for file
  const createPreview = (file: File): string => {
    return URL.createObjectURL(file)
  }

  // Cleanup preview URL
  const revokePreview = (url: string): void => {
    URL.revokeObjectURL(url)
  }

  return {
    // State
    isUploading: readonly(isUploading),
    uploadProgress: readonly(uploadProgress),
    error: readonly(error),
    
    // Methods
    processAvatar,
    validateFile,
    createPreview,
    revokePreview
  }
}