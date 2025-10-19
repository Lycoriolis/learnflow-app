<script lang="ts">
  import Timer from '$lib/components/Timer.svelte';
  import StickyNotes from '$lib/components/StickyNotes.svelte';
  import Quotes from '$lib/components/Quotes.svelte';
</script>

<svelte:head>
  <title>Workspace | LearnFlow</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 dark:from-gray-900 dark:via-slate-900 dark:to-emerald-950">
  <!-- Header -->
  <div class="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-xl">
    <div class="max-w-7xl mx-auto px-6 py-8">
      <div class="flex items-center space-x-4">
        <i class="fas fa-tools text-3xl"></i>
        <div>
          <h1 class="text-3xl font-bold">Study Workspace</h1>
          <p class="text-emerald-100 mt-1">Your productivity hub for focused learning</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Main Content -->
  <div class="max-w-7xl mx-auto px-6 py-8">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Timer Card -->
      <div class="transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden h-full">
          <div class="bg-gradient-to-r from-gray-700 to-gray-800 p-6 text-white">
            <div class="flex items-center space-x-3">
              <i class="fas fa-stopwatch text-2xl"></i>
              <h2 class="text-xl font-bold">Timer</h2>
            </div>
            <p class="text-gray-300 mt-2 text-sm">Stay focused with timed sessions</p>
          </div>
          <div class="p-6">
            <Timer />
          </div>
        </div>
      </div>

      <!-- Sticky Notes Card -->
      <div class="transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden h-full">
          <div class="bg-gradient-to-r from-gray-600 to-gray-700 p-6 text-white">
            <div class="flex items-center space-x-3">
              <i class="fas fa-sticky-note text-2xl"></i>
              <h2 class="text-xl font-bold">Sticky Notes</h2>
            </div>
            <p class="text-gray-200 mt-2 text-sm">Jot down quick thoughts and ideas</p>
          </div>
          <div class="p-6">
            <StickyNotes />
          </div>
        </div>
      </div>

      <!-- YouTube Video Card -->
      <div class="transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden h-full">
          <div class="bg-gradient-to-r from-gray-500 to-gray-600 p-6 text-white">
            <div class="flex items-center space-x-3">
              <i class="fas fa-video text-2xl"></i>
              <h2 class="text-xl font-bold">Study Music</h2>
            </div>
            <p class="text-gray-100 mt-2 text-sm">Background music to enhance focus</p>
          </div>
          <div class="p-6">
            <div class="relative w-full" style="padding-top:56.25%">
              <iframe
                class="absolute top-0 left-0 w-full h-full rounded-xl"
                src="https://www.youtube.com/embed/8iP3J8jFYdM"
                title="Chill beats - Study Music"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      <!-- Motivational Quote Card -->
      <div class="transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden h-full">
          <div class="bg-gradient-to-r from-gray-400 to-gray-500 p-6 text-white">
            <div class="flex items-center space-x-3">
              <i class="fas fa-lightbulb text-2xl"></i>
              <h2 class="text-xl font-bold">Daily Quote</h2>
            </div>
            <p class="text-gray-100 mt-2 text-sm">Inspiring words to motivate your studies</p>
          </div>
          <div class="p-6">
            <Quotes />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>