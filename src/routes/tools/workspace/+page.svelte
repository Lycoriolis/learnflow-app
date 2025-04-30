<script lang="ts">
  import Timer from '$lib/components/Timer.svelte';
  import StickyNotes from '$lib/components/StickyNotes.svelte';
  import Quotes from '$lib/components/Quotes.svelte';
</script>

<svelte:head>
  <title>Workspace | LearnFlow</title>
</svelte:head>

<div class="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
  <!-- Timer Card -->
  <div>
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
        <i class="fas fa-stopwatch text-xl text-gray-800 dark:text-gray-200 mr-2"></i>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Timer</h2>
      </div>
      <div class="p-6">
        <Timer />
      </div>
    </div>
  </div>

  <!-- Sticky Notes Card -->
  <div>
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
        <i class="fas fa-sticky-note text-xl text-gray-800 dark:text-gray-200 mr-2"></i>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Sticky Notes</h2>
      </div>
      <div class="p-6">
        <StickyNotes />
      </div>
    </div>
  </div>

  <!-- YouTube Video Card -->
  <div>
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
        <i class="fas fa-video text-xl text-gray-800 dark:text-gray-200 mr-2"></i>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Tutorial Video</h2>
      </div>
      <div class="relative w-full" style="padding-top:56.25%">
        <iframe
          class="absolute top-0 left-0 w-full h-full"
          src="https://www.youtube.com/embed/8iP3J8jFYdM"
          title="Chill beats - Study Music"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  </div>

  <!-- Motivational Quote Card -->
  <div>
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
        <i class="fas fa-lightbulb text-xl text-gray-800 dark:text-gray-200 mr-2"></i>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Quote</h2>
      </div>
      <div class="p-6">
        <Quotes />
      </div>
    </div>
  </div>
</div>