<script lang="ts">
export let course: {
    id: string;
    title?: string;
    description?: string; // Changed to optional
    progress?: number;    // Changed to optional
    icon?: string;        // Changed to optional
    gradient?: { from: string; to: string }; // Changed to optional
  } = {
    id: '',
    description: '', // Default value for the prop object
    progress: 0,     // Default value for the prop object
    icon: 'fa-book', // Default value for the prop object
    gradient: { from: 'blue-500', to: 'blue-400' } // Default value for the prop object
  };
// Log start_course when user clicks the card
import { logEvent } from '$lib/services/activityService.js';
import { goto } from '$app/navigation'; // Corrected import path

  // Ensure gradient has default values if not provided
  $: courseGradient = {
    from: course?.gradient?.from || 'blue-500',
    to: course?.gradient?.to || 'blue-400'
  };
</script>

<a
  href={`/courses/${course.id}`}
  on:click|preventDefault={async () => {
    try {
      await logEvent('start_course', course.id);
    } catch (err) {
      console.error('Error logging start_course', err);
    }
    goto(`/courses/${course.id}`);
  }}
  class="bg-gray-700 border border-orange-500 p-5 rounded-2xl shadow-sm squircle-sm card-hover h-full block focus:outline-none focus:ring-2 focus:ring-indigo-500"
>
  <div class={`h-32 rounded-xl mb-4 flex items-center justify-center bg-gradient-to-r from-${courseGradient.from} to-${courseGradient.to}`}>  
    <i class={`fas ${course.icon} text-white text-4xl`}></i>
  </div>

  <h3 class="font-semibold text-gray-100 mb-2">{course.title || 'Untitled Course'}</h3>
  <p class="text-gray-300 text-sm mb-4 line-clamp-2">{course.description || 'No description available.'}</p>
  <div class="flex items-center justify-between">
    <div class="w-full bg-gray-600 rounded-full h-2">
      <div class="h-2 rounded-full" style={`width: ${course.progress}%; background-color: #3B82F6;`}></div>
    </div>
    <span class="text-xs text-gray-300 ml-2">{course.progress}%</span>
  </div>
</a>