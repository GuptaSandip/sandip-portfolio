import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    port: 5173,
    // Proxy all /api calls to FastAPI backend
    // This means VITE_API_URL can stay empty in .env.local
    proxy: {
      '/api': {
        target:       'http://localhost:8000',
        changeOrigin: true,
        secure:       false,
      },
    },
  },

  build: {
    outDir:    'dist',
    sourcemap: false,
  },
})