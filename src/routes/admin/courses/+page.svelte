<!-- src/routes/admin/courses/+page.svelte -->
<script lang="ts">
  // In real app, load courses via API in +page.ts
  const mockCourses = [
    { id: 'math-algebra-basics', title: 'Algebra Basics', category: 'Mathematics' },
    { id: 'cs-intro-python', title: 'Introduction to Python', category: 'Computer Science' }
  ];
</script>

<svelte:head>
  <title>Admin | Manage Courses</title>
</svelte:head>

<div class="mb-6 flex justify-between items-center">
  <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Manage Courses</h1>
  <a href="/admin/courses/new" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition duration-150">
    + Add New Course
  </a>
</div>

<div class="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
  <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
    <thead class="bg-gray-50 dark:bg-gray-700">
      <tr>
        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
        <th scope="col" class="relative px-6 py-3">
          <span class="sr-only">Edit</span>
        </th>
      </tr>
    </thead>
    <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
      {#each mockCourses as course}
        <tr>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{course.title}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{course.category}</td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <a href="/admin/courses/{course.id}" class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200">Edit</a>
            <!-- Add delete button with confirmation later -->
          </td>
        </tr>
      {/each}
      {#if mockCourses.length === 0}
        <tr>
            <td colspan="3" class="px-6 py-4 text-center text-sm text-gray-500">No courses found.</td>
        </tr>
      {/if}
    </tbody>
  </table>
</div> 