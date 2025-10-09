import { defineConfig } from 'vite';

export default defineConfig({
  root: './',
  base:
    process.env.GITHUB_ACTIONS != null ? '/we-coding-playgrounds-fadime/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  publicDir: 'media',
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
