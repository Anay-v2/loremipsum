// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from '@primevue/themes/aura';

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    'nuxt-typed-router',
    'nuxt-lucide-icons',
    '@primevue/nuxt-module',
    '@nuxtjs/google-fonts',
    'nuxt-vuefire'
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
      'postcss-preset-env': {}
    },
  },
  primevue: {
    options: {
        theme: {
            preset: Aura
        }
    }
  },
  googleFonts: {
    families: {
      'Roboto+Slab': true,
      Roboto: true,
      'Roboto+Mono': true
    }
  },
  vuefire: {
    auth: {
      enabled: true
    },
    config: {
      apiKey: import.meta.env.API_KEY,
      authDomain: import.meta.env.AUTH_DOMAIN,
      databaseURL: import.meta.env.DATABASE_URL,
      projectId: import.meta.env.PROJECT_ID,
      storageBucket: import.meta.env.STORAGE_BUCKET,
      messagingSenderId: import.meta.env.MESSAGING_SENDER_ID,
      appId: import.meta.env.APP_ID,
    }
  },
})