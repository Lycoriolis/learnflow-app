<script lang="ts">
  export let exerciseId: string;
  
  let rating: number | null = null;
  let feedback: string = '';
  let submitted = false;
  
  function setRating(value: number) {
    rating = value;
  }
  
  function submitFeedback() {
    if (rating === null) return;
    
    // In a real app, this would send the data to a server
    console.log('Exercise feedback submitted:', {
      exerciseId,
      rating,
      feedback
    });
    
    submitted = true;
  }
</script>

<div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
  {#if !submitted}
    <div class="mb-4">
      <p class="text-gray-700 dark:text-gray-300 mb-2">Rate this exercise (1-5 stars):</p>
      <div class="flex gap-2">
        {#each Array(5) as _, i}
          <button 
            on:click={() => setRating(i + 1)}
            class="text-2xl focus:outline-none"
            aria-label={`Rate ${i + 1} stars`}
          >
            <i class={`${rating && rating > i ? 'fas' : 'far'} fa-star text-yellow-400`}></i>
          </button>
        {/each}
      </div>
    </div>
    
    <div class="mb-4">
      <label for="exercise-feedback" class="block text-gray-700 dark:text-gray-300 mb-2">
        Additional feedback (optional):
      </label>
      <textarea 
        id="exercise-feedback"
        bind:value={feedback}
        class="w-full px-3 py-2 text-gray-700 dark:text-gray-300 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        rows="3"
        placeholder="What did you think about this exercise?"
      ></textarea>
    </div>
    
    <button 
      on:click={submitFeedback}
      disabled={rating === null}
      class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Submit Feedback
    </button>
  {:else}
    <div class="text-center py-4">
      <i class="fas fa-check-circle text-green-500 text-4xl mb-2"></i>
      <p class="text-lg text-gray-700 dark:text-gray-300">Thanks for your feedback!</p>
    </div>
  {/if}
</div>
