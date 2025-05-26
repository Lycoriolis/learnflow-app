<script lang="ts">
  import { todos, type TodoItem } from '$lib/stores/pipStores';
  import { onMount } from 'svelte';
  import { fade, fly, scale, slide } from 'svelte/transition';
  import { quintOut, cubicOut, bounceOut, elasticOut } from 'svelte/easing';

  let selectedId: string | null = null;
  let editing = false;
  let editTask: TodoItem | null = null;
  let newTask: Partial<TodoItem> = { text: '', description: '', deadline: '', emergency: 3, tag: '' };
  let showAddPanel = false;
  let isMobile = false;

  // Filtering state
  let filterTag = '';
  let filterEmergency = 'all';
  let searchTerm = '';
  let sortBy = 'createdAt'; // Options: createdAt, emergency, deadline
  let sortDir = 'desc'; // Options: asc, desc

  // Drag-and-drop state
  let draggingId: string | null = null;
  let dragOverId: string | null = null;

  onMount(() => {
    const checkMobile = () => {
      isMobile = window.innerWidth < 768;
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  });

  // Task data processing
  $: allTodos = $todos;
  $: selectedTask = allTodos.find(t => t.id === selectedId) || null;
  $: filteredTodos = allTodos.filter(task => {
    if (filterTag && task.tag !== filterTag) return false;
    if (filterEmergency !== 'all' && String(task.emergency) !== filterEmergency) return false;
    if (searchTerm && !task.text.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    let aVal = sortBy === 'deadline' ? (a.deadline ? new Date(a.deadline).getTime() : Infinity) :
              sortBy === 'emergency' ? a.emergency : 
              a.createdAt;
    
    let bVal = sortBy === 'deadline' ? (b.deadline ? new Date(b.deadline).getTime() : Infinity) :
              sortBy === 'emergency' ? b.emergency : 
              b.createdAt;
              
    return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
  });

  $: uniqueTags = [...new Set(allTodos.map(t => t.tag).filter(Boolean))];
  $: completedCount = allTodos.filter(t => t.completed).length;
  $: totalCount = allTodos.length;
  $: progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Task functions
  function selectTask(id: string) {
    selectedId = id;
    editing = false;
    editTask = null;
    if (isMobile) {
      showAddPanel = false;
    }
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

  function toggleTaskComplete(task: TodoItem) {
    todos.update(ts => ts.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t));
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
    showAddPanel = false;
  }

  function deleteTask(id: string) {
    todos.update(ts => ts.filter(t => t.id !== id));
    if (selectedId === id) selectedId = null;
  }

  function clearCompletedTasks() {
    todos.update(ts => ts.filter(t => !t.completed));
    if (selectedTask?.completed) selectedId = null;
  }

  // Drag and drop functions
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

  function handleTaskKeydown(event: KeyboardEvent, taskId: string) {
    if (event.key === 'Enter' || event.key === ' ') {
      selectTask(taskId);
    }
  }

  // UI helper functions
  function getEmergencyColor(level: number) {
    switch(Number(level)) {
      case 1: return 'bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-300 border-green-200 dark:border-green-800';
      case 2: return 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 3: return 'bg-yellow-50 dark:bg-yellow-950 text-yellow-600 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      case 4: return 'bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-300 border-orange-200 dark:border-orange-800';
      case 5: return 'bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-300 border-red-200 dark:border-red-800';
      default: return 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  }

  function getEmergencyLabel(level: number) {
    switch(Number(level)) {
      case 1: return 'Low';
      case 2: return 'Medium-Low';
      case 3: return 'Medium';
      case 4: return 'High';
      case 5: return 'Critical';
      default: return 'None';
    }
  }

  function getTaskStatusClass(task: TodoItem) {
    if (task.completed) {
      return 'opacity-75';
    }
    
    if (task.deadline) {
      const deadlineDate = new Date(task.deadline);
      const today = new Date();
      const timeDiff = deadlineDate.getTime() - today.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      if (daysDiff < 0) {
        return 'border-l-4 border-l-red-500 dark:border-l-red-400';
      } else if (daysDiff <= 1) {
        return 'border-l-4 border-l-yellow-500 dark:border-l-yellow-400';
      }
    }
    
    return '';
  }

  function formatDate(dateStr: string) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  }

  function formatRelativeDate(dateStr: string) {
    if (!dateStr) return '';
    
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''} overdue`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else if (diffDays < 7) {
      return `Due in ${diffDays} days`;
    } else {
      return formatDate(dateStr);
    }
  }
</script>

<svelte:head>
  <title>Tasks | LearnFlow</title>
</svelte:head>

<div class="flex flex-col md:flex-row h-[85vh] max-w-7xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden mt-6 border border-gray-200 dark:border-gray-800">
  <!-- Left: Task List -->
  <div class="w-full md:w-2/5 lg:w-1/3 border-r border-gray-200 dark:border-gray-800 bg-gradient-to-br from-indigo-50/80 via-purple-50/50 dark:from-indigo-950/30 dark:via-purple-950/20 to-white dark:to-gray-900 overflow-y-auto relative {isMobile && selectedTask && !showAddPanel ? 'hidden' : ''}">
    <div class="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 p-5 space-y-5">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 flex items-center">
          <i class="fas fa-tasks mr-3"></i> My Tasks
        </h2>
        <button 
          class="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50"
          on:click={() => showAddPanel = !showAddPanel}
          aria-label={showAddPanel ? "Close add task panel" : "Open add task panel"}
        >
          <i class="fas {showAddPanel ? 'fa-times' : 'fa-plus'}"></i>
        </button>
      </div>
      
      <!-- Progress bar -->
      <div class="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div class="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full relative overflow-hidden" 
             style="width: {progressPercentage}%"
             transition:scale={{ duration: 300, easing: cubicOut }}
             >
          <div class="absolute inset-0 opacity-30 bg-striped"></div>
        </div>
      </div>
      <div class="text-xs text-gray-500 dark:text-gray-400 flex justify-between">
        <span>{completedCount} of {totalCount} tasks completed</span>
        <span class="font-semibold">{progressPercentage}%</span>
      </div>
      
      <!-- Search and filter bar -->
      <div class="space-y-3">
        <div class="relative">
          <i class="fas fa-search absolute left-3.5 top-3 text-gray-400 dark:text-gray-500"></i>
          <input 
            class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition text-sm" 
            placeholder="Search tasks..." 
            bind:value={searchTerm}
          />
        </div>
        
        <div class="flex flex-wrap gap-2">
          <select 
            class="text-xs px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 cursor-pointer"
            bind:value={filterEmergency}
          >
            <option value="all">All Priorities</option>
            <option value="1">Low</option>
            <option value="2">Medium-Low</option>
            <option value="3">Medium</option>
            <option value="4">High</option>
            <option value="5">Critical</option>
          </select>
          
          <select 
            class="text-xs px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 cursor-pointer"
            bind:value={filterTag}
          >
            <option value="">All Tags</option>
            {#each uniqueTags as tag}
              <option value={tag}>{tag}</option>
            {/each}
          </select>
          
          <div class="ml-auto flex text-xs gap-1 items-center">
            <select 
              class="px-2 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 cursor-pointer"
              bind:value={sortBy}
            >
              <option value="createdAt">Created</option>
              <option value="deadline">Deadline</option>
              <option value="emergency">Priority</option>
            </select>
            <button 
              class="h-7 w-7 flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md"
              on:click={() => sortDir = sortDir === 'asc' ? 'desc' : 'asc'}
              title={sortDir === 'asc' ? 'Sort Ascending' : 'Sort Descending'}
            >
              <i class="fas fa-sort-{sortDir === 'asc' ? 'up' : 'down'} text-gray-500"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tasks List -->
    <div class="p-4 space-y-1.5">
      {#if filteredTodos.length === 0}
        <div 
          class="text-center py-10 text-gray-500 dark:text-gray-400 italic"
          in:fade={{ duration: 200 }}
        >
          {searchTerm || filterTag || filterEmergency !== 'all' ? 'No matching tasks found' : 'No tasks yet. Create one!'}
        </div>
      {:else}
        {#each filteredTodos as task (task.id)}
          <div 
            role="button"
            tabindex="0"
            class="bg-white dark:bg-gray-800/90 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-700/50 transition-all cursor-pointer relative overflow-hidden {selectedId === task.id ? 'border-l-4 border-l-indigo-500 dark:border-l-indigo-400' : ''} {getTaskStatusClass(task)} focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-600"
            draggable="true"
            on:dragstart={() => handleDragStart(task.id)}
            on:dragover|preventDefault={() => handleDragOver(task.id)}
            on:drop|preventDefault={handleDrop}
            on:dragend={handleDragEnd}
            on:click={() => selectTask(task.id)}
            on:keydown={(e) => handleTaskKeydown(e, task.id)}
            in:fly={{ y: 10, duration: 200, delay: 50 }}
            out:fly={{ y: -10, duration: 200 }}
          >
            {#if draggingId === task.id}
              <div class="absolute inset-0 bg-indigo-100 dark:bg-indigo-900/30 z-0"></div>
            {/if}
            {#if dragOverId === task.id}
              <div class="absolute inset-0 border-2 border-dashed border-indigo-300 dark:border-indigo-700 rounded-xl z-0"></div>
            {/if}
            <div class="p-3 z-10 relative flex items-start gap-3">
              <div>
                <button 
                  class="h-5 w-5 rounded-full flex items-center justify-center border {task.completed ? 'bg-green-100 dark:bg-green-900/30 border-green-400 dark:border-green-600 text-green-600 dark:text-green-400' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'}"
                  on:click|stopPropagation={() => toggleTaskComplete(task)}
                >
                  {#if task.completed}
                    <i class="fas fa-check text-xs"></i>
                  {/if}
                </button>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-start">
                  <h3 class="font-medium truncate text-sm {task.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}">{task.text}</h3>
                  <span 
                    class="ml-2 text-xs px-2 py-0.5 rounded-full border {getEmergencyColor(task.emergency)} whitespace-nowrap flex-shrink-0"
                  >
                    {getEmergencyLabel(task.emergency)}
                  </span>
                </div>
                
                <div class="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                  {#if task.deadline}
                    <span class="{task.deadline && new Date(task.deadline) < new Date() ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'} flex items-center">
                      <i class="fas fa-calendar-alt mr-1.5"></i>
                      {formatRelativeDate(task.deadline)}
                    </span>
                  {/if}
                  
                  {#if task.tag}
                    <span class="text-gray-500 dark:text-gray-400 flex items-center">
                      <i class="fas fa-tag mr-1.5"></i>
                      {task.tag}
                    </span>
                  {/if}
                </div>
              </div>
            </div>
            
            {#if task.deadline && new Date(task.deadline) < new Date() && !task.completed}
              <div class="absolute top-0 right-0 w-0 h-0 border-solid border-t-[20px] border-t-red-500 border-l-transparent border-l-[20px]"></div>
            {/if}
          </div>
        {/each}
      {/if}
      
      {#if completedCount > 0}
        <div class="flex justify-center pt-3">
          <button 
            class="text-xs px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition rounded-md"
            on:click={clearCompletedTasks}
          >
            <i class="fas fa-trash-alt mr-1.5"></i>
            Clear completed ({completedCount})
          </button>
        </div>
      {/if}
    </div>
  </div>

  <!-- Right: Task Detail or Add Panel -->
  <div class="flex-1 bg-white dark:bg-gray-900 overflow-y-auto">
    {#if showAddPanel}
      <!-- Add Task Form -->
      <div 
        class="h-full flex flex-col p-6"
        in:fly={{ x: 20, duration: 200, easing: cubicOut }}
        out:fly={{ x: 20, duration: 200, easing: cubicOut }}
      >
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Add New Task</h2>
          <button 
            class="h-8 w-8 flex md:hidden items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
            on:click={() => showAddPanel = false}
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="space-y-5 flex-1">
          <div>
            <label for="task-title" class="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Task Title*</label>
            <input 
              id="task-title"
              type="text" 
              class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800" 
              placeholder="What needs to be done?"
              bind:value={newTask.text}
            />
          </div>
          
          <div>
            <label for="task-description" class="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Description (optional)</label>
            <textarea 
              id="task-description"
              class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 h-32 bg-white dark:bg-gray-800" 
              placeholder="Add details about this task..."
              bind:value={newTask.description}
            ></textarea>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="task-deadline" class="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Deadline (optional)</label>
              <input 
                id="task-deadline"
                type="date" 
                class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800" 
                bind:value={newTask.deadline}
              />
            </div>
            
            <div>
              <label for="task-priority" class="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Priority</label>
              <select 
                id="task-priority"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800"
                bind:value={newTask.emergency}
              >
                <option value={1}>Low</option>
                <option value={2}>Medium-Low</option>
                <option value={3}>Medium</option>
                <option value={4}>High</option>
                <option value={5}>Critical</option>
              </select>
            </div>
          </div>
          
          <div>
            <label for="task-tag" class="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Tag (optional)</label>
            <div class="relative">
              <input 
                id="task-tag"
                list="tag-options"
                type="text" 
                class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800" 
                placeholder="Add or select a tag"
                bind:value={newTask.tag}
              />
              <datalist id="tag-options">
                {#each uniqueTags as tag}
                  <option value={tag}></option>
                {/each}
              </datalist>
              <i class="fas fa-tag absolute right-4 top-3 text-gray-400"></i>
            </div>
          </div>
          
          <div class="pt-4">
            <button 
              class="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-md transition transform hover:translate-y-[-1px] disabled:opacity-70 disabled:cursor-not-allowed"
              on:click={addTask}
              disabled={!newTask.text?.trim()}
            >
              <i class="fas fa-plus mr-2"></i>
              Create Task
            </button>
          </div>
        </div>
      </div>
    {:else if selectedTask}
      <!-- Task Detail View -->
      <div 
        class="h-full flex flex-col p-6"
        in:fade={{ duration: 200 }}
      >
        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center gap-3">
            <button 
              class="h-8 w-8 md:hidden flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
              on:click={() => selectedId = null}
            >
              <i class="fas fa-arrow-left"></i>
            </button>
            <h2 class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Task Details</h2>
          </div>
          <div class="flex gap-2">
            <button 
              class="h-9 w-9 flex items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-800/30 transition"
              on:click={() => startEdit(selectedTask)}
              title="Edit task"
            >
              <i class="fas fa-edit"></i>
            </button>
            <button 
              class="h-9 w-9 flex items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-800/30 transition"
              on:click={() => deleteTask(selectedTask.id)}
              title="Delete task"
            >
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
        
        {#if editing && editTask}
          <!-- Edit Task Form -->
          <div 
            class="space-y-5 flex-1 animate__animated animate__fadeIn"
            in:fade={{ duration: 200 }}
          >
            <div>
              <label for="edit-title" class="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Task Title*</label>
              <input 
                id="edit-title"
                type="text" 
                class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800" 
                bind:value={editTask.text}
              />
            </div>
            
            <div>
              <label for="edit-description" class="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Description</label>
              <textarea 
                id="edit-description"
                class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 h-32 bg-white dark:bg-gray-800" 
                bind:value={editTask.description}
              ></textarea>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="edit-deadline" class="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Deadline</label>
                <input 
                  id="edit-deadline"
                  type="date" 
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800" 
                  bind:value={editTask.deadline}
                />
              </div>
              
              <div>
                <label for="edit-priority" class="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Priority</label>
                <select 
                  id="edit-priority"
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800"
                  bind:value={editTask.emergency}
                >
                  <option value={1}>Low</option>
                  <option value={2}>Medium-Low</option>
                  <option value={3}>Medium</option>
                  <option value={4}>High</option>
                  <option value={5}>Critical</option>
                </select>
              </div>
            </div>
            
            <div>
              <label for="edit-tag" class="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Tag</label>
              <div class="relative">
                <input 
                  id="edit-tag"
                  list="edit-tag-options"
                  type="text" 
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800" 
                  placeholder="Add or select a tag"
                  bind:value={editTask.tag}
                />
                <datalist id="edit-tag-options">
                  {#each uniqueTags as tag}
                    <option value={tag}></option>
                  {/each}
                </datalist>
                <i class="fas fa-tag absolute right-4 top-3 text-gray-400"></i>
              </div>
            </div>
            
            <div class="flex gap-3 pt-4 justify-end">
              <button 
                class="py-2.5 px-5 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium transition"
                on:click={() => {editing = false; editTask = null;}}
              >
                Cancel
              </button>
              <button 
                class="py-2.5 px-5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-md transition"
                on:click={saveEdit}
                disabled={!editTask.text?.trim()}
              >
                Save Changes
              </button>
            </div>
          </div>
        {:else}
          <!-- Task Viewing -->
          <div class="space-y-6 flex-1">
            <div class="flex items-start gap-4">
              <button 
                class="mt-1 h-6 w-6 rounded-full flex items-center justify-center border {selectedTask.completed ? 'bg-green-100 dark:bg-green-900/30 border-green-400 dark:border-green-600 text-green-600 dark:text-green-400' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'}"
                on:click={() => toggleTaskComplete(selectedTask)}
              >
                {#if selectedTask.completed}
                  <i class="fas fa-check text-xs"></i>
                {/if}
              </button>
              <div class="flex-1">
                <h3 class="text-xl font-semibold {selectedTask.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}">{selectedTask.text}</h3>
              </div>
            </div>
            
            <div class="flex flex-wrap gap-3 pt-2">
              <span 
                class="text-sm px-3 py-1 rounded-lg {getEmergencyColor(selectedTask.emergency)}"
              >
                <i class="fas fa-flag mr-1.5"></i>
                {getEmergencyLabel(selectedTask.emergency)}
              </span>
              
              {#if selectedTask.deadline}
                <span 
                  class="text-sm px-3 py-1 rounded-lg {new Date(selectedTask.deadline) < new Date() && !selectedTask.completed ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'}"
                >
                  <i class="fas fa-calendar-alt mr-1.5"></i>
                  {formatRelativeDate(selectedTask.deadline)}
                </span>
              {/if}
              
              {#if selectedTask.tag}
                <span 
                  class="text-sm px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                >
                  <i class="fas fa-tag mr-1.5"></i>
                  {selectedTask.tag}
                </span>
              {/if}
              
              <span 
                class="text-sm px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
              >
                <i class="fas fa-clock mr-1.5"></i>
                Created {new Date(selectedTask.createdAt).toLocaleDateString()}
              </span>
            </div>
            
            <div class="pt-6">
              <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</h4>
              <div class="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/80 min-h-[200px] text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {selectedTask.description || 'No description provided.'}
              </div>
            </div>
          </div>
        {/if}
      </div>
    {:else}
      <!-- No task selected -->
      <div class="h-full flex flex-col items-center justify-center p-6 text-center">
        <img src="https://illustrations.popsy.co/gray/task-list.svg" alt="No task selected" class="w-64 h-64 mb-6 opacity-70" />
        <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Task Selected</h3>
        <p class="text-gray-500 dark:text-gray-400 max-w-md mb-6">Select a task from the list to view details or click the + button to create a new task.</p>
        <button 
          class="py-2.5 px-5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-md transition transform hover:translate-y-[-1px]"
          on:click={() => showAddPanel = true}
        >
          <i class="fas fa-plus mr-2"></i>
          Create New Task
        </button>
      </div>
    {/if}
  </div>
</div>

<style>
  .bg-striped {
    background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
    background-size: 1rem 1rem;
    animation: progress-bar-stripes 1s linear infinite;
  }

  @keyframes progress-bar-stripes {
    from { background-position: 1rem 0; }
    to { background-position: 0 0; }
  }

  .overdue {
    @apply border-l-red-500 dark:border-l-red-400 border-l-4;
  }

  .due-soon {
    @apply border-l-yellow-500 dark:border-l-yellow-400 border-l-4;
  }
</style>
