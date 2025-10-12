<script lang="ts">
  export let limit: number | null = null;
  export let courses: Array<{
    id: string;
    title: string;
    progress: number;
    totalLessons: number;
    completedLessons: number;
    timeSpentMinutes: number;
    lastAccessedLabel: string;
    lastAccessedAt: number;
    href: string;
  }> = [];

  $: displayedCourses = limit ? courses.slice(0, limit) : courses;
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

  {#if displayedCourses.length === 0}
    <div class="bg-gray-700 p-6 rounded-lg text-center">
      <p class="text-gray-300 mb-4">You haven't tracked any courses yet.</p>
      <a href="/courses" class="inline-block bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors">
        Browse Courses
      </a>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      {#each displayedCourses as course}
        <div class="bg-gray-700 rounded-lg border border-gray-600 p-5 shadow-md">
          <div class="flex items-start justify-between">
            <div>
              <h3 class="text-lg font-semibold text-white mb-1">{course.title}</h3>
              <p class="text-xs text-gray-400">Last accessed {course.lastAccessedLabel}</p>
            </div>
            <span class="rounded-full bg-indigo-600/80 px-3 py-1 text-xs font-semibold text-white">
              {course.progress}%
            </span>
          </div>
          <div class="mt-4">
            <div class="mb-2 flex items-center justify-between text-xs text-gray-400">
              <span>{course.completedLessons}/{course.totalLessons} lessons</span>
              <span>{course.timeSpentMinutes}m logged</span>
            </div>
            <div class="w-full bg-gray-600 rounded-full h-2.5">
              <div
                class="bg-gradient-to-r from-amber-400 to-orange-500 h-2.5 rounded-full"
                style={`width:${Math.min(course.progress, 100)}%`}
              ></div>
            </div>
          </div>
          <div class="mt-4 flex items-center justify-between text-sm">
            <a href={course.href} class="text-blue-400 hover:text-blue-300">Continue</a>
            <span class="text-gray-400">Course ID: {course.id}</span>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
