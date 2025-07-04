<template>
  <section id="related-news" class="section-standard bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
    <div class="container-standard">
      <!-- Header -->
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold text-gray-800 mb-4">
          📰 Noticias Relacionadas
        </h2>
        <p class="text-gray-600 text-lg max-w-2xl mx-auto">
          Para mantenerse informados y calmar la ansiedad.
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="n in 6" 
          :key="n"
          class="bg-white rounded-2xl shadow-lg p-6 animate-pulse"
        >
          <div class="h-4 bg-gray-200 rounded mb-4"></div>
          <div class="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
          <div class="h-4 bg-gray-200 rounded w-1/2"></div>
          <div class="flex justify-between items-center mt-6">
            <div class="h-6 bg-gray-200 rounded w-20"></div>
            <div class="h-8 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </div>

      <!-- News Grid -->
      <div 
        v-else
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md"
      >
        <article
          v-for="(news, index) in newsItems"
          :key="news.id"
          class="card-feature group overflow-hidden border border-gray-100"
          :style="{ animationDelay: `${index * 100}ms` }"
        >
          <!-- Card Header -->
          <div class="bg-gradient-to-r from-blue-500 to-indigo-500 h-2"></div>
          
          <!-- Card Content -->
          <div class="p-6">
            <!-- News Source -->
            <div class="flex items-center mb-4">
              <div class="w-10 h-10 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mr-3">
                <span class="text-xl">📺</span>
              </div>
              <div class="text-sm text-gray-500 font-medium">
                {{ news.source }}
              </div>
            </div>

            <!-- News Title -->
            <h3 class="text-lg font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-700 transition-colors">
              {{ news.title }}
            </h3>

            <!-- News Description -->
            <p class="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
              {{ news.description }}
            </p>

            <!-- News Date -->
            <div class="flex items-center text-gray-500 text-xs mb-6">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
              </svg>
              <span class="">{{ formatDate(news.date) }}</span>
            </div>

            <!-- Read More Button -->
            <a
              :href="news.url"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-secondary group/btn relative overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-full w-full text-center inline-block"
              :aria-label="`Leer más sobre ${news.title}`"
            >
              <div class="flex items-center justify-center space-x-2">
                <span class="text-sm">Leer más</span>
                <svg class="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
              
              <!-- Button shine effect -->
              <div class="absolute inset-0 -top-1 -left-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover/btn:opacity-20 transform -skew-x-12 group-hover/btn:animate-pulse"></div>
            </a>
          </div>

          <!-- Hover Effect Border -->
          <div class="absolute inset-0 border-2 border-transparent group-hover:border-blue-200 rounded-2xl transition-colors duration-300 pointer-events-none"></div>
        </article>
      </div>

      <!-- Empty State -->
      <div 
        v-if="!isLoading && newsItems.length === 0"
        class="text-center py-16"
      >
        <div class="text-6xl mb-4">📰</div>
        <h3 class="text-2xl font-bold text-gray-700 mb-2">No hay noticias disponibles</h3>
        <p class="text-gray-500">¡Vuelve pronto para leer las últimas noticias!</p>
      </div>
    </div>
  </section>
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
    url:"https://www.radiodos.com.ar/191790-anunciaron-las-fechas-del-carnaval-provincial-de-corrientes-2026"
  },
  {
    id: 2,
    title:"Corrientes ya palpita el Carnaval Provincial 2026: serán 10 noches a puro ritmo",
    description:"Con el Corsódromo \"Nolo Alías\" como telón de fondo y la energía aún latente del workshop con los mestres del Carnaval de Río, el sábado se lanzó oficialmente el Carnaval Provincial 2026. La ministra de Turismo de Corrientes, Alejandra Eliciri, encabezó la conferencia en la que se confirmaron las fechas clave del evento que volverá a encender la temporada de verano en la Capital Nacional del Carnaval.",
    date: new Date(2025, 5, 22),
    source:"Corrientes al Día",
    url:"https://corrientesaldia.info/2025/06/22/corrientes-ya-palpita-el-carnaval-provincial-2026-seran-10-noches-a-puro-ritmo/"
  },
  {
    id: 3,
    title:"Hoteles de Corrientes reportan reservas al 90% para Carnavales 2026",
    description:"La agrupación musical se convirtió en la primera institución de los carnavales correntinos en anunciar la temática artística que representará en la próxima edición. \"It's Showtime\" fue el adelanto del homenaje que realizará a la cadena de espectáculos de México Coco Bongo.",
    source:"Norte",
    date: new Date(2025, 3, 28),
    url:"https://www.diarioepoca.com/1351054-samba-total-encendio-la-primera-luz-del-carnaval-2026"
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
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.grid > article {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
}

/* Text clamp utilities */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom hover effects */
.hover\:shadow-3xl:hover {
  box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
}

/* External link icon animation */
a[target="_blank"] svg {
  transition: transform 0.2s ease;
}

a[target="_blank"]:hover svg {
  transform: translateX(2px) translateY(-2px);
}
</style>