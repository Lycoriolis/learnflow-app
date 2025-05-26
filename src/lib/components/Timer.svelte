<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { browser } from '$app/environment';
  
  let elapsed = 0; // seconds
  let intervalId: ReturnType<typeof setInterval> | null = null;
  let isRunning = false;
  let startTime: number | null = null;
  let pausedElapsed = 0;

  // Format time as HH:MM:SS
  function formatTime(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2,'0')}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
  }

  function start(): void {
    if (!browser || isRunning) return;
    
    isRunning = true;
    startTime = Date.now() - (pausedElapsed * 1000);
    
    intervalId = setInterval(() => {
      if (startTime !== null) {
        elapsed = Math.floor((Date.now() - startTime) / 1000);
      }
    }, 100); // Update more frequently for accuracy
  }

  function stop(): void {
    if (!browser || !isRunning) return;
    
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
    
    pausedElapsed = elapsed;
    isRunning = false;
  }

  function reset(): void {
    stop();
    elapsed = 0;
    pausedElapsed = 0;
    startTime = null;
  }

  // Pause timer when tab is not visible to save resources
  function handleVisibilityChange(): void {
    if (!browser) return;
    
    if (document.hidden) {
      if (isRunning) {
        // Store current elapsed time
        pausedElapsed = elapsed;
        // Clear interval but don't change isRunning state
        if (intervalId !== null) {
          clearInterval(intervalId);
          intervalId = null;
        }
      }
    } else {
      // Resume if it was running
      if (isRunning) {
        startTime = Date.now() - (pausedElapsed * 1000);
        intervalId = setInterval(() => {
          if (startTime !== null) {
            elapsed = Math.floor((Date.now() - startTime) / 1000);
          }
        }, 100);
      }
    }
  }

  onMount(() => {
    if (browser) {
      // Add visibility change listener
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }
  });

  onDestroy(() => {
    if (browser) {
      if (intervalId !== null) clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
  });

  // Export functions for external components to control the timer
  export function startTimer(): void { start(); }
  export function stopTimer(): void { stop(); }
  export function resetTimer(): void { reset(); }
  export function getElapsedTime(): number { return elapsed; }
</script>

<div class="workspace-tool mb-6 border-2 border-transparent rounded-xl bg-gradient-to-br from-indigo-600 to-blue-500 p-1">
  <div class="bg-[#0D1117] p-6 rounded-lg text-white transition-shadow hover:shadow-xl">
    <h2 class="text-xl font-semibold mb-2">Timer</h2>
    <div class="text-2xl font-mono mb-4" class:is-running={isRunning} style="color: {isRunning ? '#60EFFF' : '#dce6f3'}">{formatTime(elapsed)}</div>
    <div class="space-x-2">
      <button 
        on:click={start} 
        class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 active:scale-95 transition-transform focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
        disabled={isRunning}
        aria-label="Start timer"
      >
        Start
      </button>
      <button 
        on:click={stop} 
        class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 active:scale-95 transition-transform focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
        disabled={!isRunning}
        aria-label="Stop timer"
      >
        Stop
      </button>
      <button 
        on:click={reset} 
        class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 active:scale-95 transition-transform focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        aria-label="Reset timer"
      >
        Reset
      </button>
    </div>
  </div>
</div>

<style>
  .is-running {
    /* neon glow effect */
    text-shadow: 0 0 8px rgba(96, 239, 255, 0.7), 0 0 16px rgba(96,239,255,0.5);
  }
</style>
