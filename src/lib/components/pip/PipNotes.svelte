<script lang="ts">
  import { notes, type NoteItem } from '$lib/stores/pipStores.js';
  import { fade } from 'svelte/transition';
  import { flip } from 'svelte/animate';

  let newNoteContent = '';
  let showNewNoteInput = false;

  function addNote() {
    const content = newNoteContent.trim();
    if (!content) return;

    // Simple title generation (first few words or line)
    const title = content.split('\n')[0].substring(0, 30) || 'Untitled Note';

    const newNote: NoteItem = {
      id: crypto.randomUUID(),
      title: title,
      content: content,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    notes.update(currentNotes => [newNote, ...currentNotes]); // Add to top
    newNoteContent = ''; // Clear input
    showNewNoteInput = false; // Hide input
  }

  function startNewNote() {
      showNewNoteInput = true;
      // TODO: Focus the textarea after it appears (requires a tick or timeout)
  }

  function cancelNewNote() {
      showNewNoteInput = false;
      newNoteContent = '';
  }

  // Function to delete a note (optional)
  function deleteNote(id: string) {
    notes.update(currentNotes => currentNotes.filter(note => note.id !== id));
  }

</script>

<div class="bg-gray-700 p-2 rounded-lg">
  <div class="flex justify-between items-center mb-2">
    <h4 class="text-xs font-medium text-blue-300 uppercase">Quick Notes</h4>
    {#if !showNewNoteInput}
      <button
        on:click={startNewNote}
        class="px-2 py-0.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        + New
      </button>
    {/if}
  </div>

  {#if showNewNoteInput}
     <div transition:fade={{duration: 150}}>
       <textarea
         bind:value={newNoteContent}
         placeholder="Start typing your note..."
         rows="3"
         class="w-full text-sm bg-gray-600 text-gray-100 border border-gray-500 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 mb-1"
         aria-label="Note content"
       ></textarea>
        <div class="flex justify-end space-x-2">
           <button
             on:click={cancelNewNote}
             class="px-3 py-1 bg-gray-500 hover:bg-gray-400 text-gray-100 rounded text-xs font-medium transition duration-150 focus:outline-none focus:ring-2 focus:ring-gray-400"
           >
             Cancel
           </button>
           <button
             on:click={addNote}
             disabled={!newNoteContent.trim()}
             class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
           >
             Save Note
           </button>
        </div>
     </div>
  {/if}

  {#if $notes.length > 0 && !showNewNoteInput}
    <ul class="space-y-1 max-h-40 overflow-y-auto pr-1 mt-2">
      {#each $notes.sort((a, b) => b.updatedAt - a.updatedAt) as note (note.id)}
        <li
          class="group flex justify-between items-center text-sm p-1.5 bg-gray-600 hover:bg-gray-500 transition duration-150 rounded-md cursor-pointer"
          animate:flip={{ duration: 200 }}
          transition:fade={{ duration: 150 }}
          title={note.content.substring(0, 100) + (note.content.length > 100 ? '...' : '')}
        >
          <span class="text-gray-100 truncate pr-2">{note.title}</span>
          <button
             on:click|stopPropagation={() => deleteNote(note.id)}
             class="ml-2 px-1 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150 focus:outline-none"
             aria-label="Delete note"
           >
             <i class="fas fa-trash-alt fa-xs"></i>
           </button>
        </li>
      {/each}
    </ul>
  {:else if !showNewNoteInput}
    <p class="text-gray-400 text-xs italic text-center py-2">No notes yet. Click '+ New' to add one.</p>
  {/if}
</div>
