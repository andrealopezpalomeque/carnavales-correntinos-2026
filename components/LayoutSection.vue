<template>
  <section 
    :id="id"
    :class="sectionClass"
    :aria-labelledby="ariaLabelledby"
    :role="role"
  >
    <LayoutContainer 
      :variant="container"
      :class="containerClass"
    >
      <slot />
    </LayoutContainer>
  </section>
</template>

<script setup lang="ts">
interface Props {
  /**
   * Section ID for navigation
   */
  id?: string
  
  /**
   * Container variant to use inside section
   */
  container?: 'app' | 'content' | 'prose' | 'narrow' | 'wide'
  
  /**
   * Background variant
   * - default: No background
   * - muted: Light gray background
   * - gradient: Green gradient background
   * - white: White background
   */
  background?: 'default' | 'muted' | 'gradient' | 'white'
  
  /**
   * Vertical spacing
   * - compact: Small padding (1.5rem)
   * - base: Standard padding (4rem)
   * - hero: Hero section padding (responsive)
   * - large: Large padding (5rem)
   */
  spacing?: 'compact' | 'base' | 'hero' | 'large'
  
  /**
   * Minimum height
   * - auto: Natural height
   * - screen: Full viewport height
   * - half: Half viewport height
   * - content: Minimum content height (30vh)
   */
  minHeight?: 'auto' | 'screen' | 'half' | 'content'
  
  /**
   * Custom section classes
   */
  class?: string
  
  /**
   * Custom container classes
   */
  containerClass?: string
  
  /**
   * ARIA labelledby reference
   */
  ariaLabelledby?: string
  
  /**
   * ARIA role override
   */
  role?: string
}

const props = withDefaults(defineProps<Props>(), {
  container: 'app',
  background: 'default',
  spacing: 'base',
  minHeight: 'auto',
})

// Compute section classes
const sectionClass = computed(() => {
  const classes = []
  
  // Background classes
  switch (props.background) {
    case 'muted':
      classes.push('bg-gray-50')
      break
    case 'gradient':
      classes.push('bg-gradient-to-br from-green-50 to-emerald-50')
      break
    case 'white':
      classes.push('bg-white')
      break
    // 'default' adds no background
  }
  
  // Spacing classes
  switch (props.spacing) {
    case 'compact':
      classes.push('section-compact')
      break
    case 'base':
      classes.push('section-base')
      break
    case 'hero':
      classes.push('section-hero')
      break
    case 'large':
      classes.push('section-large')
      break
  }
  
  // Min height classes
  switch (props.minHeight) {
    case 'screen':
      classes.push('min-h-screen')
      break
    case 'half':
      classes.push('min-h-[50vh]')
      break
    case 'content':
      classes.push('min-h-[30vh]')
      break
    // 'auto' adds no min-height
  }
  
  // Position utilities for certain layouts
  if (props.background === 'gradient') {
    classes.push('relative overflow-hidden')
  }
  
  // Custom classes
  if (props.class) {
    classes.push(props.class)
  }
  
  return classes.join(' ')
})
</script>

<style scoped>
/* All styles are handled by Tailwind components */
</style>