<script lang="ts">
	import type { PageData } from './$types';
	import CourseCard from '$lib/components/CourseCard.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	export let data: PageData;

	// Search and filter state
	let searchQuery = '';
	let selectedCategory = 'all';
	let selectedDifficulty = 'all';
	let sortBy = 'popularity';

	// Filtered and sorted courses
	$: filteredCourses = filterAndSortCourses(data.courses || [], searchQuery, selectedCategory, selectedDifficulty, sortBy);

	function filterAndSortCourses(courses: any[], query: string, category: string, difficulty: string, sort: string) {
		let filtered = courses;

		// Apply search filter
		if (query.trim()) {
			const q = query.toLowerCase();
			filtered = filtered.filter(course => 
				course.title?.toLowerCase().includes(q) ||
				course.description?.toLowerCase().includes(q) ||
				course.tags?.some((tag: string) => tag.toLowerCase().includes(q))
			);
		}

		// Apply category filter
		if (category !== 'all') {
			filtered = filtered.filter(course => course.category === category);
		}

		// Apply difficulty filter
		if (difficulty !== 'all') {
			filtered = filtered.filter(course => course.difficulty === difficulty);
		}

		// Apply sorting
		switch (sort) {
			case 'title':
				filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
				break;
			case 'difficulty':
				const difficultyOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
				filtered.sort((a, b) => (difficultyOrder[a.difficulty] || 0) - (difficultyOrder[b.difficulty] || 0));
				break;
			case 'newest':
				filtered.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
				break;
			default: // popularity
				filtered.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
		}

		return filtered;
	}

	function navigateToAdvancedBrowse() {
		goto('/courses/browse');
	}

	function navigateToSearch() {
		goto('/courses/search');
	}
</script>

<svelte:head>
	<title>Courses | LearnFlow</title>
	<meta name="description" content="Discover and explore our comprehensive range of courses designed for all skill levels." />
</svelte:head>

<div class="courses-discovery-hub min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-50 p-6 sm:p-8 md:p-10">
	<!-- Header Section -->
	<header class="mb-12 text-center">
		<h1 class="text-5xl sm:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-500 mb-4">
			Discover Courses
		</h1>
		<p class="text-xl sm:text-2xl text-slate-400 max-w-3xl mx-auto mb-8">
			Explore our comprehensive library of courses designed to accelerate your learning journey
		</p>
		
		<!-- Quick Actions -->
		<div class="flex flex-wrap justify-center gap-4 mb-8">
			<button 
				on:click={navigateToAdvancedBrowse}
				class="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
			>
				📁 Browse All Courses
			</button>
			<button 
				on:click={navigateToSearch}
				class="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
			>
				🔍 Advanced Search
			</button>
		</div>
	</header>

	<!-- Search and Filter Section -->
	<section class="mb-12 max-w-6xl mx-auto">
		<div class="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
			<!-- Search Bar -->
			<div class="mb-6">
				<div class="relative">
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Search courses, topics, or skills..."
						class="w-full px-6 py-4 pl-12 bg-slate-700/50 border border-slate-600 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
					>
					<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
						<svg class="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
						</svg>
					</div>
				</div>
			</div>

			<!-- Filter Controls -->
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
				<!-- Category Filter -->
				<div>
					<label class="block text-sm font-medium text-slate-300 mb-2">Category</label>
					<select 
						bind:value={selectedCategory}
						class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
					>
						<option value="all">All Categories</option>
						{#each data.categories || [] as category}
							<option value={category.id}>{category.title}</option>
						{/each}
					</select>
				</div>

				<!-- Difficulty Filter -->
				<div>
					<label class="block text-sm font-medium text-slate-300 mb-2">Difficulty</label>
					<select 
						bind:value={selectedDifficulty}
						class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
					>
						<option value="all">All Levels</option>
						<option value="beginner">Beginner</option>
						<option value="intermediate">Intermediate</option>
						<option value="advanced">Advanced</option>
					</select>
				</div>

				<!-- Sort Options -->
				<div>
					<label class="block text-sm font-medium text-slate-300 mb-2">Sort By</label>
					<select 
						bind:value={sortBy}
						class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
					>
						<option value="popularity">Most Popular</option>
						<option value="title">Alphabetical</option>
						<option value="difficulty">Difficulty</option>
						<option value="newest">Newest First</option>
					</select>
				</div>
			</div>
		</div>
	</section>

	<!-- Results Summary -->
	<section class="mb-8 max-w-6xl mx-auto">
		<div class="flex justify-between items-center">
			<p class="text-slate-400">
				Showing {filteredCourses.length} of {data.courses?.length || 0} courses
				{#if searchQuery}<span class="text-cyan-400">for "{searchQuery}"</span>{/if}
			</p>
			{#if searchQuery || selectedCategory !== 'all' || selectedDifficulty !== 'all'}
				<button 
					on:click={() => { searchQuery = ''; selectedCategory = 'all'; selectedDifficulty = 'all'; }}
					class="text-cyan-400 hover:text-cyan-300 text-sm underline"
				>
					Clear filters
				</button>
			{/if}
		</div>
	</section>

	<!-- Courses Grid -->
	<section class="max-w-7xl mx-auto">
		{#if data.error}
			<div class="text-center py-12">
				<div class="bg-red-900/30 border border-red-700 rounded-lg p-6 max-w-md mx-auto">
					<p class="text-red-400">{data.error}</p>
				</div>
			</div>
		{:else if filteredCourses.length === 0}
			<div class="text-center py-20">
				<div class="bg-slate-800/70 rounded-xl border border-slate-700 shadow-xl p-8 max-w-md mx-auto">
					<svg class="mx-auto h-16 w-16 text-slate-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<h3 class="text-xl font-medium text-slate-300 mb-2">No courses found</h3>
					<p class="text-slate-400">
						{#if searchQuery || selectedCategory !== 'all' || selectedDifficulty !== 'all'}
							Try adjusting your search criteria or filters.
						{:else}
							No courses are available at the moment.
						{/if}
					</p>
				</div>
			</div>
		{:else}
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
				{#each filteredCourses as course (course.id)}
					<CourseCard {course} />
				{/each}
			</div>
		{/if}
	</section>

	<!-- Categories Section -->
	{#if data.categories && data.categories.length > 0}
		<section class="mt-16 max-w-6xl mx-auto">
			<h2 class="text-3xl font-semibold text-slate-200 mb-8 text-center">Browse by Category</h2>
			<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{#each data.categories as category (category.id)}
					<a
						href="/courses/category/{category.id}"
						class="group p-6 bg-slate-800/40 border border-slate-700 rounded-xl hover:bg-slate-700/40 hover:border-slate-600 transition-all duration-200"
					>
						<div class="text-center">
							<h3 class="font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">
								{category.title}
							</h3>
							<p class="text-sm text-slate-400 mt-1">
								{category.courseCount || 0} courses
							</p>
						</div>
					</a>
				{/each}
			</div>
		</section>
	{/if}
</div>

<style>
	.courses-discovery-hub {
		min-height: 100vh;
	}
</style>