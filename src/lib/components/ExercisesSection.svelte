<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import ExerciseCard from './ExerciseCard.svelte';
  import type { Exercise } from '$lib/services/courses/exerciseService';
  import { fetchExercises } from '$lib/services/courses/exerciseService';

  export let categoryId: string | null = null;
  export let limit: number | null = null;
  export let title: string = 'Exercises';
  export let onExerciseClick: (exercise: Exercise) => void = (exercise) => {
    console.log('Exercise clicked:', exercise.id);
  };

  let exercises: Exercise[] = [];
  let isLoading = true;
  let error: string | null = null;
  let filteredExercises: Exercise[] = [];
  let searchQuery = '';
  let selectedDifficulty: 'all' | 'beginner' | 'intermediate' | 'advanced' = 'all';
  let selectedTags: string[] = [];
  let showFilters = false;

  // Update filters when exercises or filter values change
  $: applyFilters();

  function applyFilters() {
    let result = exercises;

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(ex => ex.title.toLowerCase().includes(lowerQuery) || ex.description?.toLowerCase().includes(lowerQuery));
    }

    if (selectedDifficulty !== 'all') {
      // Compare with lowercase version of exercise difficulty
      result = result.filter(ex => ex.difficulty?.toLowerCase() === selectedDifficulty);
    }

    if (selectedTags.length > 0) {
      result = result.filter(ex => selectedTags.every(tag => ex.tags?.includes(tag)));
    }

    if (limit !== null) {
      result = result.slice(0, limit);
    }

    filteredExercises = result;
  }

  async function load() {
    isLoading = true;
    error = null;
    try {
      // Pass an options object, including categoryId if it exists
      const options = categoryId ? { category: categoryId } : {};
      const all = await fetchExercises(options);
      exercises = all;
    } catch (err) {
      console.error(err);
      error = 'Failed to load exercises';
    } finally {
      isLoading = false;
    }
  }

  onMount(load);

  function handleSearchInput(e: InputEvent) {
    searchQuery = (e.target as HTMLInputElement).value;
  }

  function handleDifficultyChange(difficulty: typeof selectedDifficulty) {
    selectedDifficulty = difficulty;
  }

  function toggleTag(tag: string) {
    selectedTags = selectedTags.includes(tag) ? selectedTags.filter(t => t !== tag) : [...selectedTags, tag];
  }

  function clearFilters() {
    searchQuery = '';
    selectedDifficulty = 'all';
    selectedTags = [];
  }

  function toggleFilters() {
    showFilters = !showFilters;
  }
</script>

<section class="exercises-section" in:fade={{ duration: 300 }}>
  <div class="section-header">
    <h2 class="section-title">{title}</h2>
    <button on:click={toggleFilters} aria-expanded={showFilters} class="filter-toggle">
      <i class="fas fa-filter"></i> Filters
      {#if selectedDifficulty !== 'all' || selectedTags.length || searchQuery}
        <span class="filter-badge">{selectedTags.length + (selectedDifficulty !== 'all' ? 1 : 0) + (searchQuery ? 1 : 0)}</span>
      {/if}
    </button>
  </div>

  {#if isLoading}
    <div class="loading-state">Loading exercises...</div>
  {:else if error}
    <div class="error-state">{error}</div>
  {:else if filteredExercises.length === 0}
    <div class="empty-state">No exercises found.</div>
  {:else}
    <div class="exercises-grid">
      {#each filteredExercises as exercise (exercise.id)}
        <ExerciseCard 
          {...exercise} 
          difficulty={exercise.difficulty?.toLowerCase() as ('beginner' | 'intermediate' | 'advanced' | undefined)} 
          on:click={() => onExerciseClick(exercise)} 
        />
      {/each}
    </div>
  {/if}
</section>

<style>
  .exercises-section {
    margin-bottom: 3rem;
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  
  .section-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: #111827;
    margin: 0;
  }
  
  .filter-toggle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    font-size: 0.95rem;
    color: #4b5563;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .filter-toggle:hover {
    background: #f3f4f6;
    border-color: #d1d5db;
  }
  
  .filter-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: #ef4444;
    color: white;
    width: 1.25rem;
    height: 1.25rem;
    font-size: 0.75rem;
    border-radius: 50%;
    font-weight: 600;
  }
  
  .exercises-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }
  
  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 3rem 0;
    color: #6b7280;
  }
  
  .error-state, .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 3rem 0;
    text-align: center;
    color: #6b7280;
  }
</style>
