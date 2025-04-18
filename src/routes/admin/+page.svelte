<script lang="ts">
  import { onMount } from 'svelte';
  import { user } from '$lib/stores/authStore.js';
  import { fade } from 'svelte/transition';
  let currentUser;
  $: currentUser = $user;
</script>

<svelte:head>
  <title>Admin Dashboard | LearnFlow</title>
</svelte:head>

<div class="container mx-auto px-4 py-8" in:fade>
  <h1 class="text-3xl font-bold mb-6">Admin Dashboard</h1>
  <p class="mb-4 text-gray-600">Welcome, {currentUser?.displayName || currentUser?.email}!</p>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <!-- Users management -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col justify-between">
      <div>
        <h2 class="text-xl font-semibold mb-2">User Management</h2>
        <p class="text-gray-500 mb-4">Create, edit, and manage user accounts and roles.</p>
      </div>
      <a href="/admin/users" class="mt-auto inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded">Manage Users</a>
    </div>
    <!-- Courses management -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col justify-between">
      <div>
        <h2 class="text-xl font-semibold mb-2">Course Management</h2>
        <p class="text-gray-500 mb-4">Add, update, or remove courses and content.</p>
      </div>
      <a href="/admin/courses" class="mt-auto inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded">Manage Courses</a>
    </div>
    <!-- Forums management -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col justify-between">
      <div>
        <h2 class="text-xl font-semibold mb-2">Forum Management</h2>
        <p class="text-gray-500 mb-4">Moderate topics, posts, and categories.</p>
      </div>
      <a href="/admin/forums" class="mt-auto inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded">Manage Forums</a>
    </div>
    <!-- Events management -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col justify-between">
      <div>
        <h2 class="text-xl font-semibold mb-2">Event Management</h2>
        <p class="text-gray-500 mb-4">Create and manage events and schedules.</p>
      </div>
      <a href="/admin/events" class="mt-auto inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded">Manage Events</a>
    </div>
    <!-- Groups management -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col justify-between">
      <div>
        <h2 class="text-xl font-semibold mb-2">Group Management</h2>
        <p class="text-gray-500 mb-4">Oversee user groups and permissions.</p>
      </div>
      <a href="/admin/groups" class="mt-auto inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded">Manage Groups</a>
    </div>
  </div>
</div>