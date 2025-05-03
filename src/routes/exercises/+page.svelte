<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import type { Exercise } from '$lib/types/shared';
  import type { ServiceResponse } from '$lib/types/service';
  import ExerciseCard from '$lib/components/exercises/ExerciseCard.svelte';
  import LoadingSpinner from '$lib/components/shared/LoadingSpinner.svelte';
  import ErrorMessage from '$lib/components/shared/ErrorMessage.svelte';
  import SearchBar from '$lib/components/shared/SearchBar.svelte';
  import FilterDropdown from '$lib/components/shared/FilterDropdown.svelte';
  import { getAllExercises } from '$lib/services/courses/exerciseService';

  let exercises: Exercise[] = [];
  let loading = true;
  let error: string | null = null;
  let searchQuery = '';
  let selectedCategory: string | null = null;
  let selectedDifficulty: string | null = null;
  let selectedTags: string[] = [];

  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
  let categories: string[] = [];
  let tags: string[] = [];

  onMount(async () => {
    try {
      loading = true;
      error = null;
      const response = await getAllExercises();
      
      if (response.error) {
        error = response.error.message;
        return;
      }

      if (response.data) {
        exercises = response.data;
        categories = [...new Set(exercises
          .map(exercise => exercise.category)
          .filter((category): category is string => category !== undefined)
        )];
        tags = [...new Set(exercises
          .flatMap(exercise => exercise.tags || [])
          .filter((tag): tag is string => tag !== undefined)
        )];
      }
    } catch (err) {
      console.error('Error loading exercises:', err);
      error = err instanceof Error ? err.message : 'Failed to load exercises';
    } finally {
      loading = false;
    }
  });

  $: filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || exercise.category === selectedCategory;
    const matchesDifficulty = !selectedDifficulty || exercise.difficulty === selectedDifficulty;
    const exerciseTags = exercise.tags || [];
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => exerciseTags.includes(tag));
    return matchesSearch && matchesCategory && matchesDifficulty && matchesTags;
  });

  function handleSearch(event: CustomEvent<string>) {
    searchQuery = event.detail;
  }

  function handleCategoryChange(event: CustomEvent<string | null>) {
    selectedCategory = event.detail;
  }

  function handleDifficultyChange(event: CustomEvent<string | null>) {
    selectedDifficulty = event.detail;
  }

  function handleTagChange(event: CustomEvent<string | null>) {
    const tag = event.detail;
    if (tag) {
      selectedTags = selectedTags.includes(tag)
        ? selectedTags.filter(t => t !== tag)
        : [...selectedTags, tag];
    } else {
      selectedTags = [];
    }
  }
</script>

<svelte:head>
  <title>Exercises | LearnFlow</title>
  <meta name="description" content="Practice and improve your skills with our interactive exercises" />
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Exercises</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          Practice and improve your skills with our interactive exercises
        </p>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
        <SearchBar
          placeholder="Search exercises..."
          value={searchQuery}
          on:search={handleSearch}
        />

        <div class="flex space-x-4">
          <FilterDropdown
            options={categories}
            selected={selectedCategory}
            placeholder="All Categories"
            on:change={handleCategoryChange}
          />
          <FilterDropdown
            options={difficulties}
            selected={selectedDifficulty}
            placeholder="All Difficulties"
            on:change={handleDifficultyChange}
          />
          <FilterDropdown
            options={tags}
            selected={null}
            placeholder="Filter by Tags"
            on:change={handleTagChange}
          />
        </div>
      </div>
    </div>

    {#if loading}
      <div class="flex justify-center items-center min-h-[400px]" transition:fade>
        <LoadingSpinner size="lg" />
      </div>
    {:else if error}
      <div class="my-8" transition:fade>
        <ErrorMessage message={error} type="error" />
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" transition:fade>
        {#each filteredExercises as exercise (exercise.id)}
          <ExerciseCard {exercise} />
        {/each}
      </div>

      {#if filteredExercises.length === 0}
        <div class="text-center py-12" transition:fade>
          <p class="text-gray-600 dark:text-gray-400">No exercises found matching your criteria.</p>
        </div>
      {/if}
    {/if}
  </div>
</div>