import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
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
