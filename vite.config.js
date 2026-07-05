import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/psytech-suno-track-generator/' // Substitua pelo nome do seu repositorio no github
})
