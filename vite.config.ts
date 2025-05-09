import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,ts}'],
    setupFiles: ['src/vitest-setup.ts'], // Added setup file for jest-dom matchers
    css: true, // Enable CSS processing for tests
  },
  resolve: { // Added to prefer browser conditions for Svelte during testing
    conditions: ['browser'],
  },
  server: {
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..'],
    },
    watch: {
      // Use polling in environments where the file system doesn't support watching
      usePolling: false,
      interval: 1000,
    }
  },
  // Configure proper MIME types for all file types
  optimizeDeps: {
    exclude: ['@sveltejs/kit']
  },
  build: {
    // Ensure proper font handling
    assetsInlineLimit: 0, // Don't inline any assets
    // Ensure the server build correctly identifies server-only files
    ssrManifest: true,
  },
  css: {
    // Ensure proper CSS source maps
    devSourcemap: true,
  },
});
