<script>
  export let exercises = [
    {
      title: "JavaScript Closure Exercise",
      description: "Practice with closures and scope",
      icon: "fa-code",
      color: "blue",
      category: "JavaScript"
    },
    {
      title: "Matrix Multiplication",
      description: "Practice matrix operations",
      icon: "fa-calculator",
      color: "purple",
      category: "Math"
    },
    {
      title: "Spanish Vocabulary Quiz",
      description: "Test your vocabulary knowledge",
      icon: "fa-language",
      color: "green",
      category: "Language"
    }
  ];
</script>

<div class="mb-8">
  <div class="flex justify-between items-center mb-4">
    <h2 class="text-lg font-semibold text-gray-100">Recommended Exercises</h2>
    <a href="/exercises" class="text-sm text-indigo-300 hover:text-indigo-100 font-medium">View All</a>
  </div>
  
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each exercises as exercise}
      <div 
        class="bg-gray-700 border border-orange-500 p-5 rounded-2xl shadow-sm squircle-sm card-hover"
        role="button"
        tabindex="0"
      >
        <div class="flex items-start mb-4">
          <div class="w-10 h-10 bg-indigo-900 rounded-lg flex items-center justify-center mr-3">
            <i class="fas {exercise.icon} text-indigo-300"></i>
          </div>
          <div>
            <h3 class="font-semibold text-gray-100">{exercise.title}</h3>
            <p class="text-gray-300 text-sm">{exercise.description}</p>
          </div>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-xs px-2 py-1 bg-indigo-800 text-indigo-100 rounded">{exercise.category}</span>
          <button class="text-sm text-indigo-300 hover:text-indigo-100 font-medium">Start</button>
        </div>
      </div>
    {/each}
  </div>
</div>
