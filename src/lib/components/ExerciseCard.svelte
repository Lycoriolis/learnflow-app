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

<div class="bg-white p-5 rounded-2xl shadow-sm squircle-sm card-hover">
  <div class="flex items-start mb-4">
    <div class="w-10 h-10 bg-{exercise.category.color}-100 rounded-lg flex items-center justify-center mr-3">
      <i class="fas {exercise.icon} text-{exercise.category.color}-600"></i>
    </div>
    <div>
      <h3 class="font-semibold text-gray-800">{exercise.title}</h3>
      <p class="text-gray-500 text-sm">{exercise.description}</p>
    </div>
  </div>
  <div class="flex justify-between items-center">
    <span class="text-xs px-2 py-1 bg-{exercise.category.color}-50 text-{exercise.category.color}-600 rounded">
      {exercise.category.name}
    </span>
    <button 
      class="text-sm text-{exercise.category.color}-600 hover:text-{exercise.category.color}-800 font-medium"
      on:click={startExercise}
    >
      Start
    </button>
  </div>
</div> 