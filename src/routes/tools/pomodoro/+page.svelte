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
  let sessionDurationSeconds = WORK_MIN * 60;
  $: phaseLabel = isWork ? 'Focus Session' : (cycle % CYCLES_BEFORE_LONG === 0 ? 'Long Break' : 'Short Break');
  $: upcomingLabel = isWork ? (cycle % CYCLES_BEFORE_LONG === 0 ? 'Long Break' : 'Short Break') : 'Focus Session';

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
    sessionDurationSeconds = (minutes * 60) || WORK_MIN * 60;
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
    sessionDurationSeconds = (minutes * 60) || WORK_MIN * 60;
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
  $: remainingSeconds = minutes * 60 + seconds;
  $: progressRatio = sessionDurationSeconds > 0
    ? Math.min(1, Math.max(0, (sessionDurationSeconds - remainingSeconds) / sessionDurationSeconds))
    : 0;
  $: isOnBreak = !isWork;
</script>

<svelte:head>
  <title>Pomodoro Timer | LearnFlow</title>
</svelte:head>

<div class="flex flex-col h-[85vh] max-w-7xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden mt-6 border border-gray-200 dark:border-gray-800">
  <!-- Header -->
  <div class="bg-gradient-to-br from-rose-50/80 via-orange-50/50 dark:from-rose-950/30 dark:via-orange-950/20 to-white dark:to-gray-900 p-6 border-b border-gray-200 dark:border-gray-800">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-orange-600 dark:from-rose-400 dark:to-orange-400 flex items-center">
        <i class="fas fa-clock mr-3"></i> Pomodoro Timer
      </h1>
      <div class="flex gap-2">
        <button 
          class="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white shadow-md transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-opacity-50"
          on:click={startTimer}
          disabled={isRunning}
          title="Start focus session"
          aria-label="Start focus session"
        >
          <i class="fas fa-play"></i>
        </button>
        <button 
          class="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white shadow-md transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
          on:click={pauseTimer}
          disabled={!isRunning}
          title="Pause timer"
          aria-label="Pause timer"
        >
          <i class="fas fa-pause"></i>
        </button>
        <button 
          class="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-md transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
          on:click={resetTimer}
          title="Reset timer"
          aria-label="Reset timer"
        >
          <i class="fas fa-rotate-right"></i>
        </button>
      </div>
    </div>
    <p class="text-gray-600 dark:text-gray-300 mt-2">Stay focused with structured work and recovery intervals tailored for deep study time</p>
  </div>

  <!-- Main Content -->
  <div class="flex-1 overflow-hidden">
    <div class="grid grid-cols-1 lg:grid-cols-3 h-full gap-0">
      <!-- Timer Section -->
      <div class="lg:col-span-2 p-6 bg-gradient-to-br from-white via-rose-50/30 dark:from-gray-900 dark:via-rose-950/10 to-orange-50/20 dark:to-orange-950/5 flex items-center justify-center">
        <div class="timer-container">
          <div class="timer-layout">
            <div
              class="timer-surface"
              role="timer"
              aria-live="polite"
              aria-label={`${phaseLabel} remaining ${timeStr}`}
            >
              <div class="timer-ring" style={`--progress:${progressRatio}`}></div>
              <div class="timer-inner">
                <span class="timer-phase" data-state={isOnBreak ? 'break' : 'focus'}>{phaseLabel}</span>
                <span class="timer-time">{timeStr}</span>
                <span class="timer-next">Next • {upcomingLabel}</span>
              </div>
              {#if showConfetti}
                <div class="timer-confetti" aria-hidden="true">
                  <span>✨</span>
                  <span>🎉</span>
                  <span>🌟</span>
                </div>
              {/if}
            </div>

            <div class="timer-details">
              <h2 class="timer-details__title">Session snapshot</h2>
              <div class="timer-details__grid">
                <div class="timer-stat">
                  <span class="timer-stat__label">Cycle</span>
                  <span class="timer-stat__value">{cycle}</span>
                  <span class="timer-stat__hint">Focus blocks completed</span>
                </div>
                <div class="timer-stat">
                  <span class="timer-stat__label">Completed sets</span>
                  <span class="timer-stat__value">{completedCycles}</span>
                  <span class="timer-stat__hint">Full focus rounds</span>
                </div>
                <div class="timer-stat">
                  <span class="timer-stat__label">Mode</span>
                  <span class="timer-stat__value" data-state={isOnBreak ? 'break' : 'focus'}>{isOnBreak ? 'Recovery Break' : 'Deep Focus'}</span>
                  <span class="timer-stat__hint">Current session type</span>
                </div>
                <div class="timer-stat">
                  <span class="timer-stat__label">Status</span>
                  <span class="timer-stat__value">{isRunning ? 'Running' : 'Paused'}</span>
                  <span class="timer-stat__hint">Control state</span>
                </div>
              </div>
            </div>
          </div>

          <div class="timer-footnote">
            Stay focused! Every {CYCLES_BEFORE_LONG} focus runs unlock a longer recovery break. Take a moment to note what you accomplished before you switch contexts.
          </div>
        </div>
      </div>

      <!-- Sidebar Section -->
      <div class="lg:col-span-1 p-6 bg-gradient-to-br from-rose-50/50 via-orange-50/30 dark:from-rose-950/20 dark:via-orange-950/10 to-white dark:to-gray-900 border-l border-gray-200 dark:border-gray-800 overflow-y-auto">
        <div class="space-y-6">
          <!-- Session Overview -->
          <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 class="text-sm font-semibold uppercase tracking-[0.18em] text-rose-600 dark:text-rose-300 mb-4 flex items-center">
              <i class="fas fa-info-circle mr-2"></i> Session Overview
            </h2>
            <dl class="space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <div class="flex justify-between">
                <dt>Focus Length</dt>
                <dd class="font-semibold">{WORK_MIN} min</dd>
              </div>
              <div class="flex justify-between">
                <dt>Short Break</dt>
                <dd class="font-semibold">{BREAK_MIN} min</dd>
              </div>
              <div class="flex justify-between">
                <dt>Long Break</dt>
                <dd class="font-semibold">{LONG_BREAK_MIN} min</dd>
              </div>
              <div class="flex justify-between">
                <dt>Cycles per Set</dt>
                <dd class="font-semibold">{CYCLES_BEFORE_LONG}</dd>
              </div>
            </dl>
          </div>

          <!-- Live Progress -->
          <div class="bg-gradient-to-br from-rose-500 via-orange-500 to-amber-500 text-white p-6 rounded-xl shadow-lg">
            <h2 class="text-sm font-semibold uppercase tracking-[0.18em] mb-4 flex items-center">
              <i class="fas fa-chart-line mr-2"></i> Live Progress
            </h2>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p class="text-xs uppercase text-white/70">Current Phase</p>
                <p class="mt-1 text-base font-semibold">{phaseLabel}</p>
              </div>
              <div>
                <p class="text-xs uppercase text-white/70">Up Next</p>
                <p class="mt-1 text-base font-semibold">{upcomingLabel}</p>
              </div>
              <div>
                <p class="text-xs uppercase text-white/70">Cycle</p>
                <p class="mt-1 text-base font-semibold">{cycle}</p>
              </div>
              <div>
                <p class="text-xs uppercase text-white/70">Completed Sets</p>
                <p class="mt-1 text-base font-semibold">{completedCycles}</p>
              </div>
            </div>
          </div>

          <!-- Focus Tips -->
          <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <i class="fas fa-lightbulb mr-2 text-yellow-500"></i> Focus Tips
            </h2>
            <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              Stack four focus runs back-to-back. Pause only during breaks to reinforce your focus rhythm.
            </p>
            <ul class="space-y-3 text-sm">
              <li class="flex items-start gap-3">
                <i class="fas fa-check-circle mt-0.5 text-rose-500 flex-shrink-0"></i>
                <span>Prep a single task per session.</span>
              </li>
              <li class="flex items-start gap-3">
                <i class="fas fa-check-circle mt-0.5 text-rose-500 flex-shrink-0"></i>
                <span>Stretch or hydrate on long breaks.</span>
              </li>
              <li class="flex items-start gap-3">
                <i class="fas fa-check-circle mt-0.5 text-rose-500 flex-shrink-0"></i>
                <span>Log completions to build momentum.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .timer-container {
    width: 100%;
    max-width: 520px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    align-items: stretch;
    padding: 0.75rem;
    overflow-y: auto;
  }

  .timer-layout {
    display: grid;
    gap: 1rem;
  }

  @media (min-width: 1024px) {
    .timer-layout {
      grid-template-columns: minmax(0, 1fr) minmax(200px, 230px);
      align-items: stretch;
    }
  }

  .timer-surface {
    position: relative;
    aspect-ratio: 1;
    max-width: 230px;
    margin: 0 auto;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.85rem;
    background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3), transparent 70%),
      rgba(255, 255, 255, 0.08);
    box-shadow: 0 24px 70px -40px rgba(244, 63, 94, 0.4);
  }

  .timer-ring {
    position: absolute;
    inset: 0;
    border-radius: 9999px;
    background:
      conic-gradient(
        rgba(244, 63, 94, 0.9) calc(var(--progress) * 360deg),
        rgba(148, 163, 184, 0.25) 0deg
      );
    padding: 0.7rem;
  }

  .timer-ring::after {
    content: '';
    position: absolute;
    inset: 1.05rem;
    border-radius: inherit;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
    box-shadow: inset 0 8px 24px rgba(255, 255, 255, 0.35);
  }

  :global(.dark) .timer-ring::after {
    background: linear-gradient(180deg, rgba(17, 24, 39, 0.9), rgba(17, 24, 39, 0.75));
    box-shadow: inset 0 10px 28px rgba(14, 14, 26, 0.6);
  }

  .timer-inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    text-align: center;
    padding: 0.2rem 0.5rem;
  }

  .timer-phase {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #fb7185;
  }

  .timer-phase[data-state='break'] {
    color: #34d399;
  }

  :global(.dark) .timer-phase {
    color: #fb7185;
  }

  .timer-time {
    font-size: clamp(2rem, 5vw, 2.6rem);
    font-family: 'JetBrains Mono', 'SFMono-Regular', ui-monospace, monospace;
    font-weight: 700;
    color: rgba(15, 23, 42, 0.95);
    letter-spacing: 0.05em;
  }

  :global(.dark) .timer-time {
    color: rgba(255, 255, 255, 0.92);
  }

  .timer-next {
    font-size: 0.68rem;
    font-weight: 500;
    color: rgba(15, 23, 42, 0.55);
  }

  :global(.dark) .timer-next {
    color: rgba(226, 232, 240, 0.55);
  }

  .timer-confetti {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    pointer-events: none;
  }

  .timer-confetti span {
    font-size: 1.8rem;
    animation: float 1.4s ease-in-out infinite alternate;
  }

  .timer-details {
    border-radius: 1.35rem;
    padding: 1.1rem;
    background: rgba(255, 255, 255, 0.6);
    border: 1px solid rgba(244, 114, 182, 0.12);
    backdrop-filter: blur(14px);
    box-shadow: 0 20px 70px -55px rgba(14, 116, 144, 0.4);
  }

  :global(.dark) .timer-details {
    background: rgba(15, 23, 42, 0.58);
    border-color: rgba(248, 113, 113, 0.16);
  }

  .timer-details__title {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 600;
    color: rgba(15, 23, 42, 0.6);
    margin-bottom: 0.75rem;
  }

  :global(.dark) .timer-details__title {
    color: rgba(226, 232, 240, 0.65);
  }

  .timer-details__grid {
    display: grid;
    gap: 0.7rem;
    grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  }

  .timer-stat {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .timer-stat__label {
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 600;
    color: rgba(100, 116, 139, 0.85);
  }

  :global(.dark) .timer-stat__label {
    color: rgba(148, 163, 184, 0.75);
  }

  .timer-stat__value {
    font-size: 1.1rem;
    font-weight: 600;
    color: rgba(15, 23, 42, 0.85);
  }

  .timer-stat__value[data-state='break'] {
    color: #10b981;
  }

  :global(.dark) .timer-stat__value {
    color: rgba(226, 232, 240, 0.92);
  }

  .timer-stat__hint {
    font-size: 0.62rem;
    color: rgba(100, 116, 139, 0.65);
  }

  :global(.dark) .timer-stat__hint {
    color: rgba(148, 163, 184, 0.6);
  }

  .timer-footnote {
    text-align: center;
    font-size: 0.68rem;
    color: rgba(100, 116, 139, 0.78);
    max-width: 420px;
    margin: 0 auto;
  }

  :global(.dark) .timer-footnote {
    color: rgba(148, 163, 184, 0.65);
  }
</style>
