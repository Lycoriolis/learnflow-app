<script lang="ts">
  import { timerState, timerSettings, focusSessions, type FocusSession } from '$lib/stores/pipStores.js';
  import { onDestroy } from 'svelte';

  let intervalId: ReturnType<typeof setInterval> | null = null;

  // Format time left in seconds to MM:SS
  $: formattedTime = (() => {
    const minutes = Math.floor($timerState.timeLeft / 60);
    const seconds = $timerState.timeLeft % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  })();

  function startTimer() {
    if ($timerState.isRunning || intervalId) return;
    timerState.update(state => ({ ...state, isRunning: true }));

    intervalId = setInterval(() => {
      timerState.update(state => {
        if (state.timeLeft <= 0) {
          nextPhase();
          return state; // State is updated within nextPhase
        }
        return { ...state, timeLeft: state.timeLeft - 1 };
      });
    }, 1000);
  }

  function pauseTimer() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    timerState.update(state => ({ ...state, isRunning: false }));
  }

  function resetTimer() {
    pauseTimer();
    timerState.update(state => ({
      ...state,
      mode: 'work',
      timeLeft: $timerSettings.workDuration,
      cycle: 0
    }));
  }

  function nextPhase() {
      pauseTimer(); // Stop current interval

      // --- Record completed work session --- 
      if ($timerState.mode === 'work') {
        const completedSession: FocusSession = {
          timestamp: Date.now(),
          duration: $timerSettings.workDuration // Record the planned duration
        };
        focusSessions.update(sessions => [...sessions, completedSession]);
        console.log('Recorded focus session:', completedSession); // Optional logging
      }
      // --- End recording --- 

      let nextMode: typeof $timerState.mode = 'work';
      let nextTimeLeft = $timerSettings.workDuration;
      let nextCycle = $timerState.cycle;

      if ($timerState.mode === 'work') {
          nextCycle++;
          if (nextCycle % $timerSettings.longBreakInterval === 0) {
              nextMode = 'longBreak';
              nextTimeLeft = $timerSettings.longBreakDuration;
          } else {
              nextMode = 'shortBreak';
              nextTimeLeft = $timerSettings.shortBreakDuration;
          }
      } else { // If current mode is shortBreak or longBreak
          nextMode = 'work';
          nextTimeLeft = $timerSettings.workDuration;
      }

      timerState.set({
          mode: nextMode,
          timeLeft: nextTimeLeft,
          isRunning: false, // Start paused in the new phase
          cycle: nextCycle
      });
      
      // Optional: Auto-start the next phase?
      // startTimer(); 
      
      // Optional: Notify user (e.g., with a sound)
      // new Audio('/path/to/notification.mp3').play();
  }

  // Ensure interval is cleared when component is destroyed
  onDestroy(() => {
    pauseTimer();
  });

</script>

<div class="text-center p-2 bg-gray-700 rounded-lg">
  <div class="text-xs font-medium text-indigo-300 uppercase mb-1">{$timerState.mode.replace('B', ' B')}</div>
  <div class="text-3xl font-bold mb-3 text-gray-100 tracking-wider">{formattedTime}</div>
  <div class="flex justify-center space-x-2">
    {#if !$timerState.isRunning}
      <button on:click={startTimer} class="px-4 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm font-medium transition duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-400">Start</button>
    {:else}
       <button on:click={pauseTimer} class="px-4 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm font-medium transition duration-150 focus:outline-none focus:ring-2 focus:ring-yellow-400">Pause</button>
    {/if}
    <button on:click={resetTimer} class="px-4 py-1 bg-gray-600 text-gray-200 hover:bg-gray-500 rounded text-sm transition duration-150 focus:outline-none focus:ring-2 focus:ring-gray-400">Reset</button>
  </div>
</div>
