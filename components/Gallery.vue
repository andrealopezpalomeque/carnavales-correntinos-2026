<template>
  <LayoutContainer variant="app" class="pb-6">
    <div class="relative w-full h-[30rem] md:h-[40rem] lg:h-[50rem] overflow-hidden bg-gray-900 rounded-xl shadow-lg" role="img" aria-live="polite" aria-label="Carrusel de fotos del carnaval" id="photos">
    <!-- Carousel Images -->
    <div 
      class="flex transition-transform duration-500 ease-in-out h-full"
      :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
      role="group"
      :aria-label="`Imagen ${currentSlide + 1} de ${images.length}`"
    >
      <div
        v-for="(image, index) in images"
        :key="index"
        class="w-full h-full flex-shrink-0 relative"
      >
        <picture class="w-full h-full">
          <!-- WebP sources with responsive sizes -->
          <source
            :srcset="getResponsiveSrcset(image.basename, 'webp')"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 1152px"
            type="image/webp"
          />
          <!-- PNG fallback with responsive sizes -->
          <source
            :srcset="getResponsiveSrcset(image.basename, 'png')"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 1152px"
            type="image/png"
          />
          <!-- Fallback img tag -->
          <img
            :src="image.src"
            :alt="image.alt"
            class="w-full h-full object-cover transition-all duration-300"
            :style="{ 
              objectPosition: getObjectPosition(image),
              objectFit: 'cover'
            }"
            loading="lazy"
            :width="image.width"
            :height="image.height"
          />
        </picture>
        <!-- Overlay with text -->
        <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent">
          <div class="text-center text-white px-6 py-10">
            <h2 class="text-2xl md:text-4xl lg:text-5xl font-bold mb-2">{{ image.title }}</h2>
            <p class="text-sm md:text-lg lg:text-xl opacity-90">{{ image.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Arrows -->
    <button
      @click="previousSlide"
      class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
      aria-label="Previous image"
    >
      <ChevronLeft class="w-6 h-6" aria-hidden="true" />
    </button>
    
    <button
      @click="nextSlide"
      class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
      aria-label="Next image"
    >
      <ChevronRight class="w-6 h-6" aria-hidden="true" />
    </button>

    <!-- Dot Indicators -->
    <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
      <button
        v-for="(image, index) in images"
        :key="index"
        @click="goToSlide(index)"
        class="w-3 h-3 rounded-full transition-all duration-200"
        :class="currentSlide === index ? 'bg-white' : 'bg-white bg-opacity-50 hover:bg-opacity-75'"
        :aria-label="`Go to slide ${index + 1}`"
      />
    </div>

    <!-- Play/Pause Button -->
    <button
      @click="toggleAutoPlay"
      class="absolute top-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
      :aria-label="isPlaying ? 'Pause slideshow' : 'Play slideshow'"
    >
      <Pause v-if="isPlaying" class="w-5 h-5" aria-hidden="true" />
      <Play v-else class="w-5 h-5" aria-hidden="true" />
    </button>
    </div>
  </LayoutContainer>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-vue-next'

const images = ref([
  {
    basename: 'carnaval1',
    src: '/images/carnaval1@2x.png',
    alt: 'Inaguración carnavales 2025',
    title: 'Inaguración carnavales 2025',
    description: 'Disfrutando desde el minuto uno',
    width: 1152, // Default @2x width - update based on actual dimensions
    height: 768  // Default @2x height - update based on actual dimensions
  },
  {
    basename: 'carnaval2',
    src: '/images/carnaval2@2x.png',
    alt: 'Primera aparición en el Palco Oficial',
    title: 'Primera aparición en el Palco Oficial',
    description: 'Inicio de una larga aventura',
    width: 1152,
    height: 768
  },
  {
    basename: 'carnaval3',
    src: '/images/carnaval3@2x.png',
    alt: 'Tomando alguito',
    title: 'Tomando alguito',
    description: 'Un momento de relax y diversión',
    width: 1152,
    height: 768
  },
  {
    basename: 'carnaval4',
    src: '/images/carnaval4@2x.png',
    alt: 'Celebrando en cada rincón',
    title: 'Celebrando en cada rincón',
    description: 'La alegría del carnaval en su máxima expresión',
    width: 1152,
    height: 768,
    objectPosition: {
      mobile: '35% center',
      tablet: 'center',
      desktop: 'center'
    }
  },
  {
    basename: 'carnaval5',
    src: '/images/carnaval5@2x.png',
    alt: 'Del 🐓, siempre',
    title: 'Del 🐓, siempre',
    description: '✋',
    width: 1152,
    height: 768
  },
  {
    basename: 'carnaval6',
    src: '/images/carnaval6@2x.png',
    alt: 'Piel de gallo',
    title: 'Piel de gallo',
    description: 'Contra todo pronóstico',
    width: 1152,
    height: 768
  },
  {
    basename: 'carnaval7',
    src: '/images/carnaval7@2x.png',
    alt: 'Carnavalero, no importa el color',
    title: 'Carnavalero, no importa el color',
    description: '🥳',
    width: 1152,
    height: 768
  },
  {
    basename: 'carnaval8',
    src: '/images/carnaval8@2x.png',
    alt: 'Probando la AVENIDA',
    title: 'Probando la AVENIDA',
    description: '2026?',
    width: 1152,
    height: 768,
    objectPosition: {
      mobile: '45% center',
      tablet: 'center',
      desktop: 'center'
    }
  },
  {
    basename: 'carnaval9',
    src: '/images/carnaval9@2x.png',
    alt: 'Nos queda pintado',
    title: 'Nos queda pintado',
    description: '🎭',
    width: 1152,
    height: 768
  },
  {
    basename: 'carnaval10',
    src: '/images/carnaval10@2x.png',
    alt: 'Carnaval toda la vida',
    title: 'Carnaval toda la vida',
    description: '💙🧡',
    width: 1152,
    height: 768,
    objectPosition: {
      mobile: 'center',
      tablet: '52% 20%',
      desktop: '52% 20%'
    }
  },
  {
    basename: 'carnaval11',
    src: '/images/carnaval11@2x.png',
    alt: 'Nueva skin',
    title: 'Nueva skin',
    description: '🤫',
    width: 1152,
    height: 768
  },
  {
    basename: 'carnaval12',
    src: '/images/carnaval12@2x.png',
    alt: 'CORSITO? SIEMPRE',
    title: 'CORSITO? SIEMPRE',
    description: '💙🧡',
    width: 1152,
    height: 768,
    objectPosition: {
      mobile: '45% center',
      tablet: 'center',
      desktop: 'center'
    }
  }
])

// Screen size detection
const screenWidth = ref(0)
const containerWidth = ref(0)

const updateScreenWidth = () => {
  screenWidth.value = window.innerWidth
  // Also update container width for more precise positioning
  const container = document.querySelector('.relative.w-full')
  if (container) {
    containerWidth.value = container.offsetWidth
  }
}

// Enhanced responsive object position with container-relative positioning
const getObjectPosition = (image) => {
  if (!image.objectPosition) return 'center'
  
  // Apply custom position based on screen size
  if (screenWidth.value >= 1024) {
    return image.objectPosition.desktop || 'center'
  }
  
  // Apply tablet-specific position
  if (screenWidth.value >= 768) {
    return image.objectPosition.tablet || 'center'
  }
  
  // Mobile fallback
  return image.objectPosition.mobile || 'center'
}

// Additional helper for dynamic positioning based on container size
const getDynamicPosition = (basePosition, screenSize) => {
  // Convert percentage-based positions to be more responsive
  if (typeof basePosition === 'string' && basePosition.includes('%')) {
    const [x, y] = basePosition.split(' ')
    
    // Adjust positioning based on screen width ratio
    const widthRatio = screenWidth.value / 1152 // Base width
    const adjustedX = x.includes('%') ? 
      `${Math.max(0, Math.min(100, parseFloat(x) * widthRatio))}%` : x
    
    return `${adjustedX} ${y || 'center'}`
  }
  
  return basePosition
}

// Carousel state
const currentSlide = ref(0)
const isPlaying = ref(true)
let autoPlayInterval = null

// Responsive image generation
const getResponsiveSrcset = (basename, format) => {
  const extension = format === 'webp' ? 'webp' : 'png'
  return [
    `/images/${basename}@1x.${extension} 1x`,
    `/images/${basename}@1.5x.${extension} 1.5x`,
    `/images/${basename}@2x.${extension} 2x`
  ].join(', ')
}

// Check if WebP is supported
const supportsWebP = ref(true)
const checkWebPSupport = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  const ctx = canvas.getContext('2d')
  if (ctx) {
    const dataUrl = canvas.toDataURL('image/webp')
    supportsWebP.value = dataUrl.startsWith('data:image/webp')
  } else {
    supportsWebP.value = false
  }
}

// Navigation functions
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % images.value.length
}

const previousSlide = () => {
  currentSlide.value = currentSlide.value === 0 ? images.value.length - 1 : currentSlide.value - 1
}

const goToSlide = (index) => {
  currentSlide.value = index
}

// Auto-play functionality
const startAutoPlay = () => {
  if (autoPlayInterval) clearInterval(autoPlayInterval)
  autoPlayInterval = setInterval(nextSlide, 8000) // Change slide every 8 seconds
}

const stopAutoPlay = () => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
    autoPlayInterval = null
  }
}

const toggleAutoPlay = () => {
  isPlaying.value = !isPlaying.value
  if (isPlaying.value) {
    startAutoPlay()
  } else {
    stopAutoPlay()
  }
}

// Keyboard navigation
const handleKeydown = (event) => {
  switch (event.key) {
    case 'ArrowLeft':
      previousSlide()
      break
    case 'ArrowRight':
      nextSlide()
      break
    case ' ':
      event.preventDefault()
      toggleAutoPlay()
      break
  }
}

// Touch/swipe support
let touchStartX = 0
let touchEndX = 0

const handleTouchStart = (event) => {
  touchStartX = event.changedTouches[0].screenX
}

const handleTouchEnd = (event) => {
  touchEndX = event.changedTouches[0].screenX
  handleSwipe()
}

const handleSwipe = () => {
  const swipeThreshold = 50
  const diff = touchStartX - touchEndX
  
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      nextSlide()
    } else {
      previousSlide()
    }
  }
}

// Throttled resize handler for better performance
let resizeTimeout = null
const throttledUpdateScreenWidth = () => {
  if (resizeTimeout) clearTimeout(resizeTimeout)
  resizeTimeout = setTimeout(() => {
    updateScreenWidth()
  }, 100)
}

// Lifecycle hooks
onMounted(() => {
  checkWebPSupport()
  startAutoPlay()
  updateScreenWidth()
  window.addEventListener('resize', throttledUpdateScreenWidth)
  document.addEventListener('keydown', handleKeydown)
  document.addEventListener('touchstart', handleTouchStart)
  document.addEventListener('touchend', handleTouchEnd)
})

onUnmounted(() => {
  stopAutoPlay()
  if (resizeTimeout) clearTimeout(resizeTimeout)
  window.removeEventListener('resize', throttledUpdateScreenWidth)
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('touchstart', handleTouchStart)
  document.removeEventListener('touchend', handleTouchEnd)
})
</script>

<style scoped>
/* Additional custom styles if needed */
.carousel-enter-active,
.carousel-leave-active {
  transition: opacity 0.5s ease;
}

.carousel-enter-from,
.carousel-leave-to {
  opacity: 0;
}

/* Enhanced responsive image positioning */
img {
  min-width: 100%;
  min-height: 100%;
  max-width: none;
  display: block;
}

/* Prevent black spaces on ultra-wide screens */
@media (min-width: 1920px) {
  img {
    transform: scale(1.1);
  }
}

/* Ensure proper scaling on mobile devices */
@media (max-width: 768px) {
  img {
    object-fit: cover !important;
    width: 100% !important;
    height: 100% !important;
  }
}

/* Tablet optimizations */
@media (min-width: 769px) and (max-width: 1023px) {
  img {
    object-fit: cover !important;
    min-width: 100%;
    min-height: 100%;
  }
}

/* Desktop optimizations */
@media (min-width: 1024px) {
  img {
    object-fit: cover !important;
    min-width: 100%;
    min-height: 100%;
  }
}
</style>