import type { Config } from 'tailwindcss'

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
      // Standardized spacing system
      spacing: {
        'container': '1.5rem', // 24px - Standard container padding
        'section': '4rem',      // 64px - Standard section spacing
        'section-lg': '5rem',   // 80px - Large section spacing for heroes
        'card': '1.5rem',       // 24px - Standard card padding
        'card-lg': '2rem',      // 32px - Large card padding
      },
      // Standardized max-widths
      maxWidth: {
        'container': '72rem',   // 1152px - Standard container (6xl)
        'content': '64rem',     // 1024px - Content areas (4xl)
        'prose': '48rem',       // 768px - Text content (3xl)
      },
    },
    screens: {
      'xs': '375px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
  },
  plugins: [],
} satisfies Config