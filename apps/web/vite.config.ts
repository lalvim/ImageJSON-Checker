import { defineConfig } from 'vite'
import { getDirname } from '@adonisjs/core/helpers'
import inertia from '@adonisjs/inertia/client'
import react from '@vitejs/plugin-react'
import adonisjs from '@adonisjs/vite/client'

export default defineConfig({
  plugins: [
    inertia({ ssr: { enabled: true, entrypoint: 'app/core/ui/app/ssr.tsx' } }),
    react(),
    adonisjs({ entrypoints: ['app/core/ui/app/app.tsx'], reload: ['resources/views/**/*.edge'] }),
  ],

  /**
   * Define aliases for importing modules from
   * your frontend code
   */
  resolve: {
    alias: {
      '~/': `${getDirname(import.meta.url)}/app/core/ui/`,
      '@/': `${getDirname(import.meta.url)}/app/core/ui/lib/`,
    },
  },
})
