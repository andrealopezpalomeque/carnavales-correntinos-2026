<template>
  <div>
    <MenuBar />
    <section id="countdown" class="section-compact min-h-[60vh] flex flex-col items-center justify-center">
      <Countdown />
    </section>
    <section id="photos" class="min-h-[30vh] flex flex-col items-center justify-center">
      <Gallery/>
    </section>
    <section id="fun-facts" class="min-h-[30vh] flex flex-col items-center justify-center">
      <FunFacts/>
    </section>
    <section id="related-news" class="min-h-[30vh] flex flex-col items-center justify-center">
      <RelatedNews/>
    </section>
  </div>
</template>

<script setup>
import MenuBar from '~/components/MenuBar.vue'
import Countdown from '~/components/Countdown.vue'
import FunFacts from '~/components/FunFacts.vue'
import Gallery from '~/components/Gallery.vue'
import RelatedNews from '~/components/RelatedNews.vue'
</script>
