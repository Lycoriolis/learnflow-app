<script lang="ts">
  import type { LayoutData } from './$types';
  export let data: LayoutData;
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
  <slot />
</div>