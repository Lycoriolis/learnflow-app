<script lang="ts">
  import { onMount } from 'svelte';
  import type { Course } from '$lib/types/shared';
  import { userProfile } from '$lib/stores/userProfileStore';
  import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
  
  export let limit: number | null = null;
  
  let enrolledCourses: Course[] = [];
  let loading = true;
  let error: string | null = null;
  
  // This would be replaced with actual data fetching logic
  async function fetchEnrolledCourses() {
    try {
      loading = true;
      error = null;
      
      // Simulate API call with sample data
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Sample data - in a real app this would come from an API
      enrolledCourses = [
        {
          id: 'course1',
          title: 'Calculus I',
          description: 'Introduction to differential calculus',
          thumbnail: '/images/thumbnails/calculus.jpg',
          difficulty: 'Intermediate',
          duration: 20, // hours
          enrolledCount: 1240,
          category: 'Mathematics',
          tags: ['calculus', 'math'],
          createdAt: new Date('2023-01-15'),
          updatedAt: new Date('2023-06-10')
        },
        {
          id: 'course2',
          title: 'Linear Algebra',
          description: 'Vectors, matrices and linear transformations',
          thumbnail: '/images/thumbnails/linear-algebra.jpg',
          difficulty: 'Intermediate',
          duration: 15,
          enrolledCount: 980,
          category: 'Mathematics',
          tags: ['algebra', 'math'],
          createdAt: new Date('2023-02-20'),
          updatedAt: new Date('2023-07-05')
        },
        {
          id: 'course3',
          title: 'Quantum Physics',
          description: 'Introduction to quantum mechanics',
          thumbnail: '/images/thumbnails/quantum.jpg',
          difficulty: 'Advanced',
          duration: 25,
          enrolledCount: 650,
          category: 'Physics',
          tags: ['quantum', 'physics'],
          createdAt: new Date('2023-03-10'),
          updatedAt: new Date('2023-08-15')
        },
        {
          id: 'course4',
          title: 'Graph Theory',
          description: 'Mathematical structures to model pairwise relations',
          thumbnail: '/images/thumbnails/graph-theory.jpg',
          difficulty: 'Intermediate',
          duration: 12,
          enrolledCount: 520,
          category: 'Mathematics',
          tags: ['graphs', 'discrete math'],
          createdAt: new Date('2023-04-05'),
          updatedAt: new Date('2023-09-20')
        }
      ];
      
      // Apply limit if provided
      if (limit) {
        enrolledCourses = enrolledCourses.slice(0, limit);
      }
    } catch (err: any) {
      console.error('Error fetching enrolled courses:', err);
      error = err.message || 'Failed to load enrolled courses';
    } finally {
      loading = false;
    }
  }
  
  onMount(() => {
    fetchEnrolledCourses();
  });
</script>

<div>
  <div class="flex justify-between items-center mb-6">
    <h2 class="text-xl font-semibold text-white">My Courses</h2>
    {#if limit}
      <a href="/profile?tab=courses" class="text-blue-400 hover:text-blue-300 text-sm">
        View All
      </a>
    {/if}
  </div>
  
  {#if loading}
    <div class="flex justify-center items-center h-48">
      <LoadingSpinner />
    </div>
  {:else if error}
    <div class="bg-red-500 bg-opacity-20 border border-red-500 text-red-100 p-4 rounded-lg">
      <p>{error}</p>
    </div>
  {:else if enrolledCourses.length === 0}
    <div class="bg-gray-700 p-6 rounded-lg text-center">
      <p class="text-gray-300 mb-4">You haven't enrolled in any courses yet.</p>
      <a href="/courses" class="inline-block bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors">
        Browse Courses
      </a>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      {#each enrolledCourses as course}
        <div class="bg-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-600">
          <div class="relative h-32">
            <img 
              src={course.thumbnail || '/images/thumbnails/default-course.jpg'} 
              alt={course.title}
              class="w-full h-full object-cover"
              on:error={() => { 
                const img = event.target as HTMLImageElement;
                img.src = '/images/thumbnails/default-course.jpg';
              }}
            />
            <div class="absolute top-2 right-2 bg-gray-900 text-white text-xs px-2 py-1 rounded-full">
              {course.difficulty}
            </div>
          </div>
          
          <div class="p-4">
            <h3 class="text-lg font-semibold text-white mb-1">{course.title}</h3>
            <p class="text-gray-400 text-sm mb-3">{course.description}</p>
            
            <div class="flex justify-between items-center mt-4">
              <div class="flex items-center text-sm text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {course.duration} hours
              </div>
              
              <a href={`/courses/${course.id}`} class="text-blue-400 hover:text-blue-300 text-sm">
                Continue
              </a>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
