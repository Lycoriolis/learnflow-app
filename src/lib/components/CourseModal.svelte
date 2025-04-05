<script>
  import { onMount } from 'svelte';
  import { courseModalOpen, currentCourse } from '$lib/stores/appStore';
  import * as marked from 'marked';
  
  export let markdownContent = `
# JavaScript Closures

A closure is a combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment).

## Understanding Closures

In JavaScript, closures are created every time a function is created, at function creation time.

\`\`\`javascript
function outer() {
  const outerVar = 'I am outside!';
  
  function inner() {
    console.log(outerVar); // Accesses outerVar from the outer function's scope
  }
  
  return inner;
}

const myInner = outer();
myInner(); // Logs: "I am outside!"
\`\`\`

## Practical Uses of Closures

### Data Privacy
Closures can be used to create private variables.

\`\`\`javascript
function createCounter() {
  let count = 0;
  
  return {
    increment: function() { count++; },
    getCount: function() { return count; }
  };
}

const counter = createCounter();
counter.increment();
console.log(counter.getCount()); // 1
console.log(counter.count); // undefined (private)
\`\`\`

### Function Factories
Create specialized functions based on parameters.

\`\`\`javascript
function multiplyBy(factor) {
  return function(number) {
    return number * factor;
  };
}

const double = multiplyBy(2);
console.log(double(5)); // 10
\`\`\`

## Exercise

Create a closure that implements a simple bank account with:
- \`deposit(amount)\` method
- \`withdraw(amount)\` method
- \`getBalance()\` method

The balance should be private and only accessible through these methods.
`;
  
  let renderedContent = '';
  
  function closeModal() {
    courseModalOpen.set(false);
  }
  
  onMount(() => {
    // Use marked directly
    renderedContent = marked.parse(markdownContent);
  });
</script>

{#if $courseModalOpen}
  <div 
    class="fixed inset-0 z-50 overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog" 
    aria-modal="true"
  >
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div 
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
        aria-hidden="true"
        on:click={closeModal}
        on:keydown={e => e.key === 'Escape' && closeModal()}
      ></div>
      
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span>
      
      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full squircle">
        <div class="bg-white px-6 py-4">
          <div class="flex justify-between items-center border-b pb-4">
            <h3 class="text-lg font-medium text-gray-900">
              {$currentCourse?.title || 'Course Content'}
            </h3>
            <button 
              on:click={closeModal} 
              class="text-gray-400 hover:text-gray-500"
              aria-label="Close modal"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="markdown-content py-4">
            {@html renderedContent}
          </div>
          
          <div class="border-t pt-4 flex justify-between">
            <button class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
              Previous
            </button>
            <button class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              Next Lesson
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
