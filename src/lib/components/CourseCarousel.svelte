<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import CourseCard from './CourseCard.svelte';
  import { listCourses, type CourseStructure } from '$lib/services/courseService.js';
  import { logStart, logEnd } from '$lib/services/activityService.js';
  import '@splidejs/splide/dist/css/splide.min.css';

  let courses: CourseStructure[] = [];
  let viewId: string | null = null;

  let splideElement: HTMLElement;
  let splideInstance: any = null; // Use `Splide | null = null;` if types installed

  const splideOptions = {
    type       : 'loop', // Or 'slide' if you don't want infinite looping
    perPage    : 3,
    gap        : '1.5rem', // Slightly increased gap
    pagination : false,
    focus      : 0,      // Start focus on the first slide
    omitEnd    : true,   // Useful with loop type to avoid empty space calculation issues
    // Consider adding keyboard navigation if desired: keyboard: 'global',
    breakpoints: {
      1024: {
        perPage: 2,
        gap: '1rem',
      },
      640: {
        perPage: 1,
        gap: '1rem',
      },
    },
  };

  // Function to initialize Splide
  const initSplide = () => {
    // Check if window.Splide exists and the element is available
    if (typeof window !== 'undefined' && window.Splide && splideElement) {
      // Destroy existing instance if it exists (prevents errors on hot reload)
      if (splideInstance) {
          splideInstance.destroy(true);
      }
      // Use 'any' or install types for better type safety
      splideInstance = new (window as any).Splide(splideElement, splideOptions).mount();
    }
  };

  // Function to load Splide script dynamically
  const loadSplideScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        // Check if script already exists or is loading
        if (document.querySelector('script[src*="@splidejs/splide"]')) {
            // If Splide might already be loaded but not yet available on window, wait briefly
            const checkSplide = setInterval(() => {
                if (window.Splide) {
                    clearInterval(checkSplide);
                    resolve();
                }
            }, 100);
            // Add a timeout to prevent infinite loop
            setTimeout(() => {
                clearInterval(checkSplide);
                if (!window.Splide) reject(new Error("Splide failed to load"));
            }, 5000); // 5 second timeout
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/js/splide.min.js';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = (err) => reject(err);
        document.head.appendChild(script);
    });
  };

  onMount(async () => {
    viewId = await logStart('view_continuing_learning', 'courses');
    courses = await listCourses();
    initSplide();
  });
  onDestroy(() => {
    if (viewId) logEnd(viewId);
    if (splideInstance) splideInstance.destroy(true);
  });
</script>

<div class="course-carousel-container mb-8 py-4" style="--carousel-bg-rgb: 17, 24, 39;"> <div class="container mx-auto px-4"> <div class="flex justify-between items-center mb-6"> <h2 class="text-xl font-semibold text-gray-100">Continue Learning</h2> <a
        href="/courses"
        class="text-sm text-indigo-400 hover:text-indigo-200 font-medium transition-colors duration-200 ease-in-out"
      >
        View All
      </a>
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
</div>

<style>
  /* Ensure container takes full width if needed */
  .course-carousel-container {
    width: 100%;
    overflow: hidden; /* Prevents fade extending beyond container */
    position: relative; /* Needed for positioning arrows relative to this container */
  }

  /* Splide track positioning for pseudo-elements */
  :global(.splide__track) {
    position: relative;
    /* Add some padding to prevent cards touching the fade effect directly */
    /* Adjust padding based on the fade width */
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    margin-left: -0.5rem; /* Counteract padding for alignment */
    margin-right: -0.5rem;
  }


  /* --- Refined Fade Effect --- */
  :global(.splide__track::before),
  :global(.splide__track::after) {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 6rem; /* Adjust width of the fade */
    z-index: 2; /* Above slides, below arrows */
    pointer-events: none; /* Allow clicks through */
  }

  /* Left edge gradient - uses CSS variable for background */
  :global(.splide__track::before) {
    left: 0;
    background: linear-gradient(to right,
      rgba(var(--carousel-bg-rgb, 17, 24, 39), 1) 15%, /* Start solid */
      rgba(var(--carousel-bg-rgb, 17, 24, 39), 0.7) 50%, /* Fade */
      rgba(var(--carousel-bg-rgb, 17, 24, 39), 0) 100% /* Fully transparent */
    );
  }

  /* Right edge gradient - uses CSS variable for background */
  :global(.splide__track::after) {
    right: 0;
     background: linear-gradient(to left,
      rgba(var(--carousel-bg-rgb, 17, 24, 39), 1) 15%,
      rgba(var(--carousel-bg-rgb, 17, 24, 39), 0.7) 50%,
      rgba(var(--carousel-bg-rgb, 17, 24, 39), 0) 100%
    );
  }


  /* --- Refined Arrow Styling --- */
  :global(.splide__arrow) {
    /* Position adjustments if needed - relative to splide container */
    /* Example: Slightly offset */
    /* top: 50%; transform: translateY(-50%); */

    background: rgba(45, 55, 72, 0.6); /* Darker semi-transparent bg (e.g., gray-700 @ 60%) */
    opacity: 0; /* Hidden by default */
    transition: background-color 0.3s ease, opacity 0.3s ease;
    z-index: 3; /* Ensure arrows are above the fade effect */
    width: 2.5rem; /* Standard size */
    height: 2.5rem;
    border-radius: 50%; /* Make them circular */
  }

  /* Show arrows on hover of the main container */
   .course-carousel-container:hover :global(.splide__arrow) {
     opacity: 0.8;
   }
   :global(.splide__arrow:hover) {
     background: rgba(71, 85, 105, 0.9); /* Slightly darker/more opaque on hover (e.g., gray-600 @ 90%) */
     opacity: 1;
   }

  :global(.splide__arrow svg) {
    fill: #cbd5e1; /* Lighter gray icon (Tailwind slate-300) */
    width: 1.2em;  /* Adjust icon size */
    height: 1.2em;
    transition: fill 0.3s ease;
  }
   :global(.splide__arrow:hover svg) {
       fill: #ffffff; /* White on hover */
   }

  :global(.splide__arrow:disabled) {
    opacity: 0 !important; /* Hide disabled arrows completely */
    cursor: default;
  }

  /* Positioning arrows slightly inside the track area */
   :global(.splide__arrow--prev) {
     left: 1rem; /* Adjust as needed */
   }
   :global(.splide__arrow--next) {
     right: 1rem; /* Adjust as needed */
   }

  /* Ensure slides don't have unwanted background/borders */
  :global(.splide__slide) {
    background: transparent;
    border: none;
    padding: 0.25rem; /* Add slight padding around cards if needed */
  }
</style>