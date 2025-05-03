<script lang="ts">
  import { onMount } from 'svelte';
  import CourseCard from './CourseCard.svelte';
  import type { ContentNode } from '$lib/services/courses/courseService';
  import Icon from '@iconify/svelte';
  
  export let courses: ContentNode[] = [];
  export let title: string = "Featured Courses";
  
  let selectedIndex = 0;
  
  function next() {
    if (selectedIndex < courses.length - 1) {
      selectedIndex++;
    }
  }
  
  function prev() {
    if (selectedIndex > 0) {
      selectedIndex--;
    }
  }
</script>

<div class="course-carousel">
  <div class="flex justify-between items-center mb-4">
    <h2 class="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
    
    <div class="flex space-x-2">
      <button 
        on:click={prev}
        class="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={selectedIndex === 0}
      >
        <Icon icon="mdi:chevron-left" class="w-5 h-5" />
      </button>
      
      <button 
        on:click={next}
        class="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={selectedIndex === courses.length - 1}
      >
        <Icon icon="mdi:chevron-right" class="w-5 h-5" />
      </button>
    </div>
  </div>
  
  <div class="carousel-container overflow-hidden">
    <div class="carousel-track flex transition-transform duration-300" style="transform: translateX(-{selectedIndex * 100}%)">
      {#each courses as course, i}
        <div class="carousel-item w-full flex-shrink-0 p-2">
          <CourseCard {course} isSelected={i === selectedIndex} />
        </div>
      {/each}
    </div>
  </div>
</div>