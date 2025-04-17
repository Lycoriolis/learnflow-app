<script lang="ts">
  import { todos, type TodoItem } from '$lib/stores/pipStores';
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';

  let selectedId: string | null = null;
  let editing = false;
  let editTask: TodoItem | null = null;
  let newTask: Partial<TodoItem> = { text: '', description: '', deadline: '', emergency: 3, tag: '' };

  // Filtering state
  let filterTag = '';
  let filterEmergency = 'all';

  // Drag-and-drop state
  let draggingId: string | null = null;
  let dragOverId: string | null = null;

  $: allTodos = $todos;
  $: selectedTask = allTodos.find(t => t.id === selectedId) || null;
  $: filteredTodos = allTodos.filter(task => {
    if (filterTag && task.tag !== filterTag) return false;
    if (filterEmergency !== 'all' && String(task.emergency) !== filterEmergency) return false;
    return true;
  });

  function selectTask(id: string) {
    selectedId = id;
    editing = false;
    editTask = null;
  }

  function startEdit(task: TodoItem) {
    editing = true;
    editTask = { ...task };
  }

  function saveEdit() {
    if (!editTask) return;
    todos.update(ts => ts.map(t => t.id === editTask!.id ? { ...editTask } : t));
    editing = false;
    editTask = null;
  }

  function addTask() {
    if (!newTask.text?.trim()) return;
    const task: TodoItem = {
      id: crypto.randomUUID(),
      text: newTask.text!,
      completed: false,
      createdAt: Date.now(),
      description: newTask.description || '',
      deadline: newTask.deadline || '',
      emergency: newTask.emergency || 3,
      tag: newTask.tag || ''
    };
    todos.update(ts => [...ts, task]);
    newTask = { text: '', description: '', deadline: '', emergency: 3, tag: '' };
    selectedId = task.id;
  }

  function deleteTask(id: string) {
    todos.update(ts => ts.filter(t => t.id !== id));
    if (selectedId === id) selectedId = null;
  }

  function handleDragStart(id: string) {
    draggingId = id;
  }

  function handleDragOver(id: string) {
    dragOverId = id;
  }

  function handleDrop() {
    if (draggingId && dragOverId && draggingId !== dragOverId) {
      const fromIdx = allTodos.findIndex(t => t.id === draggingId);
      const toIdx = allTodos.findIndex(t => t.id === dragOverId);
      if (fromIdx !== -1 && toIdx !== -1) {
        const reordered = [...allTodos];
        const [moved] = reordered.splice(fromIdx, 1);
        reordered.splice(toIdx, 0, moved);
        todos.set(reordered);
      }
    }
    draggingId = null;
    dragOverId = null;
  }

  function handleDragEnd() {
    draggingId = null;
    dragOverId = null;
  }
</script>

<svelte:head>
  <title>Tasks | LearnFlow</title>
</svelte:head>

<div class="flex flex-col md:flex-row h-[70vh] max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden mt-10 border border-gray-200 dark:border-gray-800">
  <!-- Left: Task List -->
  <div class="w-full md:w-1/3 border-r border-gray-100 dark:border-gray-800 bg-gradient-to-b from-indigo-50/80 dark:from-indigo-900/40 to-white dark:to-gray-900 p-6 overflow-y-auto relative">
    <h2 class="text-xl font-bold mb-4 text-indigo-700 dark:text-indigo-200 flex items-center">
      <i class="fas fa-list-check mr-2"></i> Tasks
    </h2>
    <div class="mb-4 flex flex-col gap-2">
      <input class="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-2 mb-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition" placeholder="Task name..." bind:value={newTask.text} />
      <button class="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow transition mb-2" on:click={addTask}><i class="fas fa-plus mr-1"></i> Add Task</button>
      <div class="flex gap-2 mt-2">
        <input class="flex-1 rounded border border-gray-300 dark:border-gray-600 p-1 text-xs bg-white dark:bg-gray-800" placeholder="Filter by tag..." bind:value={filterTag} />
        <select class="rounded border border-gray-300 dark:border-gray-600 p-1 text-xs bg-white dark:bg-gray-800" bind:value={filterEmergency}>
          <option value="all">All</option>
          <option value="1">Low</option>
          <option value="2">Medium-Low</option>
          <option value="3">Medium</option>
          <option value="4">High</option>
          <option value="5">Critical</option>
        </select>
      </div>
    </div>
    <ul class="space-y-1">
      {#each filteredTodos as task (task.id)}
        <li class="mb-1"
          draggable
          on:dragstart={() => handleDragStart(task.id)}
          on:dragover|preventDefault={() => handleDragOver(task.id)}
          on:drop={handleDrop}
          on:dragend={handleDragEnd}
          class:opacity-50={draggingId === task.id}
          class:ring-2={dragOverId === task.id && draggingId !== task.id}
          class:ring-indigo-400={dragOverId === task.id && draggingId !== task.id}
          transition:fly={{ y: 10, duration: 200, easing: quintOut }}
        >
          <button class="w-full text-left px-3 py-2 rounded-lg transition font-medium flex items-center justify-between group shadow-sm {selectedId === task.id ? 'bg-indigo-100 dark:bg-indigo-700 text-indigo-800 dark:text-indigo-100 ring-2 ring-indigo-400' : 'hover:bg-indigo-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200'}" on:click={() => selectTask(task.id)}>
            <span class="truncate flex-1">{task.text}</span>
            {#if task.completed}
              <i class="fas fa-check-circle text-green-500 ml-2"></i>
            {/if}
            {#if task.emergency && task.emergency >= 4}
              <span class="ml-2 px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 animate-pulse">!</span>
            {/if}
          </button>
        </li>
      {/each}
    </ul>
    {#if filteredTodos.length === 0}
      <div class="flex flex-col items-center mt-16 text-indigo-300 dark:text-indigo-700 animate-fade-in">
        <i class="fas fa-inbox text-4xl mb-2"></i>
        <p class="text-base font-medium">No tasks match your filter.</p>
      </div>
    {/if}
    <!-- Floating add button for mobile -->
    <button class="md:hidden fixed bottom-8 right-8 z-40 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg p-4 transition" on:click={() => document.querySelector('input[placeholder="Task name..."]')?.focus()} aria-label="Add Task">
      <i class="fas fa-plus text-xl"></i>
    </button>
  </div>

  <!-- Right: Task Details -->
  <div class="flex-1 p-8 flex flex-col justify-center bg-gradient-to-b from-white dark:from-gray-900 to-indigo-50/60 dark:to-indigo-950">
    {#if selectedTask}
      {#if editing}
        <div in:fade>
          <h3 class="text-lg font-bold mb-4 text-indigo-700 dark:text-indigo-200">Edit Task</h3>
          <input class="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-2 mb-2 text-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold shadow focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition" bind:value={editTask.text} />
          <textarea class="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-2 mb-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow" rows="3" bind:value={editTask.description} placeholder="Description..." />
          <div class="flex flex-wrap gap-2 mb-2">
            <input type="date" class="rounded-lg border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow" bind:value={editTask.deadline} />
            <select class="rounded-lg border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow" bind:value={editTask.emergency}>
              <option value="1">Low</option>
              <option value="2">Medium-Low</option>
              <option value="3">Medium</option>
              <option value="4">High</option>
              <option value="5">Critical</option>
            </select>
            <input class="rounded-lg border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow" placeholder="Tag" bind:value={editTask.tag} />
          </div>
          <div class="flex space-x-2 mt-2">
            <button class="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition shadow" on:click={saveEdit}><i class="fas fa-save mr-1"></i> Save</button>
            <button class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition shadow" on:click={() => { editing = false; editTask = null; }}><i class="fas fa-times mr-1"></i> Cancel</button>
          </div>
        </div>
      {:else}
        <div in:fade>
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              {selectedTask.text}
              {#if selectedTask.tag}
                <span class="ml-3 px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-700">
                  {selectedTask.tag}
                </span>
              {/if}
            </h3>
            <div class="flex space-x-2">
              <button class="px-3 py-1 bg-yellow-400 text-white rounded-lg font-semibold hover:bg-yellow-500 transition shadow" on:click={() => startEdit(selectedTask)}><i class="fas fa-edit"></i></button>
              <button class="px-3 py-1 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition shadow" on:click={() => deleteTask(selectedTask.id)}><i class="fas fa-trash"></i></button>
            </div>
          </div>
          <div class="mb-4 text-gray-700 dark:text-gray-200">
            <div class="mb-2 flex items-center">
              <span class="font-semibold mr-2">Description:</span>
              {#if selectedTask.description}
                <span>{selectedTask.description}</span>
              {:else}
                <span class="italic text-gray-400">No description</span>
              {/if}
            </div>
            <div class="mb-2 flex items-center">
              <span class="font-semibold mr-2">Deadline:</span>
              {#if selectedTask.deadline}
                <span class="inline-flex items-center px-2 py-0.5 rounded bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-200 font-semibold text-xs border border-pink-200 dark:border-pink-800">
                  <i class="fas fa-calendar-day mr-1"></i> {new Date(selectedTask.deadline).toLocaleDateString()}
                </span>
              {:else}
                <span class="italic text-gray-400">No deadline</span>
              {/if}
            </div>
            <div class="mb-2 flex items-center"><span class="font-semibold mr-2">Emergency:</span> <span class="inline-flex items-center px-2 py-0.5 rounded bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 font-bold text-xs border border-red-200 dark:border-red-800">{selectedTask.emergency || 3} / 5</span></div>
          </div>
          <div class="flex items-center space-x-2 mt-4">
            <span class="text-sm text-gray-500">Created: {new Date(selectedTask.createdAt).toLocaleString()}</span>
            {#if selectedTask.completed}
              <span class="ml-2 px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Completed</span>
            {/if}
          </div>
        </div>
      {/if}
    {:else}
      <div class="flex flex-col items-center justify-center h-full text-indigo-200 dark:text-indigo-800 animate-fade-in">
        <i class="fas fa-tasks text-5xl mb-4"></i>
        <div class="text-lg font-semibold">Select a task to see details</div>
      </div>
    {/if}
  </div>
</div>

<style>
  .animate-fade-in {
    animation: fadeIn 0.7s;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>
