<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import type { CourseStructure } from '$lib/types/shared';
  import type { ServiceResponse } from '$lib/types/service';
  import CourseCard from '$lib/components/courses/CourseCard.svelte';
  import LoadingSpinner from '$lib/components/shared/LoadingSpinner.svelte';
  import ErrorMessage from '$lib/components/shared/ErrorMessage.svelte';
  import SearchBar from '$lib/components/shared/SearchBar.svelte';
  import FilterDropdown from '$lib/components/shared/FilterDropdown.svelte';
  import { fetchCourses } from '$lib/services/courses/courseService';

  let courses: CourseStructure[] = [];
  let loading = true;
  let error: string | null = null;
  let searchQuery = '';
  let selectedCategory: string | null = null;
  let selectedDifficulty: string | null = null;

  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
  let categories: string[] = [];

  onMount(async () => {
    try {
      loading = true;
      error = null;
      const response = await fetchCourses();
      
      if (response.error) {
        error = response.error.message;
        return;
      }

      if (response.data) {
        courses = response.data;
        categories = [...new Set(courses
          .map(course => course.category)
          .filter((category): category is string => category !== undefined)
        )];
      }
    } catch (err) {
      console.error('Error loading courses:', err);
      error = err instanceof Error ? err.message : 'Failed to load courses';
    } finally {
      loading = false;
    }
  });

  $: filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || course.category === selectedCategory;
    const matchesDifficulty = !selectedDifficulty || course.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
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
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Courses</h1>

  {#if loading}
    <div class="flex justify-center items-center min-h-[400px]" transition:fade>
      <LoadingSpinner size="lg" />
    </div>
  {:else if error}
    <div class="my-8" transition:fade>
      <ErrorMessage message={error} type="error" />
    </div>
  {:else}
    <div class="mb-8 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:space-x-4">
      <div class="flex-1">
        <SearchBar
          placeholder="Search courses..."
          value={searchQuery}
          on:search={handleSearch}
        />
      </div>
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
      </div>
    </div>

    {#if filteredCourses.length === 0}
      <div class="text-center py-12" transition:fade>
        <p class="text-gray-600 dark:text-gray-400">No courses found matching your criteria.</p>
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" transition:fade>
        {#each filteredCourses as course (course.id)}
          <CourseCard {course} />
        {/each}
      </div>
    {/if}
  {/if}
</div>