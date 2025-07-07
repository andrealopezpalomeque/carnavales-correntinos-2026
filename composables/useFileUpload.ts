import { ref, computed } from 'vue'
import { 
  ref as storageRef, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  type FirebaseStorage 
} from 'firebase/storage'

export interface UploadResult {
  success: boolean
  url?: string
  error?: string
}

export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

export const useFileUpload = () => {
  const isUploading = ref(false)
  const uploadProgress = ref<UploadProgress>({ loaded: 0, total: 0, percentage: 0 })
  const error = ref<string | null>(null)

  // Get Firebase Storage instance
  const getStorage = (): FirebaseStorage | null => {
    try {
      const { $firebase } = useNuxtApp()
      return $firebase?.storage || null
    } catch (error) {
      console.warn('Firebase Storage not available:', error)
      return null
    }
  }

  // Validate file
  const validateFile = (file: File, options: {
    maxSize?: number // in bytes
    allowedTypes?: string[]
  } = {}): { valid: boolean; error?: string } => {
    const { maxSize = 5 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/png', 'image/webp'] } = options

    if (!file) {
      return { valid: false, error: 'No se seleccionó ningún archivo' }
    }

    if (file.size > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024)
      return { valid: false, error: `El archivo debe ser menor a ${maxSizeMB}MB` }
    }

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Tipo de archivo no permitido. Use JPG, PNG o WebP' }
    }

    return { valid: true }
  }

  // Resize image if needed
  const resizeImage = (file: File, maxWidth: number = 800, maxHeight: number = 800, quality: number = 0.8): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        // Calculate new dimensions
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
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error('Error procesando la imagen'))
            }
          },
          file.type,
          quality
        )
      }

      img.onerror = () => reject(new Error('Error cargando la imagen'))
      img.src = URL.createObjectURL(file)
    })
  }

  // Upload file to Firebase Storage
  const uploadFile = async (
    file: File, 
    path: string,
    options: {
      resize?: boolean
      maxWidth?: number
      maxHeight?: number
      quality?: number
    } = {}
  ): Promise<UploadResult> => {
    const storage = getStorage()
    if (!storage) {
      return { success: false, error: 'Firebase Storage no está disponible' }
    }

    try {
      isUploading.value = true
      error.value = null
      uploadProgress.value = { loaded: 0, total: 0, percentage: 0 }

      // Validate file
      const validation = validateFile(file)
      if (!validation.valid) {
        return { success: false, error: validation.error }
      }

      // Resize image if requested
      let fileToUpload: File | Blob = file
      if (options.resize && file.type.startsWith('image/')) {
        try {
          fileToUpload = await resizeImage(
            file, 
            options.maxWidth, 
            options.maxHeight, 
            options.quality
          )
        } catch (resizeError) {
          console.warn('Error resizing image, uploading original:', resizeError)
        }
      }

      // Create storage reference
      const fileRef = storageRef(storage, path)

      // Upload file
      const snapshot = await uploadBytes(fileRef, fileToUpload)
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref)

      return { success: true, url: downloadURL }
    } catch (uploadError: any) {
      console.error('Error uploading file:', uploadError)
      const errorMessage = uploadError.message || 'Error al subir el archivo'
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      isUploading.value = false
      uploadProgress.value = { loaded: 0, total: 0, percentage: 0 }
    }
  }

  // Upload avatar specifically
  const uploadAvatar = async (file: File, userId: string): Promise<UploadResult> => {
    const timestamp = Date.now()
    const extension = file.name.split('.').pop()
    const path = `avatars/${userId}/${timestamp}.${extension}`
    
    return await uploadFile(file, path, {
      resize: true,
      maxWidth: 400,
      maxHeight: 400,
      quality: 0.8
    })
  }

  // Delete file from Firebase Storage
  const deleteFile = async (url: string): Promise<{ success: boolean; error?: string }> => {
    const storage = getStorage()
    if (!storage) {
      return { success: false, error: 'Firebase Storage no está disponible' }
    }

    try {
      // Extract path from URL
      const baseUrl = `https://firebasestorage.googleapis.com/v0/b/${storage.app.options.storageBucket}/o/`
      if (!url.startsWith(baseUrl)) {
        return { success: false, error: 'URL de archivo inválida' }
      }

      const encodedPath = url.substring(baseUrl.length).split('?')[0]
      const path = decodeURIComponent(encodedPath)
      
      const fileRef = storageRef(storage, path)
      await deleteObject(fileRef)
      
      return { success: true }
    } catch (deleteError: any) {
      console.error('Error deleting file:', deleteError)
      return { success: false, error: deleteError.message || 'Error al eliminar archivo' }
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
    uploadFile,
    uploadAvatar,
    deleteFile,
    validateFile,
    createPreview,
    revokePreview,
    
    // Computed
    isUploadingPercent: computed(() => uploadProgress.value.percentage)
  }
}