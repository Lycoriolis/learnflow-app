<script lang="ts">
  export let exercise = {
    id: '',
    title: '',
    description: '',
    category: {
      name: '',
      color: 'blue'
    },
    icon: 'fa-code'
  };
  
  function startExercise() {
    // Navigate to exercise page or open modal
    console.log('Starting exercise:', exercise.id);
  }
</script>

<div class="bg-gray-700 border border-orange-500 p-5 rounded-2xl shadow-sm squircle-sm card-hover">
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
    <span class="text-xs px-2 py-1 bg-indigo-800 text-indigo-100 rounded">
      {exercise.category.name}
    </span>
    <button 
      class="text-sm text-indigo-300 hover:text-indigo-100 font-medium"
      on:click={startExercise}
    >
      Start
    </button>
  </div>
</div> 