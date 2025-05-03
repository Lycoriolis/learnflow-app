<script lang="ts">
  export let size: 'sm' | 'md' | 'lg' = 'md';
  
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };
</script>

<div class="flex justify-center items-center">
  <div
    class="animate-spin rounded-full border-2 border-gray-300 dark:border-gray-700 border-t-indigo-500 dark:border-t-indigo-400 {sizeClasses[size]}"
    role="status"
    aria-label="Loading"
  >
    <span class="sr-only">Loading...</span>
  </div>
</div> 