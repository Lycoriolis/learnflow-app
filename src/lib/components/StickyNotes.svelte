<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  interface Note { id: number; content: string; }
  let notes: Note[] = [];
  // Pastel color palette and per-note styles
  const colors = ['#FFEB3B','#FFCDD2','#C8E6C9','#BBDEFB','#D1C4E9','#F0F4C3'];
  let noteStyles: Record<number,{color:string,rotation:number}> = {};
  function getNoteStyle(id: number, index: number) {
    if (!noteStyles[id]) {
      noteStyles[id] = {
        color: colors[index % colors.length],
        rotation: (Math.random() * 6) - 3
      };
    }
    return noteStyles[id];
  }

  function loadNotes() {
    if (!browser) return;
    const data = localStorage.getItem('workspace_notes');
    notes = data ? JSON.parse(data) : [];
    // Initialize styles for loaded notes
    notes.forEach((note, i) => getNoteStyle(note.id, i));
  }

  function saveNotes() {
    if (!browser) return;
    localStorage.setItem('workspace_notes', JSON.stringify(notes));
  }

  function addNote() {
    const newNote: Note = { id: Date.now(), content: '' };
    notes = [...notes, newNote];
    // Initialize style for the new note immediately
    getNoteStyle(newNote.id, notes.length - 1);
    saveNotes();
  }

  function deleteNote(id: number) {
    notes = notes.filter(n => n.id !== id);
    delete noteStyles[id]; // Clean up style
    saveNotes();
  }

  function updateNote(id: number, content: string) {
    notes = notes.map(n => n.id === id ? { ...n, content } : n);
    // Debounce saving? For now, save on every input
    saveNotes();
  }

  onMount(() => {
    loadNotes();
  });

  // Handle key presses in a focused note
  function handleNoteKeydown(event: KeyboardEvent, noteId: number) {
    // Add support for keyboard navigation
    if (event.shiftKey && event.key === 'Delete') {
      event.preventDefault();
      deleteNote(noteId);
    }
  }
</script>

<div class="workspace-tool relative">
  <div class="border-2 border-transparent rounded-xl bg-gradient-to-br from-gray-600 to-gray-700 p-1 transition-transform hover:scale-105">
    <div class="bg-[#0D1117] p-4 rounded-lg shadow-lg">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {#each notes as note, i (note.id)}
          {@const style = getNoteStyle(note.id, i)}
          <div role="article"
            aria-label={`Sticky note ${i + 1}`}
            class="p-3 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 transform"
            style="background: {style.color}; transform: rotate({style.rotation}deg);"
          >
            <textarea
              aria-label={`Content for sticky note ${i + 1}`}
              class="w-full h-24 bg-transparent p-2 rounded resize-none focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 border-none outline-none bg-opacity-50 text-gray-900 dark:text-gray-900 placeholder-gray-600 dark:placeholder-gray-400"
              bind:value={note.content}
              on:input={e => updateNote(note.id, (e.target as HTMLTextAreaElement).value)}
              placeholder="Your note here..."
              on:keydown={(e) => handleNoteKeydown(e, note.id)}
            ></textarea>
            <div class="flex justify-end mt-2">
              <button 
                on:click={() => deleteNote(note.id)} 
                class="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-700"
                aria-label={`Delete note ${i + 1}`}
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        {/each}
      </div>
      <button
        on:click={addNote}
        class="absolute bottom-4 right-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-3 shadow-lg transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        aria-label="Add Note"
      >
        <i class="fas fa-plus"></i>
      </button>
    </div>
  </div>
</div>
