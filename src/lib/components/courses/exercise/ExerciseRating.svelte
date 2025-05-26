<script lang="ts">
  import { onMount } from 'svelte';
  import { getAuth } from 'firebase/auth';
  import { doc, getDoc, setDoc, getFirestore, updateDoc, increment } from 'firebase/firestore';
  import Icon from '@iconify/svelte';

  export let exerciseId: string;

  let userRating: number | null = null;
  let isSubmitted = false;
  let feedbackText = '';
  let showFeedback = false;

  onMount(async () => {
    await loadUserRating();
  });

  async function loadUserRating() {
    const auth = getAuth();
    if (!auth.currentUser) return;

    try {
      const db = getFirestore();
      const ratingRef = doc(db, 'users', auth.currentUser.uid, 'ratings', exerciseId);
      const ratingDoc = await getDoc(ratingRef);

      if (ratingDoc.exists()) {
        const data = ratingDoc.data();
        userRating = data.rating;
        feedbackText = data.feedback || '';
        isSubmitted = true;
      }
    } catch (err) {
      console.error('Error loading rating:', err);
    }
  }

  async function submitRating() {
    if (userRating === null) return;

    const auth = getAuth();
    if (!auth.currentUser) return;

    try {
      const db = getFirestore();
      const ratingRef = doc(db, 'users', auth.currentUser.uid, 'ratings', exerciseId);
      
      // Save user's rating
      await setDoc(ratingRef, {
        rating: userRating,
        feedback: feedbackText,
        timestamp: new Date()
      });

      // Update exercise aggregated ratings
      const exerciseRef = doc(db, 'exercises', exerciseId);
      await updateDoc(exerciseRef, {
        ratingSum: increment(userRating),
        ratingCount: increment(1),
        averageRating: increment(0) // This will trigger a Cloud Function to recalculate
      });

      isSubmitted = true;
      showFeedback = false;
    } catch (err) {
      console.error('Error submitting rating:', err);
    }
  }

  function handleRatingClick(rating: number) {
    if (!isSubmitted) {
      userRating = rating;
    }
  }

  function editRating() {
    isSubmitted = false;
  }
</script>

<div class="exercise-rating">
  <h3 class="text-lg font-semibold mb-2">Rate this exercise</h3>
  
  {#if !isSubmitted}
    <div class="flex flex-col space-y-4">
      <div class="flex items-center space-x-1">
        {#each Array(5) as _, i}
          <button 
            on:click={() => handleRatingClick(i + 1)}
            class="text-2xl focus:outline-none" 
            disabled={isSubmitted}
            aria-label={`Rate ${i + 1} star${i === 0 ? '' : 's'}`}
          >
            <Icon 
              icon={userRating && i < userRating ? "mdi:star" : "mdi:star-outline"} 
              class={userRating && i < userRating ? "text-yellow-400" : "text-gray-400 hover:text-yellow-400"} 
              width="28" 
              height="28"
            />
          </button>
        {/each}
      </div>
      
      <div>
        <button 
          on:click={() => showFeedback = !showFeedback}
          class="text-sm text-cherry-600 dark:text-cherry-400 hover:underline"
        >
          {showFeedback ? "Hide feedback form" : "Add feedback (optional)"}
        </button>
        
        {#if showFeedback}
          <div class="mt-2">
            <textarea
              bind:value={feedbackText}
              class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-surface dark:bg-surface-dark text-text dark:text-text-light focus:ring-cherry-500 focus:border-cherry-500 min-h-[80px]"
              placeholder="What did you think about this exercise?"
              aria-label="Exercise feedback"
            ></textarea>
          </div>
        {/if}
      </div>
      
      <div>
        <button 
          on:click={submitRating}
          disabled={userRating === null}
          class="px-4 py-2 text-sm font-medium rounded-md bg-cherry-600 text-white hover:bg-cherry-700 dark:bg-cherry-500 dark:hover:bg-cherry-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Rating
        </button>
      </div>
    </div>
  {:else}
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-1">
        {#each Array(5) as _, i}
          <Icon 
            icon={userRating && i < userRating ? "mdi:star" : "mdi:star-outline"} 
            class={userRating && i < userRating ? "text-yellow-400" : "text-gray-400"} 
            width="24" 
            height="24"
          />
        {/each}
      </div>
      
      <button 
        on:click={editRating}
        class="text-sm text-cherry-600 dark:text-cherry-400 hover:underline"
      >
        Edit Rating
      </button>
    </div>
    
    {#if feedbackText}
      <div class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        <p class="italic">"{feedbackText}"</p>
      </div>
    {/if}
  {/if}
</div>