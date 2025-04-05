<script lang="ts">
  import { courseModalOpen, currentCourse } from '$lib/stores/appStore';
  
  export let course = {
    id: '',
    title: '',
    description: '',
    progress: 0,
    icon: 'fa-book',
    gradient: {
      from: 'blue-500',
      to: 'blue-400'
    }
  };
  
  function openCourse() {
    currentCourse.set(course);
    courseModalOpen.set(true);
  }

  function handleClick() {
    openCourse();
  }

  // Compute a progress color string based on the gradient "from"
  const progressColor = (course.gradient.from.split('-')[0] === 'blue'
    ? '#3B82F6'
    : course.gradient.from.split('-')[0] === 'green'
    ? '#10B981'
    : course.gradient.from.split('-')[0] === 'purple'
    ? '#8B5CF6'
    : course.gradient.from.split('-')[0] === 'red'
    ? '#EF4444'
    : '#6366F1');
</script>

<div 
  class="bg-gray-700 border border-orange-500 p-5 rounded-2xl shadow-sm squircle-sm card-hover h-full cursor-pointer"
  on:click={handleClick}
  on:keydown={e => e.key === 'Enter' && handleClick()}
  role="button"
  tabindex="0"
>
  <div 
    class="h-32 rounded-xl mb-4 flex items-center justify-center"
    style="background: linear-gradient(to right, #{course.gradient.from}, #{course.gradient.to});"
  >
    <i class="fas {course.icon} text-white text-4xl"></i>
  </div>
  <h3 class="font-semibold text-gray-100 mb-2">{course.title}</h3>
  <p class="text-gray-300 text-sm mb-4 line-clamp-2">{course.description}</p>
  <div class="flex items-center justify-between">
    <div class="w-full bg-gray-600 rounded-full h-2">
      <div 
        class="h-2 rounded-full" 
        style="width: {course.progress}%; background-color: {progressColor};"
      ></div>
    </div>
    <span class="text-xs text-gray-300 ml-2">{course.progress}%</span>
  </div>
</div>