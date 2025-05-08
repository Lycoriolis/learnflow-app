<script lang="ts">
  import { todos, type TodoItem } from '../../stores/pipStores.js';
  import { flip } from 'svelte/animate';
  import { fade } from 'svelte/transition';

  let newTodoText = '';

  function addTodo() {
    console.log('[PipTodo] addTodo function called.');
    const text = newTodoText.trim();
    if (!text) {
      console.log('[PipTodo] addTodo: No text entered.');
      return;
    }
    const newTodo: TodoItem = {
      id: crypto.randomUUID(),
      text: text,
      completed: false,
      createdAt: Date.now()
    };
    console.log('[PipTodo] Adding new todo:', newTodo);
    todos.update(currentTodos => {
      const updatedTodos = [...currentTodos, newTodo];
      console.log('[PipTodo] Updated todos store:', updatedTodos);
      return updatedTodos;
    });
    newTodoText = ''; // Clear input
  }

  function toggleTodo(id: string) {
    todos.update(currentTodos =>
      currentTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  function deleteTodo(id: string) {
      todos.update(currentTodos => currentTodos.filter(todo => todo.id !== id));
  }

  // Handle Enter key press in input
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      addTodo();
    }
  }

</script>

<div class="bg-gray-700 p-2 rounded-lg">
  <h4 class="text-xs font-medium text-green-300 uppercase mb-2">Todo List</h4>
  <div class="flex mb-2">
    <input
      type="text"
      bind:value={newTodoText}
      on:keydown={handleKeydown}
      placeholder="Add a new task..."
      class="flex-1 text-sm bg-gray-600 text-gray-100 border border-gray-500 rounded-l-md p-2 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 placeholder-gray-400"
    >
    <button
      on:click={addTodo}
      class="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-r-md text-sm font-medium transition duration-150 focus:outline-none focus:ring-2 focus:ring-green-400"
    >
      Add
    </button>
  </div>
  {#if $todos.length > 0}
    <ul class="space-y-1 max-h-40 overflow-y-auto pr-1">
      {#each $todos.sort((a, b) => a.createdAt - b.createdAt) as todo (todo.id)}
        <li
          class="flex items-center text-sm p-1.5 bg-gray-600 rounded-md group"
          animate:flip={{ duration: 200 }}
          transition:fade={{ duration: 150 }}
        >
          <input
            type="checkbox"
            bind:checked={todo.completed}
            on:change={() => toggleTodo(todo.id)}
            class="mr-2 h-4 w-4 form-checkbox bg-gray-500 border-gray-400 text-green-500 focus:ring-green-400 focus:ring-offset-gray-600 rounded"
            aria-labelledby="todo-text-{todo.id}"
          >
          <span
            id="todo-text-{todo.id}"
            class="flex-1 {todo.completed ? 'line-through text-gray-400' : 'text-gray-100'}"
          >
            {todo.text}
          </span>
           <button
             on:click={() => deleteTodo(todo.id)}
             class="ml-2 px-1 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150 focus:outline-none"
             aria-label="Delete task"
           >
             <i class="fas fa-trash-alt fa-xs"></i>
           </button>
        </li>
      {/each}
    </ul>
  {:else}
    <p class="text-gray-400 text-xs italic text-center py-2">No tasks yet. Add one above!</p>
  {/if}
</div>
