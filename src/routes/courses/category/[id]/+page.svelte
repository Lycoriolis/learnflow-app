<script lang="ts">
	import type { PageData } from './$types';
	import CourseCard from '$lib/components/courses/CourseCard.svelte';
	import { page } from '$app/stores';

	export let data: PageData;

	// Local filtering and sorting
	let searchQuery = '';
	let sortBy = 'title';
	let showDescription = true;

	$: filteredCourses = filterCourses(data.courses || [], searchQuery, sortBy);

	function filterCourses(courses: any[], query: string, sort: string) {
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

		// Apply sorting
		switch (sort) {
			case 'title':
				filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
				break;
			case 'difficulty':
				const difficultyOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
				filtered.sort((a, b) => {
					const orderA = difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 0;
					const orderB = difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 0;
					return orderA - orderB;
				});
				break;
			case 'newest':
				filtered.sort((a, b) => new Date(b.lastModified || 0).getTime() - new Date(a.lastModified || 0).getTime());
				break;
			case 'order':
				filtered.sort((a, b) => (a.order || 999) - (b.order || 999));
				break;
		}

		return filtered;
	}
</script>

<svelte:head>
	<title>{data.category?.title || 'Category'} | LearnFlow</title>
	<meta name="description" content="{data.category?.description || 'Browse courses in this category'}" />
</svelte:head>

<div class="category-page min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-50 p-6 sm:p-8">
	{#if data.error}
		<div class="max-w-4xl mx-auto text-center py-20">
			<div class="bg-red-900/30 border border-red-700 rounded-lg p-8">
				<h1 class="text-2xl font-bold text-red-400 mb-4">Category Not Found</h1>
				<p class="text-red-300 mb-6">{data.error}</p>
				<a 
					href="/courses" 
					class="px-6 py-3 bg-red-600 hover:bg-red-500 rounded-lg font-medium transition-colors inline-block"
				>
					Back to Courses
				</a>
			</div>
		</div>
	{:else if data.category}
		<!-- Breadcrumb -->
		<nav class="max-w-7xl mx-auto mb-8">
			<ol class="flex items-center space-x-2 text-sm text-slate-400">
				<li><a href="/courses" class="hover:text-slate-200 transition-colors">Courses</a></li>
				<li><span class="mx-2">›</span></li>
				<li><span class="text-slate-200">{data.category.title}</span></li>
			</ol>
		</nav>

		<!-- Category Header -->
		<header class="max-w-7xl mx-auto mb-12 text-center">
			<div class="mb-6">
				{#if data.category.icon}
					<span class="text-6xl mb-4 block">{data.category.icon}</span>
				{/if}
				<h1 class="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-4">
					{data.category.title}
				</h1>
				{#if data.category.description}
					<p class="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
						{data.category.description}
					</p>
				{/if}
			</div>

			<!-- Category Stats -->
			<div class="flex justify-center gap-8 text-center">
				<div class="bg-slate-800/40 border border-slate-700 rounded-lg px-6 py-4">
					<div class="text-2xl font-bold text-cyan-400">{data.courses?.length || 0}</div>
					<div class="text-sm text-slate-400">Courses</div>
				</div>
				{#if data.totalLessons}
					<div class="bg-slate-800/40 border border-slate-700 rounded-lg px-6 py-4">
						<div class="text-2xl font-bold text-cyan-400">{data.totalLessons}</div>
						<div class="text-sm text-slate-400">Lessons</div>
					</div>
				{/if}
				{#if data.averageDifficulty}
					<div class="bg-slate-800/40 border border-slate-700 rounded-lg px-6 py-4">
						<div class="text-2xl font-bold text-cyan-400 capitalize">{data.averageDifficulty}</div>
						<div class="text-sm text-slate-400">Avg. Difficulty</div>
					</div>
				{/if}
			</div>
		</header>

		<!-- Controls -->
		<div class="max-w-7xl mx-auto mb-8">
			<div class="flex flex-col md:flex-row gap-4 justify-between items-center">
				<!-- Search -->
				<div class="flex-1 max-w-md">
					<div class="relative">
						<input 
							bind:value={searchQuery}
							placeholder="Search courses in this category..."
							class="w-full px-4 py-3 pl-12 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
						/>
						<svg class="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
						</svg>
					</div>
				</div>

				<!-- Controls -->
				<div class="flex gap-4 items-center">
					<select 
						bind:value={sortBy}
						class="px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
					>
						<option value="order">Default Order</option>
						<option value="title">Alphabetical</option>
						<option value="difficulty">By Difficulty</option>
						<option value="newest">Newest First</option>
					</select>

					<button 
						on:click={() => showDescription = !showDescription}
						class="px-4 py-3 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg text-sm transition-colors"
					>
						{showDescription ? 'Hide' : 'Show'} Descriptions
					</button>
				</div>
			</div>

			<!-- Results Summary -->
			<div class="mt-4 flex justify-between items-center">
				<p class="text-slate-400">
					Showing {filteredCourses.length} of {data.courses?.length || 0} courses
					{#if searchQuery}<span class="text-cyan-400">for "{searchQuery}"</span>{/if}
				</p>
				
				{#if searchQuery}
					<button 
						on:click={() => searchQuery = ''}
						class="text-cyan-400 hover:text-cyan-300 text-sm underline"
					>
						Clear search
					</button>
				{/if}
			</div>
		</div>

		<!-- Courses Grid -->
		<main class="max-w-7xl mx-auto">
			{#if filteredCourses.length === 0}
				<div class="text-center py-20">
					<div class="bg-slate-800/70 rounded-xl border border-slate-700 shadow-xl p-8 max-w-md mx-auto">
						<svg class="mx-auto h-16 w-16 text-slate-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						<h3 class="text-xl font-medium text-slate-300 mb-2">No courses found</h3>
						<p class="text-slate-400">
							{#if searchQuery}
								Try adjusting your search terms.
							{:else}
								No courses are available in this category yet.
							{/if}
						</p>
					</div>
				</div>
			{:else}
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{#each filteredCourses as course (course.id)}
						<CourseCard {course} />
					{/each}
				</div>
			{/if}
		</main>

		<!-- Related Categories -->
		{#if data.relatedCategories && data.relatedCategories.length > 0}
			<section class="max-w-7xl mx-auto mt-16">
				<h2 class="text-2xl font-semibold text-slate-200 mb-6">Related Categories</h2>
				<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
					{#each data.relatedCategories as category (category.id)}
						<a
							href="/courses/category/{category.id}"
							class="group p-4 bg-slate-800/40 border border-slate-700 rounded-xl hover:bg-slate-700/40 hover:border-slate-600 transition-all duration-200"
						>
							<div class="text-center">
								{#if category.icon}
									<span class="text-2xl mb-2 block">{category.icon}</span>
								{/if}
								<h3 class="font-medium text-slate-200 group-hover:text-cyan-400 transition-colors">
									{category.title}
								</h3>
								<p class="text-xs text-slate-400 mt-1">
									{category.courseCount || 0} courses
								</p>
							</div>
						</a>
					{/each}
				</div>
			</section>
		{/if}
	{/if}
</div>
