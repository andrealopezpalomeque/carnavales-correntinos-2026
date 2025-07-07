export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/google-fonts',
  ],
  app: {
    head: {
      link: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🥳</text></svg>"
        }
      ]
    }
  },
  // Static Generation for Firebase Hosting
  ssr: false,
  nitro: {
    preset: 'static',
    esbuild: {
      options: {
        target: 'esnext'
      }
    }
  },
  css: [
    '@/assets/css/style.css',
    '@/assets/css/main.css',
  ],
  googleFonts: {
    useStylesheet: true,
    display: 'swap',
    families: {
      Inter: {
        wght: [400, 500, 700],
      },
      Poppins: {
        wght: [400, 500, 600, 700],
      }, 
    },
  },
  runtimeConfig: {
    // Private keys are only available on server
    // apiSecret: '...',
    
    // Public keys that are exposed to the client
    public: {
      FIREBASE_API_KEY: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: process.env.NUXT_PUBLIC_FIREBASE_APP_ID,
    }
  }
})