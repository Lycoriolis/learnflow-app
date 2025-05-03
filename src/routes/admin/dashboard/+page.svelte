<script lang="ts">
	import { onMount } from 'svelte';
	import { adminStore } from '$lib/stores/adminStore';
	
	// Get the data that was loaded server-side
	export let data;
	
	// Stats for the dashboard
	let stats = data.stats;
	
	// Loading state
	let loading = false;
	
	onMount(() => {
		// Initialize admin store
		adminStore.init();
	});
</script>

<div>
	{#if loading}
		<div class="flex justify-center items-center h-64">
			<div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
		</div>
	{:else}
		<!-- Stats cards -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
			<div class="bg-white rounded-lg shadow p-6">
				<div class="flex items-center">
					<div class="p-3 rounded-full bg-indigo-100 text-indigo-500 mr-4">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
						</svg>
					</div>
					<div>
						<p class="text-sm text-gray-500 font-medium">Total Users</p>
						<p class="text-2xl font-semibold">{stats.totalUsers}</p>
					</div>
				</div>
			</div>
			
			<div class="bg-white rounded-lg shadow p-6">
				<div class="flex items-center">
					<div class="p-3 rounded-full bg-green-100 text-green-500 mr-4">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
						</svg>
					</div>
					<div>
						<p class="text-sm text-gray-500 font-medium">Total Courses</p>
						<p class="text-2xl font-semibold">{stats.totalCourses}</p>
					</div>
				</div>
			</div>
			
			<div class="bg-white rounded-lg shadow p-6">
				<div class="flex items-center">
					<div class="p-3 rounded-full bg-yellow-100 text-yellow-500 mr-4">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
						</svg>
					</div>
					<div>
						<p class="text-sm text-gray-500 font-medium">Total Lessons</p>
						<p class="text-2xl font-semibold">{stats.totalLessons}</p>
					</div>
				</div>
			</div>
			
			<div class="bg-white rounded-lg shadow p-6">
				<div class="flex items-center">
					<div class="p-3 rounded-full bg-red-100 text-red-500 mr-4">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
					<div>
						<p class="text-sm text-gray-500 font-medium">Total Exercises</p>
						<p class="text-2xl font-semibold">{stats.totalExercises}</p>
					</div>
				</div>
			</div>
		</div>
		
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<!-- Recent activity section -->
			<div class="bg-white rounded-lg shadow p-6">
				<h3 class="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
				<div class="space-y-4">
					<div class="flex items-start">
						<div class="flex-shrink-0 rounded-full w-10 h-10 bg-indigo-500 flex items-center justify-center text-white">
							U
						</div>
						<div class="ml-4">
							<p class="text-sm font-medium">User registered</p>
							<p class="text-xs text-gray-500">2 hours ago</p>
						</div>
					</div>
					
					<div class="flex items-start">
						<div class="flex-shrink-0 rounded-full w-10 h-10 bg-green-500 flex items-center justify-center text-white">
							C
						</div>
						<div class="ml-4">
							<p class="text-sm font-medium">New course created</p>
							<p class="text-xs text-gray-500">5 hours ago</p>
						</div>
					</div>
					
					<div class="flex items-start">
						<div class="flex-shrink-0 rounded-full w-10 h-10 bg-yellow-500 flex items-center justify-center text-white">
							E
						</div>
						<div class="ml-4">
							<p class="text-sm font-medium">Exercise completed</p>
							<p class="text-xs text-gray-500">1 day ago</p>
						</div>
					</div>
				</div>
				
				<button class="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium">
					View all activity
				</button>
			</div>
			
			<!-- Quick actions section -->
			<div class="bg-white rounded-lg shadow p-6">
				<h3 class="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
				<div class="grid grid-cols-2 gap-4">
					<a href="/admin/courses/new" class="bg-indigo-50 hover:bg-indigo-100 p-4 rounded-lg flex flex-col items-center justify-center transition-colors">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
						</svg>
						<span class="text-sm font-medium text-indigo-700">Add Course</span>
					</a>
					
					<a href="/admin/users/new" class="bg-green-50 hover:bg-green-100 p-4 rounded-lg flex flex-col items-center justify-center transition-colors">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
						</svg>
						<span class="text-sm font-medium text-green-700">Add User</span>
					</a>
					
					<a href="/admin/analytics" class="bg-yellow-50 hover:bg-yellow-100 p-4 rounded-lg flex flex-col items-center justify-center transition-colors">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-yellow-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
						</svg>
						<span class="text-sm font-medium text-yellow-700">View Analytics</span>
					</a>
					
					<a href="/admin/settings" class="bg-red-50 hover:bg-red-100 p-4 rounded-lg flex flex-col items-center justify-center transition-colors">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
						</svg>
						<span class="text-sm font-medium text-red-700">Settings</span>
					</a>
				</div>
			</div>
		</div>
	{/if}
</div>