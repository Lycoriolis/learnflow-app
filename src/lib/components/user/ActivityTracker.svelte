<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { UserActivityService } from '$lib/services/user/userActivityService';
  import { user } from '$lib/stores/authStore';

  const activityService = UserActivityService.getInstance();
  let activityInterval: NodeJS.Timeout;
  let lastActivityTime = Date.now();

  function trackActivity() {
    const currentTime = Date.now();
    const minutesSpent = Math.floor((currentTime - lastActivityTime) / (1000 * 60));
    
    if (minutesSpent > 0) {
      const userId = $user?.uid;
      if (userId) {
        activityService.updateTotalLearningTime(userId, minutesSpent);
      }
    }
    
    lastActivityTime = currentTime;
  }

  onMount(() => {
    // Track activity every minute
    activityInterval = setInterval(trackActivity, 60000);
  });

  onDestroy(() => {
    if (activityInterval) {
      clearInterval(activityInterval);
    }
  });
</script>

<svelte:head>
  <script>
    // Track page visibility
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        lastActivityTime = Date.now();
      }
    });
  </script>
</svelte:head>