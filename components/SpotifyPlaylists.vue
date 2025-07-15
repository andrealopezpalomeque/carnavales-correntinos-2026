<template>
  <LayoutSection 
    id="spotify-playlists" 
    background="gradient" 
    spacing="base" 
    min-height="screen"
    container="app"
    class="relative overflow-hidden"
  >
    <!-- Animated Background Pattern -->
    <div class="absolute inset-0 opacity-5 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-green-100 via-emerald-50 to-white"></div>
      <div class="absolute top-0 left-1/4 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
      <div class="absolute bottom-0 right-1/4 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
    </div>
      <!-- Header -->
      <div class="text-center mb-16">
        <div class="flex items-center justify-center mb-6">
          <div class="h-px bg-gradient-to-r from-transparent via-green-400 to-transparent flex-1"></div>
          <div class="px-6">
            <svg class="w-16 h-16 text-green-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
          </div>
          <div class="h-px bg-gradient-to-r from-transparent via-green-400 to-transparent flex-1"></div>
        </div>
        <h2 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 via-emerald-500 to-green-700 bg-clip-text text-transparent mb-4">
          Playlists del Carnaval
        </h2>
        <p class="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
          Sumérgete en los ritmos y melodías que acompañan la magia del Carnaval Correntino.
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="space-y-6">
        <div 
          v-for="n in 3" 
          :key="n"
          class="flex flex-col md:flex-row items-center gap-4 md:gap-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 animate-pulse shadow-lg"
        >
          <div class="w-16 h-16 md:w-20 md:h-20 bg-gray-200 rounded-full flex-shrink-0"></div>
          <div class="flex-1 text-center md:text-left">
            <div class="h-5 md:h-6 bg-gray-200 rounded mb-3 w-3/4 mx-auto md:mx-0"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2 mx-auto md:mx-0"></div>
          </div>
          <div class="w-12 h-12 md:w-16 md:h-16 bg-gray-200 rounded-full flex-shrink-0"></div>
        </div>
      </div>

      <!-- Spotify Playlists Interface -->
      <div v-else class="space-y-6">
        <div
          v-for="(playlist, index) in playlists"
          :key="playlist.id"
          class="group relative bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-4 md:p-6 hover:bg-white transition-all duration-300 hover:border-green-400/50 hover:shadow-xl hover:shadow-green-500/10 shadow-lg cursor-pointer"
          :style="{ animationDelay: `${index * 150}ms` }"
          @click="openPlaylist(playlist.url)"
        >
          <div class="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            <!-- Vinyl Record -->
            <div class="relative flex-shrink-0">
              <div class="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center border-4 border-gray-300 group-hover:border-green-500 transition-all duration-300">
                <div class="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full"></div>
                <!-- Vinyl grooves -->
                <div class="absolute inset-2 border border-gray-400 rounded-full opacity-50"></div>
                <div class="absolute inset-3 md:inset-4 border border-gray-400 rounded-full opacity-30"></div>
              </div>
              <!-- Spotify logo on hover -->
              <div class="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Track Info -->
            <div class="flex-1 text-center md:text-left">
              <h3 class="text-xl md:text-2xl font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors duration-300">
                {{ playlist.name }}
              </h3>
              <p class="text-gray-600 text-sm mb-3 line-clamp-2">
                {{ playlist.description }}
              </p>
              <div class="flex items-center justify-center md:justify-start gap-4 text-sm text-gray-500">
                <span class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  {{ playlist.tracks }} canciones
                </span>
                <span class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.07 16.03c-.13 0-.26-.04-.37-.13-.26-.22-.3-.61-.08-.87L14.2 12 10.48 6.97c-.22-.26-.18-.65.08-.87.26-.22.65-.18.87.08L15.52 11c.12.14.19.33.19.52s-.07.38-.19.52l-4.09 4.82c-.12.14-.29.21-.45.21-.03 0-.06 0-.05-.04z"/>
                  </svg>
                  {{ Math.round(playlist.duration / 60) }}h
                </span>
              </div>
            </div>

            <!-- Mood Indicators (simplified) -->
            <div class="hidden md:flex flex-col items-center gap-2">
              <div class="flex gap-1">
                <div
                  v-for="mood in playlist.moods.slice(0, 3)"
                  :key="mood"
                  class="w-2 h-6 rounded-full"
                  :class="getMoodColor(mood)"
                  :title="mood"
                ></div>
              </div>
            </div>

            <!-- Play Button -->
            <div class="relative flex-shrink-0">
              <div class="w-12 h-12 md:w-16 md:h-16 bg-green-500 rounded-full flex items-center justify-center group-hover:bg-green-400 transition-colors duration-300 hover:scale-105 shadow-lg">
                <svg class="w-6 h-6 md:w-8 md:h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div 
        v-if="!isLoading && playlists.length === 0"
        class="text-center py-24"
      >
        <div class="text-8xl mb-6 opacity-30">🎵</div>
        <h3 class="text-3xl font-bold text-gray-700 mb-4">No hay playlists disponibles</h3>
        <p class="text-gray-500 text-lg">¡Pronto agregaremos más música para el Carnaval!</p>
      </div>

      <!-- Bottom Stats -->
      <div 
        v-if="!isLoading && playlists.length > 0"
        class="mt-20 text-center"
      >
        <div class="inline-flex items-center gap-8 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl px-8 py-6 shadow-lg">
          <div class="text-center">
            <div class="text-3xl font-bold text-green-600 mb-1">{{ playlists.length }}</div>
            <div class="text-sm text-gray-600">Playlists</div>
          </div>
          <div class="w-px h-12 bg-gray-200"></div>
          <div class="text-center">
            <div class="text-3xl font-bold text-emerald-600 mb-1">{{ getTotalTracks() }}</div>
            <div class="text-sm text-gray-600">Canciones</div>
          </div>
          <div class="w-px h-12 bg-gray-200"></div>
          <div class="text-center">
            <div class="text-3xl font-bold text-green-600 mb-1">{{ getTotalHours() }}h</div>
            <div class="text-sm text-gray-600">Duración</div>
          </div>
        </div>
      </div>
  </LayoutSection>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Props
const props = defineProps({
  playlistData: {
    type: Array,
    default: () => []
  }
})

// Reactive state
const playlists = ref([])
const isLoading = ref(true)

// Sample playlist data
const samplePlaylists = [
  {
    id: 1,
    name: "Carnaval Correntino 2026",
    description: "Los mejores ritmos del carnaval correntino para vivir la fiesta todo el año",
    cover: "/images/playlist1.jpg",
    tracks: 45,
    duration: 180,
    url: "https://open.spotify.com/playlist/37i9dQZF1DXbbu94YBG7Ye?si=ac746c21d4454014",
    moods: ["fiesta", "tradicion", "alegria"]
  },
  {
    id: 2,
    name: "Chamame Eterno",
    description: "La esencia del chamamé correntino en una selección especial",
    cover: "/images/playlist2.jpg",
    tracks: 32,
    duration: 150,
    url: "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M?si=1520f432820e45c8",
    moods: ["tradicion", "nostalgia"]
  },
  {
    id: 3,
    name: "Murgas y Comparsas",
    description: "El espíritu festivo de las murgas correntinas",
    cover: "/images/playlist3.jpg",
    tracks: 28,
    duration: 120,
    url: "https://open.spotify.com/playlist/37i9dQZF1DXbbu94YBG7Ye?si=ac746c21d4454014",
    moods: ["fiesta", "energia"]
  },
  {
    id: 4,
    name: "Sapucay Night",
    description: "Ritmos para bailar toda la noche en el corsódromo",
    cover: "/images/playlist4.jpg",
    tracks: 40,
    duration: 200,
    url: "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M?si=1520f432820e45c8",
    moods: ["fiesta", "baile", "energia"]
  },
  {
    id: 5,
    name: "Carnaval Memories",
    description: "Clásicos inmortales del carnaval correntino",
    cover: "/images/playlist5.jpg",
    tracks: 35,
    duration: 160,
    url: "https://open.spotify.com/playlist/37i9dQZF1DXbbu94YBG7Ye?si=ac746c21d4454014",
    moods: ["nostalgia", "tradicion"]
  },
  {
    id: 6,
    name: "Ritmos del Litoral",
    description: "Sonidos tradicionales del litoral argentino",
    cover: "/images/playlist6.jpg",
    tracks: 38,
    duration: 175,
    url: "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M?si=1520f432820e45c8",
    moods: ["tradicion", "folklore"]
  }
]

// Methods
const openPlaylist = (url) => {
  window.open(url, '_blank', 'noopener,noreferrer')
}

const getMoodColor = (mood) => {
  const colors = {
    'fiesta': 'bg-red-500',
    'tradicion': 'bg-yellow-500',
    'alegria': 'bg-orange-500',
    'nostalgia': 'bg-blue-500',
    'energia': 'bg-green-500',
    'baile': 'bg-pink-500',
    'folklore': 'bg-purple-500'
  }
  return colors[mood] || 'bg-gray-500'
}

const getMoodEmoji = (mood) => {
  const emojis = {
    'fiesta': '🎉',
    'tradicion': '🏛️',
    'alegria': '😊',
    'nostalgia': '💭',
    'energia': '⚡',
    'baile': '💃',
    'folklore': '🎭'
  }
  return emojis[mood] || '🎵'
}

const getTotalTracks = () => {
  return playlists.value.reduce((total, playlist) => total + playlist.tracks, 0)
}

const getTotalHours = () => {
  const totalMinutes = playlists.value.reduce((total, playlist) => total + playlist.duration, 0)
  return Math.round(totalMinutes / 60)
}

const loadPlaylists = async () => {
  try {
    isLoading.value = true
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Use prop data if provided, otherwise use sample data
    playlists.value = props.playlistData.length > 0 ? props.playlistData : samplePlaylists
  } catch (error) {
    console.error('Error loading playlists:', error)
    playlists.value = []
  } finally {
    isLoading.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadPlaylists()
})
</script>

<style scoped>
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}


/* Playlist row animations */
.space-y-6 > div {
  animation: slideInLeft 0.6s ease-out forwards;
  opacity: 0;
}

/* Simplified vinyl record hover */
.group:hover .w-16.h-16,
.group:hover .w-20.h-20 {
  transform: rotate(180deg);
  transition: transform 0.6s ease;
}

/* Delayed animation for background elements */
.animation-delay-2000 {
  animation-delay: 2s;
}

/* Glass morphism effect enhancement */
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
}

/* Line clamp utilities */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Enhanced hover states for playlist rows */
.group:hover {
  transform: translateY(-2px);
  transition: all 0.3s ease;
}

/* Smooth transitions for all interactive elements */
* {
  transition: all 0.3s ease;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .space-y-6 {
    gap: 1rem;
  }
  
  .text-4xl {
    font-size: 2rem;
  }
  
  .text-lg {
    font-size: 1rem;
  }
  
  .container-standard {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .p-4 {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .text-xl {
    font-size: 1.125rem;
  }
  
  .gap-4 {
    gap: 0.75rem;
  }
  
  .mb-16 {
    margin-bottom: 2rem;
  }
  
  .space-y-6 > * + * {
    margin-top: 1rem;
  }
}

/* Custom scrollbar for light theme */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #059669;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #047857;
}

/* Glow effects for interactive elements */
.group:hover .bg-green-500 {
  box-shadow: 0 0 30px rgba(16, 185, 129, 0.5);
}

.group:hover .border-green-500 {
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
}

/* Green theme consistency with other components */
.bg-green-400 {
  background-color: #4ade80;
}

.bg-green-500 {
  background-color: #22c55e;
}

.bg-green-600 {
  background-color: #16a34a;
}

.text-green-400 {
  color: #4ade80;
}

.text-green-600 {
  color: #16a34a;
}

.border-green-500 {
  border-color: #22c55e;
}
</style>