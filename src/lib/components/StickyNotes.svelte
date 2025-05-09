<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
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
  }

  function saveNotes() {
    if (!browser) return;
    localStorage.setItem('workspace_notes', JSON.stringify(notes));
  }

  function addNote() {
    const newNote: Note = { id: Date.now(), content: '' };
    notes = [...notes, newNote];
    saveNotes();
  }

  function deleteNote(id: number) {
    notes = notes.filter(n => n.id !== id);
    saveNotes();
  }

  function updateNote(id: number, content: string) {
    notes = notes.map(n => n.id === id ? { ...n, content } : n);
    saveNotes();
  }

  onMount(() => {
    loadNotes();
  });

  onDestroy(() => {
    // clear styles
    noteStyles = {};
  });
</script>

<div class="workspace-tool relative">
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {#each notes as note, i (note.id)}
      {#key note.id}
      {@const style = getNoteStyle(note.id, i)}
      <div
        class="p-3 rounded shadow-lg cursor-move transition-transform"
        style="background: {style.color}; transform: rotate({style.rotation}deg);"
      >
        <textarea
          class="w-full h-24 bg-transparent p-2 rounded resize-none focus:outline-none border-none outline-none bg-opacity-50 text-gray-900 dark:text-gray-900 placeholder-gray-600 dark:placeholder-gray-400"
          bind:value={note.content}
          on:input={e => updateNote(note.id, (e.target as HTMLTextAreaElement).value)}
          placeholder="Your note here..."
        ></textarea>
        <div class="flex justify-end mt-2">
          <button 
            on:click={() => updateNote(note.id, note.content)} 
            class="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 mr-1"
            aria-label="Edit note"
          >
            <i class="fas fa-edit"></i>
          </button>
          <button 
            on:click={() => deleteNote(note.id)} 
            class="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
            aria-label="Delete note"
          >
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
      {/key}
    {/each}
  </div>
  <button
    on:click={addNote}
    class="absolute bottom-4 right-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-3 shadow-lg focus:outline-none"
    aria-label="Add Note"
  >
    <i class="fas fa-plus"></i>
  </button>
</div>
