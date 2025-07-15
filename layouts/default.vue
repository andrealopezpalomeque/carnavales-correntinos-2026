<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Skip Link for keyboard navigation -->
    <a 
      href="#main-content" 
      class="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-green-600 text-white px-4 py-2 z-50 rounded-br-md transition-all"
    >
      Saltar al contenido principal
    </a>
    
    <MenuBar />
    
    <main id="main-content">
      <slot />
    </main>
    
    <!-- Global Notification Container -->
    <NotificationContainer />
  </div>
</template>

<script setup>
// This layout is automatically used for all pages unless otherwise specified
</script>