<script lang="ts">
  import { onMount } from 'svelte';
  let score: number | null = null;
  let loading = true;
  let error: string | null = null;

  onMount(async () => {
    try {
      const res = await fetch('/api/score');
      if (!res.ok) throw new Error('Failed to fetch score');
      const data = await res.json();
      score = data.score;
    } catch (e:any) {
      console.error(e);
      error = e.message;
    } finally {
      loading = false;
    }
  });

  function starArray(n: number) {
    const full = Math.floor(n);
    const half = n - full >= 0.5;
    return [...Array(5)].map((_, i) =>
      i < full ? 'full' : i === full && half ? 'half' : 'empty'
    );
  }
</script>

<div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow mb-8">
  <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Score Utilisateur</h2>
  {#if loading}
    <p class="text-gray-600">Loading...</p>
  {:else if error}
    <p class="text-red-500">{error}</p>
  {:else if score !== null}
    <div class="flex items-center">
      <div class="flex mr-3">
        {#each starArray(score) as type}
          {#if type === 'full'}<i class="fas fa-star text-yellow-400"></i>
          {:else if type === 'half'}<i class="fas fa-star-half-alt text-yellow-400"></i>
          {:else}<i class="far fa-star text-gray-300 dark:text-gray-600"></i>{/if}
        {/each}
      </div>
      <span class="text-gray-900 dark:text-gray-100 font-medium">{score}/5</span>
    </div>
  {/if}
</div>