<template>
  <div>
    <MenuBar />
    <section id="countdown" class="pt-20 min-h-[60vh] flex flex-col items-center justify-center">
      <Countdown />
    </section>
    <!-- Add placeholder for Photos and FunFacts -->
    <section id="photos" class="min-h-[30vh] flex flex-col items-center justify-center">
      <h2 class="text-xl font-bold my-8">Galería (Próximamente)</h2>
    </section>
    <section id="fun-facts" class="min-h-[30vh] flex flex-col items-center justify-center">
      <FunFacts/>
    </section>
  </div>
</template>

<script setup>
import MenuBar from '~/components/MenuBar.vue'
import Countdown from '~/components/Countdown.vue'
import FunFacts from '~/components/FunFacts.vue'
</script>
