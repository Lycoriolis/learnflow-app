<script lang="ts">
  import { onDestroy } from 'svelte';
  let elapsed = 0; // seconds
  let intervalId: number | null = null;
  let isRunning = false;

  function formatTime(seconds: number) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2,'0')}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
  }

  function start() {
    if (isRunning) return;
    isRunning = true;
    intervalId = window.setInterval(() => {
      elapsed += 1;
    }, 1000);
  }

  function stop() {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
    isRunning = false;
  }

  function reset() {
    stop();
    elapsed = 0;
  }

  onDestroy(() => {
    if (intervalId !== null) clearInterval(intervalId);
  });
</script>

<div class="workspace-tool mb-6">
  <h2 class="text-xl font-semibold mb-2">Timer</h2>
  <div class="text-2xl font-mono mb-4">{formatTime(elapsed)}</div>
  <div class="space-x-2">
    <button on:click={start} class="px-4 py-2 bg-green-500 text-white rounded">Start</button>
    <button on:click={stop} class="px-4 py-2 bg-red-500 text-white rounded">Stop</button>
    <button on:click={reset} class="px-4 py-2 bg-gray-500 text-white rounded">Reset</button>
  </div>
</div>
