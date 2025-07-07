<template>
  <div class="min-h-screen bg-gray-50">
    <MenuBar />
    
    <main>
      <slot />
    </main>
    
    <!-- Global Notification Container -->
    <NotificationContainer />
  </div>
</template>

<script setup>
// This layout is automatically used for all pages unless otherwise specified
</script>