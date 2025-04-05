<script lang="ts">
  // Note: onMount is imported but not used in this specific example.
  // Remove if not needed elsewhere in your actual component.
  import { onMount } from 'svelte';

  // Map Tailwind color names used dynamically to actual CSS color values
  // (Using default Tailwind v3 colors - verify if you use custom ones)
  const colorMap: { [key: string]: string } = {
    // Gradient Colors
    'sky-500': '#0ea5e9',
    'sky-400': '#38bdf8',
    'violet-500': '#8b5cf6',
    'violet-400': '#a78bfa',
    'emerald-500': '#10b981',
    'emerald-400': '#34d399',
    'rose-500': '#f43f5e',
    'rose-400': '#fb7185',
    // Text Hover/Focus Colors (-600) <-- Used for --hover-color
    'sky-600': '#0284c7',
    'violet-600': '#7c3aed',
    'emerald-600': '#059669',
    'rose-600': '#e11d48',
    // Text Progress Colors (-700)
    'sky-700': '#0369a1',
    'violet-700': '#6d28d9',
    'emerald-700': '#047857',
    'rose-700': '#be123c',
  };

  // Helper function to get CSS color, falls back to gray if not found
  function getCssColor(tailwindColorName: string): string {
    return colorMap[tailwindColorName] || '#6b7280'; // Default: gray-500
  }

  // Placeholder data for courses
  const coursesList = [
    {
      id: 'js-advanced',
      title: 'Advanced JavaScript',
      description: 'Master modern JavaScript concepts including closures, prototypes, promises, and async/await. Build real-world applications with modern JavaScript patterns.',
      progress: 65,
      icon: 'fa-code', // Assumes Font Awesome 5 Free 'fas' prefix
      gradient: {
        from: 'sky-500',
        to: 'sky-400'
      }
    },
    {
      id: 'linear-algebra',
      title: 'Linear Algebra',
      description: 'Comprehensive introduction to vectors, matrices, determinants, and transformations. Applications in computer graphics and machine learning.',
      progress: 42,
      icon: 'fa-calculator',
      gradient: {
        from: 'violet-500',
        to: 'violet-400'
      }
    },
    {
      id: 'spanish',
      title: 'Spanish for Beginners',
      description: 'Build your vocabulary and grammar foundations for everyday Spanish conversations. Includes audio pronunciations and interactive exercises.',
      progress: 78,
      icon: 'fa-language',
      gradient: {
        from: 'emerald-500',
        to: 'emerald-400'
      }
    },
    {
      id: 'quantum',
      title: 'Quantum Physics',
      description: 'Introduction to quantum mechanics principles, wave functions, and the uncertainty principle. Explore the fascinating world of quantum theory.',
      progress: 15,
      icon: 'fa-atom',
      gradient: {
        from: 'rose-500',
        to: 'rose-400'
      }
    }
  ];
</script>

<div class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
  <h1 class="text-3xl font-bold text-white-800 mb-8">My Courses</h1>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {#each coursesList as course (course.id)}
      <div
        class="
          group 
          bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl
          border border-gray-100
          transition-all duration-300 ease-in-out transform hover:-translate-y-1
          flex flex-col h-full cursor-pointer
        "
        role="button" tabindex="0" aria-label={`View ${course.title} course`}
      >
        
        <div
          class="h-36 relative flex items-center justify-center"
          style:--gradient-from={getCssColor(course.gradient.from)}
          style:--gradient-to={getCssColor(course.gradient.to)}
          style="background-image: linear-gradient(to right, var(--gradient-from), var(--gradient-to));"
        >
          <i class="fas {course.icon} text-white text-5xl opacity-80 group-hover:opacity-100 transition-opacity duration-300"></i>
        </div>

        
        <div class="p-5 flex flex-col flex-grow">
         
           <h3
             class="
               font-semibold text-lg text-gray-800 mb-2
               transition-colors duration-300
               group-hover:text-[var(--hover-color)] 
               group-focus:text-[var(--hover-color)] 
             "
             style:--hover-color={getCssColor(course.gradient.from.split('-')[0] + '-600')} 
           >
            {course.title}
          </h3>

          
          <p class="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
            {course.description}
          </p>

          
          <div class="mt-auto pt-4">
            <div class="flex items-center justify-between mb-1">
              
              <span
                class="text-xs font-medium"
                style:color={getCssColor(course.gradient.from.split('-')[0] + '-700')}
              >Progress</span>
              
              <span
                class="text-xs font-medium"
                style:color={getCssColor(course.gradient.from.split('-')[0] + '-700')}
              >{course.progress}%</span>
            </div>
            
            <div class="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
             
              <div
                class="h-2.5 rounded-full transition-all duration-300 ease-out"
                style:width="{course.progress}%"
                style:background-color={getCssColor(course.gradient.from)}
                role="progressbar"
                aria-valuenow={course.progress}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-label={`${course.title} progress`}
              ></div>
            </div>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  /* Ensure Font Awesome is loaded globally (e.g., via CDN in index.html) */
  /* @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css'); */

  /* Basic definition for line-clamp if Tailwind Typography plugin isn't used */
  .line-clamp-3 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    /* Consider adding 'max-height' as a fallback for non-webkit browsers */
  }

  /* Remove default browser outline on focus for the button role */
  [role="button"]:focus {
      outline: none;
  }

  /* Add a visible focus state using ring utility classes (requires Tailwind) */
  /* If not using Tailwind's @apply in <style>, define ring styles manually or use outline */
  [role="button"]:focus-visible {
    /* Equivalent Tailwind: @apply ring-2 ring-offset-2 ring-indigo-500; */
    box-shadow: 0 0 0 2px theme('colors.white', white), 0 0 0 4px theme('colors.indigo.500', #6366f1);
     /* Simple Outline fallback: */
     /* outline: 2px solid #6366f1; */
     /* outline-offset: 2px; */
  }

</style>