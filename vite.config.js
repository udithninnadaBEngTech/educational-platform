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
  // Base path for GitHub Pages (set to your repo name)
  // Published site: https://udithninnadabengtech.github.io/educational-platform/
  base: '/educational-platform/',
})