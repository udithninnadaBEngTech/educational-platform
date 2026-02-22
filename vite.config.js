import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
  },
  // Set to your GitHub repo name when publishing to GitHub Pages
  // This project appears to be published at /desktop-tutorial/
  // so set base accordingly
  base: '/desktop-tutorial/',
})