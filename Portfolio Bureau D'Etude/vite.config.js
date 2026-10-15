import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { seoPlugin } from './scripts/seo-config.mjs'

export default defineConfig({
  base: '/Projet-Personnel/Portfolio-Bureau-Etudes/',
  plugins: [react(), tailwindcss(), seoPlugin()],
  // Originals remain intact in public/images; only optimized site assets ship.
  publicDir: 'public/site',
  server: { port: 5173, strictPort: true },
  preview: { port: 4173, strictPort: true },
  build: { target: 'es2022' },
})
