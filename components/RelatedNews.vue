<template>
  <LayoutSection 
    id="related-news" 
    background="muted" 
    spacing="base" 
    min-height="screen"
    container="app"
    class="relative overflow-hidden"
  >
    <!-- Animated Background Pattern -->
    <div class="absolute inset-0 opacity-5 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-white"></div>
      <div class="absolute top-0 left-1/4 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
      <div class="absolute bottom-0 right-1/4 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
    </div>
      <!-- Header with modern newspaper style -->
      <div class="text-center mb-16">
        <div class="flex items-center justify-center mb-6">
          <div class="h-px bg-gradient-to-r from-transparent via-green-400 to-transparent flex-1"></div>
          <span class="px-6 text-6xl">📰</span>
          <div class="h-px bg-gradient-to-r from-transparent via-green-400 to-transparent flex-1"></div>
        </div>
        <h2 class="text-5xl font-bold bg-gradient-to-r from-green-400 via-emerald-500 to-green-700 bg-clip-text text-transparent mb-4">
          Noticias Relacionadas
        </h2>
        <p class="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
          Para mantenerse informados y calmar la ansiedad antes del gran evento.
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="space-y-8">
        <div 
          v-for="n in 3" 
          :key="n"
          class="bg-white border border-gray-200 rounded-xl p-8 animate-pulse shadow-lg"
        >
          <div class="flex flex-col lg:flex-row gap-6">
            <div class="lg:w-1/3">
              <div class="h-32 bg-gray-200 rounded-lg mb-4"></div>
            </div>
            <div class="lg:w-2/3">
              <div class="h-6 bg-gray-200 rounded mb-3"></div>
              <div class="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
              <div class="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
              <div class="h-8 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- News List - Magazine Style -->
      <div v-else class="space-y-8">
        <article
          v-for="(news, index) in newsItems"
          :key="news.id"
          class="group bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl overflow-hidden hover:bg-white transition-all duration-500 hover:border-green-400/50 hover:shadow-2xl hover:shadow-green-500/10 shadow-lg"
          :style="{ animationDelay: `${index * 200}ms` }"
        >
          <div class="flex flex-col lg:flex-row">
            <!-- News Image -->
            <div class="lg:w-1/3 h-64 lg:h-auto relative overflow-hidden">
              <img
                :src="news.image"
                :alt="news.title"
                class="w-full h-full object-cover"
                loading="lazy"
              />
              <!-- Dark overlay for text readability -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <!-- Animated overlay on hover -->
              <div class="absolute inset-0 bg-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>

            <!-- News Content -->
            <div class="lg:w-2/3 p-8">
              <!-- News Meta -->
              <div class="flex items-center gap-4 mb-4">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                  {{ news.source }}
                </span>
                <div class="flex items-center text-gray-500 text-sm">
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                  </svg>
                  {{ formatDate(news.date) }}
                </div>
              </div>

              <!-- News Title -->
              <h3 class="text-2xl font-bold text-gray-800 mb-4 leading-tight group-hover:text-green-700 transition-colors duration-300">
                {{ news.title }}
              </h3>

              <!-- News Description -->
              <p class="text-gray-600 leading-relaxed mb-6 text-base">
                {{ news.description }}
              </p>

              <!-- Read More Button -->
              <a
                :href="news.url"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25 hover:scale-105"
                :aria-label="`Leer más sobre ${news.title}`"
              >
                <span>Leer artículo completo</span>
                <svg class="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </article>
      </div>

      <!-- Empty State -->
      <div 
        v-if="!isLoading && newsItems.length === 0"
        class="text-center py-24"
      >
        <div class="text-8xl mb-6 opacity-30">📰</div>
        <h3 class="text-3xl font-bold text-gray-700 mb-4">No hay noticias disponibles</h3>
        <p class="text-gray-500 text-lg">¡Vuelve pronto para leer las últimas noticias!</p>
      </div>

      <!-- Bottom Stats -->
      <div 
        v-if="!isLoading && newsItems.length > 0"
        class="mt-20 text-center"
      >
        <div class="inline-flex items-center gap-8 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl px-8 py-6 shadow-lg">
          <div class="text-center">
            <div class="text-3xl font-bold text-green-600 mb-1">{{ newsItems.length }}</div>
            <div class="text-sm text-gray-600">Noticias</div>
          </div>
          <div class="w-px h-12 bg-gray-200"></div>
          <div class="text-center">
            <div class="text-3xl font-bold text-emerald-600 mb-1">{{ getTotalSources() }}</div>
            <div class="text-sm text-gray-600">Fuentes</div>
          </div>
        </div>
      </div>
  </LayoutSection>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Props
const props = defineProps({
  newsData: {
    type: Array,
    default: () => []
  }
})

// Reactive state
const newsItems = ref([])
const isLoading = ref(true)

// Sample news data
const sampleNews = [
  {
    id: 1,
    title:"Anunciaron las fechas del Carnaval Provincial de Corrientes 2026",
    description:"En conferencia de prensa, con el Corsódromo \"Nolo Alías\" como escenario, este sábado la ministra de Turismo, Alejandra Eliciri en representación del Gobierno provincial encabezó el lanzamiento del Carnaval Provincial 2026 a realizarse durante 10 noches del 31 de enero al 28 de febrero, con una noche de Duelo de Batería, y tres fechas para los shows de Comparsas.",
    source:"Radio Dos",
    date: new Date(2025, 5, 22),
    url:"https://www.radiodos.com.ar/191790-anunciaron-las-fechas-del-carnaval-provincial-de-corrientes-2026",
    image:"/images/news1.png"
  },
  {
    id: 2,
    title:"Corrientes ya palpita el Carnaval Provincial 2026: serán 10 noches a puro ritmo",
    description:"Con el Corsódromo \"Nolo Alías\" como telón de fondo y la energía aún latente del workshop con los mestres del Carnaval de Río, el sábado se lanzó oficialmente el Carnaval Provincial 2026. La ministra de Turismo de Corrientes, Alejandra Eliciri, encabezó la conferencia en la que se confirmaron las fechas clave del evento que volverá a encender la temporada de verano en la Capital Nacional del Carnaval.",
    date: new Date(2025, 5, 22),
    source:"Corrientes al Día",
    url:"https://corrientesaldia.info/2025/06/22/corrientes-ya-palpita-el-carnaval-provincial-2026-seran-10-noches-a-puro-ritmo/",
    image:"/images/news2.png"
  },
  {
    id: 3,
    title:"Samba Total encendió la primera luz del Carnaval 2026",
    description:"La agrupación musical se convirtió en la primera institución de los carnavales correntinos en anunciar la temática artística que representará en la próxima edición. \"It's Showtime\" fue el adelanto del homenaje que realizará a la cadena de espectáculos de México Coco Bongo.",
    source:"Diario Época",
    date: new Date(2025, 3, 28),
    url:"https://www.diarioepoca.com/1351054-samba-total-encendio-la-primera-luz-del-carnaval-2026",
    image:"/images/news3.png"
  }
]

// Methods
const formatDate = (date) => {
  return new Intl.DateTimeFormat('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

const getTotalSources = () => {
  const sources = [...new Set(newsItems.value.map(news => news.source))]
  return sources.length
}

const loadNews = async () => {
  try {
    isLoading.value = true
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Use prop data if provided, otherwise use sample data
    newsItems.value = props.newsData.length > 0 ? props.newsData : sampleNews
  } catch (error) {
    console.error('Error loading news:', error)
    newsItems.value = []
  } finally {
    isLoading.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadNews()
})
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

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

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.space-y-8 > article {
  animation: slideInLeft 0.8s ease-out forwards;
  opacity: 0;
}

/* Delayed animation for background elements */
.animation-delay-2000 {
  animation-delay: 2s;
}

/* Floating animation for background elements */
.animate-float {
  animation: float 6s ease-in-out infinite;
}

/* Glass morphism effect enhancement */
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
}

/* Custom gradient text */
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}

/* Enhanced hover states */
article:hover {
  transform: translateY(-4px);
}

/* Button hover enhancements */
a[target="_blank"]:hover {
  transform: scale(1.05);
}

/* Responsive image placeholders */
@media (max-width: 1024px) {
  .lg\:w-1\/3 {
    height: 200px;
  }
}

/* Enhanced text readability on dark backgrounds */
.text-shadow {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}
</style>