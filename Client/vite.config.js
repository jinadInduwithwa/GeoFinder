import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
  },
});