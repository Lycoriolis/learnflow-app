import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  test: { // Added test configuration
    globals: true,
    environment: 'jsdom', // Or 'happy-dom'
    include: ['src/**/*.{test,spec}.{js,ts}', 'tests/**/*.{test,spec}.{js,ts}'],
  },
  server: {
    host: true,
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
  // Fix dependency optimization issues
  optimizeDeps: {
    exclude: [
      'firebase/auth', 
      'firebase/app', 
      'firebase/firestore', 
      'firebase/analytics'
    ],
    include: [
      'marked',
      'dompurify',
      'highlight.js',
      'katex',
      'clsx',
      'chart.js',
      'chartjs-adapter-date-fns',
      'date-fns/locale'
    ]
  },
  // Increase build performance
  build: {
    target: 'es2015',
    sourcemap: true,
    chunkSizeWarningLimit: 1000,
    // Ensure proper font handling
    assetsInlineLimit: 0, // Don't inline any assets
    // Ensure the server build correctly identifies server-only files
    ssrManifest: true,
  },
  css: {
    // Ensure proper CSS source maps
    devSourcemap: true,
  },
  // Fix potential path aliasing issues
  resolve: {
    alias: {
      $lib: '/src/lib',
      $components: '/src/lib/components'
    }
  }
});
