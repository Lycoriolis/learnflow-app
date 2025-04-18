<script lang="ts">
  export let data: { courses: import('$lib/services/contentService').ContentMetadata[] };
  import { fade } from 'svelte/transition';
  let courses = data.courses;
  async function editCourse(slug: string) {
    // open course editor URL
    window.location.href = `/admin/courses/${slug}/edit`;
  }
  async function deleteCourse(slug: string) {
    if (!confirm('Delete course?')) return;
    // TODO: call API to delete course file
    courses = courses.filter(c => c.slug !== slug);
  }
</script>

<svelte:head><title>Manage Courses | Admin</title></svelte:head>
<div class="container mx-auto p-4" in:fade>
  <h1 class="text-2xl font-bold mb-4">Course Management</h1>
  <table class="min-w-full bg-white dark:bg-gray-800">
    <thead><tr>
      <th class="px-4 py-2">Title</th>
      <th class="px-4 py-2">Slug</th>
      <th class="px-4 py-2">Type</th>
      <th class="px-4 py-2">Difficulty</th>
      <th class="px-4 py-2">Actions</th>
    </tr></thead>
    <tbody>
      {#each courses as c}
      <tr class="hover:bg-gray-100 dark:hover:bg-gray-700">
        <td class="border px-4 py-2">{c.title}</td>
        <td class="border px-4 py-2">{c.slug}</td>
        <td class="border px-4 py-2">{c.type}</td>
        <td class="border px-4 py-2">{c.difficulty || '-'}</td>
        <td class="border px-4 py-2 space-x-2">
          <button class="text-blue-600 hover:underline" on:click={() => editCourse(c.slug)}>Edit</button>
          <button class="text-red-600 hover:underline" on:click={() => deleteCourse(c.slug)}>Delete</button>
        </td>
      </tr>
      {/each}
    </tbody>
  </table>
</div>