<script lang="ts">
  import { UserActivityService } from '$lib/services/user/userActivityService';
  import { user } from '$lib/stores/auth';
  import type { Exercise } from '$lib/types/shared';

  export let exercise: Exercise;
  export let score: number;
  export let timeSpent: number;

  const activityService = UserActivityService.getInstance();

  async function trackExerciseAttempt() {
    const userId = $user?.uid;
    if (!userId) return;

    await activityService.trackExerciseAttempt(
      userId,
      exercise.id,
      score,
      timeSpent
    );
  }

  $: if (score !== undefined && timeSpent !== undefined) {
    trackExerciseAttempt();
  }
</script>

<!-- Your existing exercise content template --> 