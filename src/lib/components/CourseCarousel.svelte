<script lang="ts">
  import { onMount } from 'svelte';
  import CourseCard from './CourseCard.svelte';
  import '@splidejs/splide/dist/css/splide.min.css';
  
  // Sample courses data (in a real app, this would come from an API or store)
  const courses = [
    {
      id: 'js-advanced',
      title: 'Advanced JavaScript',
      description: 'Master modern JavaScript concepts',
      progress: 65,
      icon: 'fa-code',
      gradient: {
        from: 'blue-500',
        to: 'blue-400'
      }
    },
    {
      id: 'linear-algebra',
      title: 'Linear Algebra',
      description: 'Vectors, matrices and transformations',
      progress: 42,
      icon: 'fa-calculator',
      gradient: {
        from: 'purple-500',
        to: 'purple-400'
      }
    },
    {
      id: 'spanish',
      title: 'Spanish for Beginners',
      description: 'Build your vocabulary and grammar',
      progress: 78,
      icon: 'fa-language',
      gradient: {
        from: 'green-500',
        to: 'green-400'
      }
    },
    {
      id: 'quantum',
      title: 'Quantum Physics',
      description: 'Introduction to quantum mechanics',
      progress: 15,
      icon: 'fa-atom',
      gradient: {
        from: 'red-500',
        to: 'red-400'
      }
    }
  ];
  
  let splideElement: HTMLElement;
  
  onMount(() => {
    // Check if Splide.js is available
    if (typeof window !== 'undefined' && window.Splide) {
      // @ts-ignore - Splide might not be defined in the types
      new window.Splide(splideElement, {
        type: 'loop',
        perPage: 3,
        gap: '1rem',
        pagination: false,
        breakpoints: {
          1024: {
            perPage: 2,
          },
          640: {
            perPage: 1,
          }
        }
      }).mount();
    } else {
      // Load Splide.js dynamically
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/js/splide.min.js';
      script.onload = () => {
        // @ts-ignore - Splide might not be defined in the types
        new window.Splide(splideElement, {
          type: 'loop',
          perPage: 3,
          gap: '1rem',
          pagination: false,
          breakpoints: {
            1024: {
              perPage: 2,
            },
            640: {
              perPage: 1,
            }
          }
        }).mount();
      };
      document.head.appendChild(script);
    }
  });
</script>

<div class="mb-8">
  <div class="flex justify-between items-center mb-4">
    <h2 class="text-lg font-semibold text-gray-800">Continue Learning</h2>
    <a href="/courses" class="text-sm text-indigo-600 hover:text-indigo-800 font-medium">View All</a>
  </div>
  
  <div class="splide" bind:this={splideElement}>
    <div class="splide__track">
      <ul class="splide__list">
        {#each courses as course (course.id)}
          <li class="splide__slide">
            <CourseCard {course} />
          </li>
        {/each}
      </ul>
    </div>
  </div>
</div>