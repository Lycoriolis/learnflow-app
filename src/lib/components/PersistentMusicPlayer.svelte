<!-- src/lib/components/PersistentMusicPlayer.svelte -->
<script lang="ts">
    import {
        currentTrack,
        isPlaying,
        togglePlayPause,
        playNext,
        playPrev
    } from '$lib/musicService.js';

    // Show player only when a track object exists in the store
    $: showPlayer = !!$currentTrack;

</script>

{#if showPlayer && $currentTrack}
    <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg w-full mt-auto"> <!-- mt-auto pushes it down in flex col -->
        <!-- Track Info -->
        <div class="flex items-center mb-3">
            <div class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-indigo-500 text-white mr-2">
                <i class="fas fa-music text-sm"></i>
            </div>
            <div class="overflow-hidden flex-grow min-w-0">
                <p class="text-sm font-medium truncate text-gray-800 dark:text-gray-100">{$currentTrack.title}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{$currentTrack.artist}</p>
            </div>
        </div>

        <!-- Controls -->
        <div class="flex items-center justify-center space-x-4">
            <button on:click={playPrev} class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition duration-150" aria-label="Previous track">
                <i class="fas fa-backward"></i>
            </button>
            <button on:click={togglePlayPause} class="text-white bg-indigo-600 hover:bg-indigo-700 w-10 h-10 flex items-center justify-center rounded-full transition duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800" aria-label={$isPlaying ? 'Pause' : 'Play'}>
                <i class="fas {$isPlaying ? 'fa-pause' : 'fa-play'} fa-lg { $isPlaying ? '' : 'ml-0.5' }"></i>
            </button>
            <button on:click={playNext} class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition duration-150" aria-label="Next track">
                <i class="fas fa-forward"></i>
            </button>
        </div>
    </div>
{/if} 