<template>
  <div 
    :class="containerClass"
    :role="role"
    :aria-labelledby="ariaLabelledby"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  /**
   * Container variant - determines max-width and padding
   * - app: Main application container (72rem, matches menubar)
   * - content: Content areas (64rem)
   * - prose: Text content (48rem)
   * - narrow: Narrow content (32rem)
   * - wide: Wide layouts (80rem)
   */
  variant?: 'app' | 'content' | 'prose' | 'narrow' | 'wide'
  
  /**
   * Section spacing variant
   * - none: No vertical padding
   * - compact: Small padding (1.5rem)
   * - base: Standard padding (4rem)
   * - hero: Hero section padding (responsive)
   * - large: Large padding (5rem)
   */
  section?: 'none' | 'compact' | 'base' | 'hero' | 'large'
  
  /**
   * Custom CSS classes to append
   */
  class?: string
  
  /**
   * ARIA role for semantic markup
   */
  role?: string
  
  /**
   * ARIA labelledby reference
   */
  ariaLabelledby?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'app',
  section: 'none',
})

// Compute container classes
const containerClass = computed(() => {
  const classes = []
  
  // Base container class based on variant
  switch (props.variant) {
    case 'app':
      classes.push('container-app')
      break
    case 'content':
      classes.push('container-content')
      break
    case 'prose':
      classes.push('container-prose')
      break
    case 'narrow':
      classes.push('container-narrow')
      break
    case 'wide':
      classes.push('container-wide')
      break
  }
  
  // Section spacing class
  switch (props.section) {
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
    // 'none' adds no spacing class
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