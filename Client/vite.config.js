import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // Ensure correct base path for Render
  server: {
    host: '0.0.0.0', // Required for Render
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Local dev only
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist', // Output directory for production
  },
});