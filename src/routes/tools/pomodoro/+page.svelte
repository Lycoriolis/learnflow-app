<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { tick } from 'svelte';
  import { logStart, logEnd, logEvent } from '$lib/services/activityService';

  // Pomodoro settings
  const WORK_MIN = 25;
  const BREAK_MIN = 5;
  const LONG_BREAK_MIN = 15;
  const CYCLES_BEFORE_LONG = 4;

  let minutes = WORK_MIN;
  let seconds = 0;
  let isRunning = false;
  let isWork = true;
  let cycle = 1;
  let interval: any = null;
  let completedCycles = 0;
  let showConfetti = false;
  let pomodoroEventId: string | null = null;

  onMount(async () => {
    pomodoroEventId = await logStart('view_pomodoro', 'pomodoro');
    resetTimer();
  });

  onDestroy(() => {
    if (pomodoroEventId) logEnd(pomodoroEventId);
  });

  function startTimer() {
    logEvent('start_pomodoro', 'pomodoro');
    if (!isRunning) {
      isRunning = true;
      interval = setInterval(tickTimer, 1000);
    }
  }

  function pauseTimer() {
    logEvent('pause_pomodoro', 'pomodoro');
    isRunning = false;
    clearInterval(interval);
  }

  function resetTimer() {
    logEvent('reset_pomodoro', 'pomodoro');
    pauseTimer();
    minutes = isWork ? WORK_MIN : (cycle % CYCLES_BEFORE_LONG === 0 ? LONG_BREAK_MIN : BREAK_MIN);
    seconds = 0;
  }

  async function completeSession() {
    logEvent('complete_session', 'pomodoro', { isWork });
    pauseTimer();
    showConfetti = true;
    await tick();
    setTimeout(() => showConfetti = false, 2000);
    if (isWork) {
      completedCycles++;
      isWork = false;
      minutes = (cycle % CYCLES_BEFORE_LONG === 0) ? LONG_BREAK_MIN : BREAK_MIN;
      cycle++;
    } else {
      isWork = true;
      minutes = WORK_MIN;
    }
    seconds = 0;
  }

  function tickTimer() {
    if (seconds === 0) {
      if (minutes === 0) {
        completeSession();
        return;
      } else {
        minutes--;
        seconds = 59;
      }
    } else {
      seconds--;
    }
  }

  // Format time as MM:SS
  $: timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
</script>

<svelte:head>
  <title>Pomodoro Timer | LearnFlow</title>
</svelte:head>

<div class="flex flex-col items-center justify-center min-h-[60vh] py-10">
  <div class="relative mb-8">
    <!-- Animated tomato/progress ring -->
    <svg width="180" height="180" viewBox="0 0 180 180">
      <circle cx="90" cy="90" r="80" fill="#f3f4f6" />
      <circle
        cx="90" cy="90" r="80"
        fill="none" stroke="#f87171" stroke-width="14"
        stroke-dasharray="502"
        stroke-dashoffset={isWork ? 502 - (502 * ((WORK_MIN*60 - (minutes*60+seconds)) / (WORK_MIN*60))) : 502 - (502 * ((cycle % CYCLES_BEFORE_LONG === 0 ? LONG_BREAK_MIN : BREAK_MIN)*60 - (minutes*60+seconds)) / ((cycle % CYCLES_BEFORE_LONG === 0 ? LONG_BREAK_MIN : BREAK_MIN)*60))}
        stroke-linecap="round"
        style="transition: stroke-dashoffset 0.5s linear;"
      />
      <!-- Tomato face -->
      <circle cx="90" cy="90" r="60" fill="#f87171" />
      <ellipse cx="90" cy="70" rx="18" ry="10" fill="#34d399" />
      <ellipse cx="80" cy="100" rx="6" ry="8" fill="#fff" />
      <ellipse cx="100" cy="100" rx="6" ry="8" fill="#fff" />
      <ellipse cx="80" cy="102" rx="2" ry="3" fill="#222" />
      <ellipse cx="100" cy="102" rx="2" ry="3" fill="#222" />
      <path d="M80 115 Q90 125 100 115" stroke="#222" stroke-width="3" fill="none" />
    </svg>
    {#if showConfetti}
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none animate-bounce">
        <span class="text-5xl">🎉</span>
      </div>
    {/if}
    <div class="absolute inset-0 flex flex-col items-center justify-center">
      <span class="text-5xl font-mono font-bold text-gray-900 dark:text-white drop-shadow">{timeStr}</span>
      <span class="mt-2 text-lg font-semibold {isWork ? 'text-red-500' : 'text-green-500'}">
        {isWork ? 'Work' : (cycle % CYCLES_BEFORE_LONG === 0 ? 'Long Break' : 'Break')}
      </span>
    </div>
  </div>
  <div class="flex space-x-4 mb-6">
    <button class="px-6 py-2 rounded-lg bg-indigo-600 text-white font-bold shadow hover:bg-indigo-700 transition" on:click={startTimer} disabled={isRunning}>
      <i class="fas fa-play mr-2"></i> Start
    </button>
    <button class="px-6 py-2 rounded-lg bg-yellow-400 text-white font-bold shadow hover:bg-yellow-500 transition" on:click={pauseTimer} disabled={!isRunning}>
      <i class="fas fa-pause mr-2"></i> Pause
    </button>
    <button class="px-6 py-2 rounded-lg bg-gray-300 text-gray-700 font-bold shadow hover:bg-gray-400 transition" on:click={resetTimer}>
      <i class="fas fa-redo mr-2"></i> Reset
    </button>
  </div>
  <div class="flex items-center space-x-6 mt-2">
    <span class="text-sm text-gray-500">Cycle: <span class="font-bold text-indigo-600">{cycle}</span></span>
    <span class="text-sm text-gray-500">Completed: <span class="font-bold text-green-500">{completedCycles}</span></span>
  </div>
  <div class="mt-8 text-center text-gray-400 text-xs">
    <span>Stay focused! Every 4 cycles, enjoy a longer break 🍅</span>
  </div>
</div>

<style>
  .animate-bounce {
    animation: bounce 1s infinite alternate;
  }
  @keyframes bounce {
    0% { transform: translateY(0); }
    100% { transform: translateY(-20px); }
  }
</style>
