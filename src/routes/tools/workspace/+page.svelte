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
  <div class="transform transition-transform duration-300 hover:scale-105">
    <div class="bg-gradient-to-br from-indigo-600 via-blue-500 to-teal-400 dark:from-indigo-700 dark:via-blue-600 dark:to-teal-500 text-white rounded-2xl shadow-2xl overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
        <i class="fas fa-stopwatch text-xl mr-2"></i>
        <h2 class="text-lg font-semibold">Timer</h2>
      </div>
      <div class="p-6">
        <Timer />
      </div>
    </div>
  </div>

  <!-- Sticky Notes Card -->
  <div class="transform transition-transform duration-300 hover:scale-105">
    <div class="bg-gradient-to-br from-green-600 via-lime-500 to-yellow-400 dark:from-green-700 dark:via-lime-600 dark:to-yellow-500 text-white rounded-2xl shadow-2xl overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
        <i class="fas fa-sticky-note text-xl mr-2"></i>
        <h2 class="text-lg font-semibold">Sticky Notes</h2>
      </div>
      <div class="p-6">
        <StickyNotes />
      </div>
    </div>
  </div>

  <!-- YouTube Video Card -->
  <div class="transform transition-transform duration-300 hover:scale-105">
    <div class="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 dark:from-orange-600 dark:via-red-600 dark:to-pink-600 text-white rounded-2xl shadow-2xl overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
        <i class="fas fa-video text-xl mr-2"></i>
        <h2 class="text-lg font-semibold">Tutorial Video</h2>
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
  <div class="transform transition-transform duration-300 hover:scale-105">
    <div class="bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-400 dark:from-purple-700 dark:via-indigo-600 dark:to-blue-500 text-white rounded-2xl shadow-2xl overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
        <i class="fas fa-lightbulb text-xl mr-2"></i>
        <h2 class="text-lg font-semibold">Quote</h2>
      </div>
      <div class="p-6">
        <Quotes />
      </div>
    </div>
  </div>
</div>