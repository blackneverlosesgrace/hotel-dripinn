import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/hotel-dripinn/',
  server: {
    allowedHosts: ['testaceous-insistently-terrilyn.ngrok-free.dev'],
    proxy: {
      '/api': {
        target: 'https://hoteldripinn-qcajs976t-swatis-projects-d5718665.vercel.app',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
