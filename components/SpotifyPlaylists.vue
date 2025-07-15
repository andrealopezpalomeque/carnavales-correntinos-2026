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
      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <div 
          v-for="n in 3" 
          :key="n"
          class="bg-white rounded-2xl overflow-hidden animate-pulse shadow-lg border border-gray-200"
        >
          <!-- Cover area placeholder -->
          <div class="h-48 bg-gray-200 flex items-center justify-center">
            <div class="w-20 h-20 bg-gray-300 rounded-lg"></div>
          </div>
          <!-- Content area placeholder -->
          <div class="p-6">
            <div class="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
            <div class="h-4 bg-gray-200 rounded mb-2 w-full"></div>
            <div class="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
            <div class="flex justify-between">
              <div class="h-3 bg-gray-200 rounded w-16"></div>
              <div class="flex gap-1">
                <div class="w-2 h-2 bg-gray-200 rounded-full"></div>
                <div class="w-2 h-2 bg-gray-200 rounded-full"></div>
                <div class="w-2 h-2 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Spotify Playlists Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <div
          v-for="(playlist, index) in playlists.slice(0, 3)"
          :key="playlist.id"
          class="group relative bg-white rounded-2xl overflow-hidden hover:bg-gray-50 transition-all duration-500 cursor-pointer shadow-lg hover:shadow-green-500/20 hover:scale-105 border border-gray-200 hover:border-green-300"
          :style="{ animationDelay: `${index * 200}ms` }"
          @click="openPlaylist(playlist.url)"
        >
          <!-- Background Pattern -->
          <div class="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <!-- Album Cover Area -->
          <div class="relative h-48 bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 flex items-center justify-center overflow-hidden">
            <!-- Spotify-style cover placeholder -->
            <div class="w-20 h-20 bg-black/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/20">
              <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
            </div>

            <!-- Spotify Logo -->
            <div class="absolute top-4 right-4 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
            </div>
          </div>

          <!-- Track Info -->
          <div class="p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors duration-300 line-clamp-1">
              {{ playlist.name }}
            </h3>
            <p class="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
              {{ playlist.description }}
            </p>
            
            <!-- Stats Row -->
            <div class="flex items-center justify-between text-xs text-gray-500">
              <div class="flex items-center gap-3">
                <span class="flex items-center gap-1">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  {{ playlist.tracks }}
                </span>
                <span class="flex items-center gap-1">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.07 16.03c-.13 0-.26-.04-.37-.13-.26-.22-.3-.61-.08-.87L14.2 12 10.48 6.97c-.22-.26-.18-.65.08-.87.26-.22.65-.18.87.08L15.52 11c.12.14.19.33.19.52s-.07.38-.19.52l-4.09 4.82c-.12.14-.29.21-.45.21-.03 0-.06 0-.05-.04z"/>
                  </svg>
                  {{ Math.round(playlist.duration / 60) }}h
                </span>
              </div>
              
              <!-- Mood Indicators -->
              <div class="flex gap-1">
                <div
                  v-for="mood in playlist.moods.slice(0, 3)"
                  :key="mood"
                  class="w-2 h-2 rounded-full"
                  :class="getMoodColor(mood)"
                  :title="mood"
                ></div>
              </div>
            </div>
          </div>

          <!-- Hover Effect Borders -->
          <div class="absolute inset-0 border-2 border-transparent group-hover:border-green-500/50 rounded-2xl transition-colors duration-300"></div>
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
        <div class="inline-flex items-center gap-6 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl px-8 py-6 shadow-lg">
          <div class="text-center">
            <div class="text-3xl font-bold text-green-600 mb-1">3</div>
            <div class="text-sm text-gray-600">Playlists</div>
          </div>
          <div class="w-px h-12 bg-gray-200"></div>
          <div class="text-center">
            <div class="text-3xl font-bold text-emerald-600 mb-1">{{ getDisplayedTracks() }}</div>
            <div class="text-sm text-gray-600">Canciones</div>
          </div>
          <div class="w-px h-12 bg-gray-200"></div>
          <div class="text-center">
            <div class="text-3xl font-bold text-green-600 mb-1">{{ getDisplayedHours() }}h</div>
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
    name: "Carnavales Correntinos",
    description: "Los mejores ritmos del carnaval correntino para vivir la fiesta todo el año 📅 .",
    cover: "/images/playlist1.jpg",
    tracks: 81,
    duration: 283,
    url: "https://open.spotify.com/playlist/2zHaAhWuKOTMjU2VYgTMc0?si=c0eb48b9503241c0",
    moods: ["fiesta", "tradicion", "alegria"]
  },
  {
    id: 2,
    name: "Carnaval de Corrientes",
    description: "Marchas, samba-enredos y más de la Capital Nacional del Carnaval 🇦🇷 .",
    cover: "/images/playlist2.jpg",
    tracks: 80,
    duration: 268,
    url: "https://open.spotify.com/playlist/6RFhxGjAHvup8MgwWBvq7p?si=cabfb009876f4406",
    moods: ["tradicion", "nostalgia"]
  },
  {
    id: 3,
    name: "Sapucay 2025",
    description: "Lo mejor de nuestra comparsa en el 2025 🐓 .",
    cover: "/images/playlist3.jpg",
    tracks: 5,
    duration: 60,
    url: "https://open.spotify.com/playlist/3Ow8HuNyIlfcixA17lz4Rq?si=4b9bc33ccfb74e44",
    moods: ["fiesta", "energia"]
  },
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

const getDisplayedTracks = () => {
  return playlists.value.slice(0, 3).reduce((total, playlist) => total + playlist.tracks, 0)
}

const getDisplayedHours = () => {
  const totalMinutes = playlists.value.slice(0, 3).reduce((total, playlist) => total + playlist.duration, 0)
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
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Grid card animations */
.grid > div {
  animation: slideInUp 0.6s ease-out forwards;
  opacity: 0;
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
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Spotify-style hover effects */
.group:hover {
  transform: translateY(-4px) scale(1.02);
}

/* Play button hover effects */
.group:hover .bg-green-500 {
  background-color: #1db954;
  box-shadow: 0 8px 32px rgba(29, 185, 84, 0.3);
}

/* Enhanced grid responsiveness */
@media (max-width: 1024px) {
  .lg\:grid-cols-3 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .md\:grid-cols-2 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  
  .text-4xl {
    font-size: 2rem;
  }
  
  .text-lg {
    font-size: 1rem;
  }
  
  .gap-6 {
    gap: 1rem;
  }
  
  .mb-16 {
    margin-bottom: 2rem;
  }
}

@media (max-width: 480px) {
  .text-xl {
    font-size: 1.125rem;
  }
  
  .p-6 {
    padding: 1rem;
  }
  
  .h-48 {
    height: 10rem;
  }
}

/* Spotify green theme colors */
.bg-green-400 {
  background-color: #1ed760;
}

.bg-green-500 {
  background-color: #1db954;
}

.bg-green-600 {
  background-color: #1aa34a;
}

.text-green-400 {
  color: #1ed760;
}

.text-green-500 {
  color: #1db954;
}

.text-green-600 {
  color: #1aa34a;
}

.border-green-500 {
  border-color: #1db954;
}

/* Custom shadow effects */
.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Smooth transitions for all interactive elements */
.group {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Enhanced glow effects */
.group:hover {
  box-shadow: 0 20px 40px -8px rgba(29, 185, 84, 0.2);
}

/* Card content transitions */
.group .text-gray-800 {
  transition: color 0.3s ease;
}

.group:hover .text-gray-800 {
  color: #16a34a;
}

/* Play button scaling animation */
.group .transform {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Loading animation improvements */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Light theme scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f8f9fa;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #1db954;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #1ed760;
}
</style>