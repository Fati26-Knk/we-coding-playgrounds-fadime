import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // Use base path only for production (GitHub Pages)
  // In development, use root path '/' for localhost
  base: mode === 'production' ? '/we-coding-playgrounds-fadime/' : '/',
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://backend:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
}));
