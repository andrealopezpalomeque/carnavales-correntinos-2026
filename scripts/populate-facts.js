// Script to populate Firestore with sample fun facts
// Run this in your browser console on your deployed app or locally

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

// To run this script:
// 1. Open your browser's developer console
// 2. Make sure you're logged in to your app
// 3. Copy and paste this code

async function populateFacts() {
  try {
    console.log('Starting to populate facts...')
    
    // Get Firebase instance
    const { $firebase } = window.$nuxt.$app
    if (!$firebase || !$firebase.db) {
      console.error('Firebase not available')
      return
    }

    const { collection, addDoc } = await import('firebase/firestore')
    
    for (const fact of sampleFacts) {
      const docRef = await addDoc(collection($firebase.db, 'funfacts'), fact)
      console.log('Added fact with ID:', docRef.id)
    }
    
    console.log('All facts added successfully!')
  } catch (error) {
    console.error('Error adding facts:', error)
  }
}

// Uncomment the line below to run the script
// populateFacts()

console.log('Sample facts script loaded. Call populateFacts() to add sample data to Firestore.')