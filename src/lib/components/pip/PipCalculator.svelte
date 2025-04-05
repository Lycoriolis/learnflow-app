<script lang="ts">
  import { calcDisplay } from '$lib/stores/pipStores';
  // TODO: Implement calculator logic
</script>

<div class="text-sm">
  <p>Calculator Component</p>
  <div class="bg-gray-200 p-2 rounded mb-2 text-right font-mono">{$calcDisplay}</div>
  <div class="grid grid-cols-4 gap-1">
    <button class="p-1 border rounded bg-gray-100">7</button>
    <button class="p-1 border rounded bg-gray-100">8</button>
    <button class="p-1 border rounded bg-gray-100">9</button>
    <button class="p-1 border rounded bg-yellow-200">/</button>
    <!-- Add more buttons -->
  </div>
</div>
