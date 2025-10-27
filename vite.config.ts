import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use base path only for production (GitHub Pages)
  // In development, use root path '/' for localhost
  base:
    process.env['NODE_ENV'] === 'production'
      ? '/we-coding-playgrounds-fadime/'
      : '/',
});
