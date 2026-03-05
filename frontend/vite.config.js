import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    pool: 'threads',
    poolOptions: {
      threads: {
        maxThreads: 1,
        minThreads: 1,
      },
    },
    globals: true, environment: 'jsdom',    // Simule un navigateur
    setupFiles: './setupTests.js', // Charge les extensions jest-dom
    // Configuration de l'affichage (Reporter)
    reporters: ['default', {
      onFinished(files) {
        console.log('\n--- RÉSUMÉ PERSONNALISÉ ---');
      }
    }],
    // Désactive le multi-threading lourd pour plus de stabilité
    watch: false,
  },
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
})
