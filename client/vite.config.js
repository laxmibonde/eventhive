import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Proxy all /api calls to the Express backend during development
      '/api': {
        target: 'https://eventhive-gdf5.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
