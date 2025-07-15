import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

export default {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'Arial', 'sans-serif'],
        inter: ['Inter', 'Arial', 'sans-serif'],
      },
      colors: {
        primary: '#10b981', // emerald-500
        secondary: '#059669', // emerald-600
        accent: '#34d399', // emerald-400
        neutral: '#f4f4f4',
        green: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
      },
      // Enhanced spacing system matching current design
      spacing: {
        // Container & Layout Spacing
        'container-sm': '1.5rem',    // 24px - Mobile container padding
        'container-lg': '2rem',      // 32px - Desktop container padding
        'container-xl': '2.5rem',    // 40px - Large screen padding
        
        // Section Spacing
        'section-xs': '1.5rem',      // 24px - Compact sections
        'section-sm': '2rem',        // 32px - Small sections
        'section': '4rem',           // 64px - Standard section spacing
        'section-lg': '5rem',        // 80px - Large sections
        'section-xl': '6rem',        // 96px - Hero sections
        
        // Component Spacing
        'card-xs': '1rem',           // 16px - Compact card padding
        'card': '1.5rem',            // 24px - Standard card padding
        'card-lg': '2rem',           // 32px - Large card padding
        'card-xl': '2.5rem',         // 40px - Feature card padding
        
        // Element Spacing
        'element-xs': '0.5rem',      // 8px - Tiny spacing
        'element-sm': '0.75rem',     // 12px - Small spacing
        'element': '1rem',           // 16px - Standard spacing
        'element-lg': '1.5rem',      // 24px - Large spacing
        'element-xl': '2rem',        // 32px - Extra large spacing
        
        // Custom Layout Values
        '18': '4.5rem',              // 72px
        '22': '5.5rem',              // 88px
        '26': '6.5rem',              // 104px
        '30': '7.5rem',              // 120px
      },
      
      // Enhanced max-width system
      maxWidth: {
        // Layout Containers
        'container': '72rem',        // 1152px - Main container (matches current)
        'content': '64rem',          // 1024px - Content areas
        'prose': '48rem',            // 768px - Text content
        'narrow': '32rem',           // 512px - Narrow content
        'wide': '80rem',             // 1280px - Wide layouts
        'full': '96rem',             // 1536px - Full width layouts
        
        // Component Specific
        'modal': '32rem',            // 512px - Modal dialogs
        'card': '24rem',             // 384px - Standard cards
        'sidebar': '20rem',          // 320px - Sidebar width
      },
      
      // Enhanced breakpoint system
      screens: {
        'xs': '375px',               // Small phones
        'sm': '640px',               // Large phones
        'md': '768px',               // Tablets
        'lg': '1024px',              // Small laptops
        'xl': '1280px',              // Desktop
        '2xl': '1536px',             // Large desktop
        '3xl': '1920px',             // Extra large desktop
        
        // Custom breakpoints
        'mobile': {'max': '767px'},   // Mobile only
        'tablet': {'min': '768px', 'max': '1023px'}, // Tablet only
        'desktop': {'min': '1024px'}, // Desktop and up
      },
      
      // Enhanced animation system
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'shimmer': 'shimmer 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      
      // Enhanced shadow system
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'card-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'card-lg-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'feature': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'glow': '0 0 20px rgba(34, 197, 94, 0.3)',
      },
    },
  },
  
  plugins: [
    // Layout System Plugin
    plugin(function({ addComponents, addUtilities, theme }) {
      // Container Components
      addComponents({
        // Main Layout Containers
        '.container-app': {
          maxWidth: theme('maxWidth.container'),
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: theme('spacing.container-sm'),
          paddingRight: theme('spacing.container-sm'),
          '@media (min-width: 1024px)': {
            paddingLeft: theme('spacing.container-lg'),
            paddingRight: theme('spacing.container-lg'),
          },
        },
        
        '.container-content': {
          maxWidth: theme('maxWidth.content'),
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: theme('spacing.container-sm'),
          paddingRight: theme('spacing.container-sm'),
          '@media (min-width: 1024px)': {
            paddingLeft: theme('spacing.container-lg'),
            paddingRight: theme('spacing.container-lg'),
          },
        },
        
        '.container-prose': {
          maxWidth: theme('maxWidth.prose'),
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: theme('spacing.container-sm'),
          paddingRight: theme('spacing.container-sm'),
        },
        
        '.container-narrow': {
          maxWidth: theme('maxWidth.narrow'),
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: theme('spacing.container-sm'),
          paddingRight: theme('spacing.container-sm'),
        },
        
        '.container-wide': {
          maxWidth: theme('maxWidth.wide'),
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: theme('spacing.container-sm'),
          paddingRight: theme('spacing.container-sm'),
          '@media (min-width: 1024px)': {
            paddingLeft: theme('spacing.container-lg'),
            paddingRight: theme('spacing.container-lg'),
          },
        },
        
        // Section Components
        '.section-base': {
          paddingTop: theme('spacing.section'),
          paddingBottom: theme('spacing.section'),
        },
        
        '.section-hero': {
          paddingTop: theme('spacing.section-sm'),
          paddingBottom: theme('spacing.section-sm'),
          '@media (min-width: 768px)': {
            paddingTop: theme('spacing.section'),
            paddingBottom: theme('spacing.section'),
          },
        },
        
        '.section-compact': {
          paddingTop: theme('spacing.section-xs'),
          paddingBottom: theme('spacing.section-xs'),
        },
        
        '.section-large': {
          paddingTop: theme('spacing.section-lg'),
          paddingBottom: theme('spacing.section-lg'),
        },
        
        // Card Components
        '.card-base': {
          backgroundColor: 'white',
          borderRadius: theme('borderRadius.xl'),
          padding: theme('spacing.card'),
          boxShadow: theme('boxShadow.card'),
          transition: 'all 0.3s ease',
        },
        
        '.card-hover': {
          '&:hover': {
            boxShadow: theme('boxShadow.card-hover'),
            transform: 'translateY(-2px)',
          },
        },
        
        '.card-feature': {
          backgroundColor: 'white',
          borderRadius: theme('borderRadius.xl'),
          padding: theme('spacing.card-lg'),
          boxShadow: theme('boxShadow.card-lg'),
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: theme('boxShadow.feature'),
            transform: 'translateY(-8px)',
          },
        },
        
        '.card-compact': {
          backgroundColor: 'white',
          borderRadius: theme('borderRadius.lg'),
          padding: theme('spacing.card-xs'),
          boxShadow: theme('boxShadow.card'),
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: theme('boxShadow.card-hover'),
          },
        },
        
        // Button Components
        '.btn-base': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: theme('borderRadius.lg'),
          fontWeight: theme('fontWeight.medium'),
          transition: 'all 0.2s ease',
          cursor: 'pointer',
          '&:disabled': {
            opacity: '0.5',
            cursor: 'not-allowed',
          },
        },
        
        '.btn-primary': {
          padding: `${theme('spacing.3')} ${theme('spacing.6')}`,
          backgroundColor: theme('colors.green.600'),
          color: 'white',
          boxShadow: theme('boxShadow.card'),
          '&:hover:not(:disabled)': {
            backgroundColor: theme('colors.green.700'),
            transform: 'translateY(-1px)',
            boxShadow: theme('boxShadow.card-hover'),
          },
        },
        
        '.btn-secondary': {
          padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
          backgroundColor: 'white',
          color: theme('colors.gray.700'),
          border: `1px solid ${theme('colors.gray.300')}`,
          '&:hover:not(:disabled)': {
            backgroundColor: theme('colors.gray.50'),
            borderColor: theme('colors.gray.400'),
            boxShadow: theme('boxShadow.card'),
          },
        },
      })
      
      // Layout Utilities
      addUtilities({
        // Flex utilities
        '.flex-center': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        
        '.flex-between': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        
        '.flex-start': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
        },
        
        '.flex-end': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        },
        
        // Grid utilities
        '.grid-auto-fit': {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: theme('spacing.6'),
        },
        
        '.grid-auto-fill': {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: theme('spacing.6'),
        },
        
        // Aspect ratio utilities
        '.aspect-card': {
          aspectRatio: '4 / 3',
        },
        
        '.aspect-video': {
          aspectRatio: '16 / 9',
        },
        
        '.aspect-square': {
          aspectRatio: '1 / 1',
        },
      })
    }),
  ],
} satisfies Config