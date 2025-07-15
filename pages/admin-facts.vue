<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-lg shadow-lg p-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-8 text-center">
          🎭 Admin: Fun Facts Management
        </h1>

        <!-- Firebase Status -->
        <div class="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h2 class="text-lg font-semibold text-blue-800 mb-2">Firebase Status:</h2>
          <p class="text-sm text-blue-700">
            Database: {{ dbStatus }}
          </p>
        </div>

        <!-- Current Facts -->
        <div class="mb-8">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Current Facts ({{ facts.length }}):</h2>
          
          <button
            @click="loadFacts"
            :disabled="loading"
            class="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {{ loading ? 'Loading...' : 'Refresh Facts' }}
          </button>

          <div v-if="facts.length === 0 && !loading" class="text-gray-500 text-center py-8">
            No facts found. Use the button below to add sample data.
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="(fact, index) in facts"
              :key="fact.id"
              class="p-4 bg-gray-50 rounded-lg border"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <p class="text-gray-800 mb-2">{{ fact.text }}</p>
                  <p class="text-sm text-gray-500">Votes: {{ fact.votes || 0 }}</p>
                </div>
                <span class="text-xs text-gray-400">ID: {{ fact.id }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Add Sample Data -->
        <div class="border-t pt-8">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Add Sample Data:</h2>
          <p class="text-gray-600 mb-4">
            Click the button below to populate Firestore with sample carnival facts.
          </p>
          
          <button
            @click="addSampleFacts"
            :disabled="adding || !canAddFacts"
            class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ adding ? 'Adding Facts...' : 'Add Sample Facts' }}
          </button>

          <div v-if="!canAddFacts" class="mt-2 text-sm text-red-600">
            Firebase database not available. Check your configuration.
          </div>
        </div>

        <!-- Messages -->
        <div v-if="message" class="mt-6 p-4 rounded-lg" :class="messageClass">
          {{ message }}
        </div>

        <!-- Back to Home -->
        <div class="text-center mt-8">
          <NuxtLink
            to="/"
            class="inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Back to Home
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { collection, addDoc, getDocs } from 'firebase/firestore'

// Page meta
definePageMeta({
  middleware: 'admin',
  layout: 'default'
})

// State
const facts = ref([])
const loading = ref(false)
const adding = ref(false)
const message = ref('')
const messageType = ref('success')

// Firebase status
const { $firebase } = useNuxtApp()
const dbStatus = computed(() => $firebase?.db ? 'Connected' : 'Not Connected')
const canAddFacts = computed(() => !!$firebase?.db)

const messageClass = computed(() => 
  messageType.value === 'success' 
    ? 'bg-green-50 border border-green-200 text-green-800'
    : 'bg-red-50 border border-red-200 text-red-800'
)

// Sample facts data
const sampleFacts = [
  {
    text: "El carnaval de Corrientes es el segundo más importante de Argentina después del de Gualeguaychú",
    votes: 12
  },
  {
    text: "Las comparsas pueden llegar a tener más de 300 integrantes, incluyendo músicos, bailarines y carrozas",
    votes: 8
  },
  {
    text: "El corsódromo de Corrientes tiene capacidad para más de 35,000 espectadores",
    votes: 15
  },
  {
    text: "Los preparativos para el carnaval comienzan en octubre del año anterior",
    votes: 6
  },
  {
    text: "El chamamé es el ritmo tradicional que acompaña muchas de las presentaciones del carnaval",
    votes: 20
  },
  {
    text: "Las plumas de los trajes pueden llegar a pesar hasta 15 kilos por bailarín",
    votes: 25
  }
]

// Load facts from Firestore
const loadFacts = async () => {
  if (!$firebase?.db) {
    message.value = 'Firebase database not available'
    messageType.value = 'error'
    return
  }

  loading.value = true
  message.value = ''

  try {
    const factsCollection = collection($firebase.db, 'funfacts')
    const snapshot = await getDocs(factsCollection)
    facts.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    
    message.value = `Loaded ${facts.value.length} facts successfully`
    messageType.value = 'success'
  } catch (error) {
    console.error('Error loading facts:', error)
    message.value = `Error loading facts: ${error.message}`
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}

// Add sample facts to Firestore
const addSampleFacts = async () => {
  if (!$firebase?.db) {
    message.value = 'Firebase database not available'
    messageType.value = 'error'
    return
  }

  adding.value = true
  message.value = ''

  try {
    let addedCount = 0
    
    for (const fact of sampleFacts) {
      const docRef = await addDoc(collection($firebase.db, 'funfacts'), fact)
      console.log('Added fact with ID:', docRef.id)
      addedCount++
    }
    
    message.value = `Successfully added ${addedCount} sample facts!`
    messageType.value = 'success'
    
    // Reload facts to show the new data
    setTimeout(() => loadFacts(), 1000)
    
  } catch (error) {
    console.error('Error adding sample facts:', error)
    message.value = `Error adding facts: ${error.message}`
    messageType.value = 'error'
  } finally {
    adding.value = false
  }
}

// Load facts on mount
onMounted(() => {
  if (canAddFacts.value) {
    loadFacts()
  }
})
</script>