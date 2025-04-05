<script lang="ts">
  import { timerState } from '$lib/stores/pipStores';
  // TODO: Implement timer logic
</script>

<div class="text-sm">
  <p>Timer Component</p>
  <p>Time Left: {$timerState.timeLeft}</p>
  <p>Mode: {$timerState.mode}</p>
  <button class="text-xs p-1 border rounded bg-gray-100">Start</button>
</div>
