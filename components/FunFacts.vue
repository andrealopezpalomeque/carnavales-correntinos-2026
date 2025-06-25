<template>
  <section id="fun-facts" class="py-12 flex flex-col items-center">
    <h2 class="text-xl font-bold mb-6">Curiosidades del Carnaval</h2>
    <div v-for="fact in facts" :key="fact.id" class="bg-white rounded-lg shadow p-4 m-2 w-full max-w-md flex justify-between items-center">
      <span>{{ fact.text }}</span>
      <button
        class="ml-4 bg-primary text-white px-3 py-1 rounded hover:bg-secondary"
        @click="handleVote(fact.id)"
      >
        👍 {{ fact.votes }}
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { collection, getDocs, doc, updateDoc, increment, getFirestore } from 'firebase/firestore'
const facts = ref([])

async function fetchFacts(db) {
  const factsCollection = collection(db, 'funfacts')
  const snapshot = await getDocs(factsCollection)
  facts.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

async function voteFact(db, id) {
  const factRef = doc(db, 'funfacts', id)
  await updateDoc(factRef, { votes: increment(1) })
  await fetchFacts(db) // Refresh after voting
}

onMounted(async () => {
  const { $db } = useNuxtApp()
  if ($db) {
    await fetchFacts($db)
  }
})

function handleVote(id) {
  const { $db } = useNuxtApp()
  if ($db) {
    voteFact($db, id)
  }
}
</script>
