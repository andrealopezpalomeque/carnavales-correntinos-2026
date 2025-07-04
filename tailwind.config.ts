/** @type {import('tailwindcss').Config} */
module.exports = {
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
        primary: '#7b34dd',
        secondary: '#f02e65',
        accent: '#ffc107',
        neutral: '#f4f4f4',
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
}