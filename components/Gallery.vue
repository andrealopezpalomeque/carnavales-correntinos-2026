<template>
  <LayoutContainer variant="app" class="pb-6">
    <div class="relative w-full h-96 md:h-[500px] lg:h-[600px] overflow-hidden bg-gray-900 rounded-xl shadow-lg" role="img" aria-live="polite" aria-label="Carrusel de fotos del carnaval" id="photos">
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
        <img
          :src="image.src"
          :alt="image.alt"
          class="w-full h-full object-cover"
          loading="lazy"
        />
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
import { ref, onMounted, onUnmounted } from 'vue'
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-vue-next'

const images = ref([
  {
    src: '/images/carnaval1@2x.png',
    alt: 'Inaguración carnavales 2025',
    title: 'Inaguración carnavales 2025',
    description: 'Disfrutando desde el minuto uno'
  },
  {
    src: '/images/carnaval2@2x.png',
    alt: 'Primera aparición en el Palco Oficial',
    title: 'Primera aparición en el Palco Oficial',
    description: 'Inicio de una larga aventura'
  },
  {
   src: '/images/carnaval3@2x.png',
    alt: 'Tomando alguito',
    title: 'Tomando alguito',
    description: 'Un momento de relax y diversión'
  },
  {
    src: '/images/carnaval4@2x.png',
    alt: 'Celebración en las calles',
    title: 'Celebración en las calles',
    description: 'La alegría del carnaval en su máxima expresión'
  },
  {
    src: '/images/carnaval5@2x.png',
    alt: 'Desfile de comparsas',
    title: 'Desfile de comparsas',
    description: 'La creatividad y el color en cada paso'
  },
  {
    src: '/images/carnaval6@2x.png',
    alt: 'Fiesta en la playa',
    title: 'Fiesta en la playa',
    description: 'La diversión no se detiene'
  },
  {
    src: '/images/carnaval7@2x.png',
    alt: 'Carnaval en la ciudad',
    title: 'Carnaval en la ciudad',
    description: 'La fiesta se vive en cada rincón'
  },
  {
    src: '/images/carnaval8@2x.png',
    alt: 'Carnaval en la playa',
    title: 'Carnaval en la playa',
    description: 'La fiesta se vive en la playa'
  },
  {
    src: '/images/carnaval9@2x.png',
    alt: 'Carnaval en la ciudad',
    title: 'Carnaval en la ciudad',
    description: 'La fiesta se vive en la ciudad'
  },
  {
    src: '/images/carnaval10@2x.png',
    alt: 'Carnaval en la ciudad',
    title: 'Carnaval en la ciudad',
    description: 'La fiesta se vive en la ciudad'
  },
  {
    src: '/images/carnaval11@2x.png',
    alt: 'Carnaval en la ciudad',
    title: 'Carnaval en la ciudad',
    description: 'La fiesta se vive en la ciudad'
  },
  {
    src: '/images/carnaval12@2x.png',
    alt: 'Carnaval en la ciudad',
    title: 'Carnaval en la ciudad',
    description: 'La fiesta se vive en la ciudad'
  }
])

// Carousel state
const currentSlide = ref(0)
const isPlaying = ref(true)
let autoPlayInterval = null

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
  autoPlayInterval = setInterval(nextSlide, 4000) // Change slide every 4 seconds
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

// Lifecycle hooks
onMounted(() => {
  startAutoPlay()
  document.addEventListener('keydown', handleKeydown)
  document.addEventListener('touchstart', handleTouchStart)
  document.addEventListener('touchend', handleTouchEnd)
})

onUnmounted(() => {
  stopAutoPlay()
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
</style>