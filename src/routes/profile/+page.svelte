<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { userProfile, userProfileLoading, userProfileError } from '$lib/stores/userProfileStore';
  import { user } from '$lib/stores/authStore';
  import UserInfo from './UserInfo.svelte';
  import EnrolledCourses from './EnrolledCourses.svelte';
  import LearningProgress from './LearningProgress.svelte';
  import ActivityLog from './ActivityLog.svelte';
  import UserSettings from './UserSettings.svelte';
  import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';

  // Get tab from page data, default to 'overview'
  $: activeTab = $page.data.tab || 'overview';
  
  // Placeholder for user progress data
  let progress = {
    coursesCompleted: 3,
    coursesInProgress: 2,
    exercisesCompleted: 28,
    totalTimeSpent: 42, // hours
    learningStreak: 7, // days
    lastActive: '2 hours ago'
  };

  function setActiveTab(tab: string) {
    // Update URL with the tab parameter
    goto(`/profile?tab=${tab}`, { replaceState: true });
  }

  // Reload profile data when component mounts
  onMount(() => {
    // Profile data should already be loaded by the auth system
    // but we could add extra data loading logic here if needed
  });
</script>

<svelte:head>
  <title>My Profile | LearnFlow</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  {#if $userProfileLoading}
    <div class="flex justify-center items-center h-64">
      <LoadingSpinner />
    </div>
  {:else if $userProfileError}
    <div class="bg-red-500 text-white p-4 rounded-lg mb-6">
      <p>Error loading profile: {$userProfileError}</p>
    </div>
  {:else if $userProfile}
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left sidebar with user info -->
      <div class="lg:col-span-1">
        <UserInfo profile={$userProfile} {progress} />
      </div>
      
      <!-- Main content area -->
      <div class="lg:col-span-2">
        <!-- Tab navigation -->
        <div class="flex border-b border-gray-600 mb-6">
          <button
            class="px-4 py-2 font-medium {activeTab === 'overview' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-100'}"
            on:click={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            class="px-4 py-2 font-medium {activeTab === 'courses' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-100'}"
            on:click={() => setActiveTab('courses')}
          >
            My Courses
          </button>
          <button
            class="px-4 py-2 font-medium {activeTab === 'activity' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-100'}"
            on:click={() => setActiveTab('activity')}
          >
            Activity
          </button>
          <button
            class="px-4 py-2 font-medium {activeTab === 'settings' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-100'}"
            on:click={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </div>
        
        <!-- Tab content -->
        <div class="bg-gray-800 rounded-lg p-6">
          {#if activeTab === 'overview'}
            <div class="space-y-8">
              <LearningProgress {progress} />
              <EnrolledCourses limit={3} />
              <ActivityLog limit={5} />
            </div>
          {:else if activeTab === 'courses'}
            <EnrolledCourses />
          {:else if activeTab === 'activity'}
            <ActivityLog />
          {:else if activeTab === 'settings'}
            <UserSettings profile={$userProfile} />
          {/if}
        </div>
      </div>
    </div>
  {:else}
    <div class="bg-yellow-500 text-white p-4 rounded-lg">
      <p>Please sign in to view your profile.</p>
    </div>
  {/if}
</div>
