import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  optimizeDeps: {
    include: ['@splidejs/splide']
  },
  resolve: {
    dedupe: ['@splidejs/splide']
  }
});
