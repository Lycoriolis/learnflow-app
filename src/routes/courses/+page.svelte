<script>
  import { onMount } from 'svelte';
  
  // Placeholder data for courses
  const coursesList = [
    {
      id: 'js-advanced',
      title: 'Advanced JavaScript',
      description: 'Master modern JavaScript concepts including closures, prototypes, promises, and async/await. Build real-world applications with modern JavaScript patterns.',
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
      description: 'Comprehensive introduction to vectors, matrices, determinants, and transformations. Applications in computer graphics and machine learning.',
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
      description: 'Build your vocabulary and grammar foundations for everyday Spanish conversations. Includes audio pronunciations and interactive exercises.',
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
      description: 'Introduction to quantum mechanics principles, wave functions, and the uncertainty principle. Explore the fascinating world of quantum theory.',
      progress: 15,
      icon: 'fa-atom',
      gradient: {
        from: 'red-500',
        to: 'red-400'
      }
    }
  ];
</script>

<div class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
  <h1 class="text-2xl font-bold text-gray-900 mb-6">My Courses</h1>
  
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each coursesList as course}
      <div class="bg-white p-5 rounded-2xl shadow-sm squircle-sm card-hover h-full cursor-pointer">
        <div 
          class="h-32 rounded-xl mb-4 flex items-center justify-center"
          style="background-image: linear-gradient(to right, var(--tw-gradient-stops)); --tw-gradient-from: #{course.gradient.from}; --tw-gradient-to: #{course.gradient.to};"
        >
          <i class="fas {course.icon} text-white text-4xl"></i>
        </div>
        <h3 class="font-semibold text-gray-800 mb-2">{course.title}</h3>
        <p class="text-gray-500 text-sm mb-4 line-clamp-2">{course.description}</p>
        <div class="flex items-center justify-between">
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="bg-{course.gradient.from.split('-')[0]}-500 h-2 rounded-full" 
              style="width: {course.progress}%"
            ></div>
          </div>
          <span class="text-xs text-gray-500 ml-2">{course.progress}%</span>
        </div>
      </div>
    {/each}
  </div>
</div>
