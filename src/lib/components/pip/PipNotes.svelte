<script lang="ts">
  import { notes } from '$lib/stores/pipStores';
  // TODO: Implement notes logic (listing, creating, editing, markdown rendering)
</script>

<div class="text-sm">
  <p>Notes Component</p>
  <button class="text-xs p-1 border rounded bg-gray-100 mb-2">New Note</button>
  <ul class="list-disc pl-4">
    {#each $notes as note (note.id)}
      <li>{note.title || 'Untitled Note'}</li>
    {/each}
  </ul>
   {#if $notes.length === 0}
    <p class="text-gray-500 text-xs italic">No notes yet.</p>
  {/if}
</div>
