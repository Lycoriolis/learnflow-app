import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    // turn off dev source maps
    sourcemap: false
  },
  build: {
    // turn off build source maps
    sourcemap: false
  }
});
