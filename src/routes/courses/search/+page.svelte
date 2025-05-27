<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import CourseCard from '$lib/components/CourseCard.svelte';

	export let data: PageData;

	// Search state
	let query = '';
	let selectedCategories: string[] = [];
	let selectedDifficulties: string[] = [];
	let selectedTags: string[] = [];
	let estimatedTimeMin = '';
	let estimatedTimeMax = '';
	let contentTypes: string[] = [];
	let sortBy = 'relevance';
	let resultsPerPage = 12;
	let currentPage = 1;

	// UI state
	let showAdvancedFilters = false;
	let isSearching = false;
	let searchResults: any[] = [];
	let totalResults = 0;
	let searchTime = 0;

	// Get search query from URL params
	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);
		query = urlParams.get('q') || '';
		if (query) {
			performSearch();
		}
	});

	$: availableTags = [...new Set(data.allCourses?.flatMap(course => course.tags || []) || [])].sort();
	$: availableDifficulties = [...new Set(data.allCourses?.map(course => course.difficulty).filter(Boolean) || [])].sort();
	$: availableContentTypes = [...new Set(data.allCourses?.map(course => course.contentType || 'course') || [])].sort();

	async function performSearch() {
		if (!query.trim() && selectedCategories.length === 0 && selectedTags.length === 0) {
			searchResults = [];
			totalResults = 0;
			return;
		}

		isSearching = true;
		const startTime = performance.now();

		try {
			// Build search criteria
			const searchCriteria = {
				query: query.trim(),
				categories: selectedCategories,
				difficulties: selectedDifficulties,
				tags: selectedTags,
				contentTypes: contentTypes.length > 0 ? contentTypes : undefined,
				estimatedTimeRange: estimatedTimeMin || estimatedTimeMax ? {
					min: estimatedTimeMin,
					max: estimatedTimeMax
				} : undefined
			};

			// Perform search (client-side filtering for now, can be enhanced with server-side search)
			let results = data.allCourses || [];

			// Text search
			if (query.trim()) {
				const q = query.toLowerCase();
				results = results.filter(course => 
					course.title?.toLowerCase().includes(q) ||
					course.description?.toLowerCase().includes(q) ||
					course.tags?.some((tag: string) => tag.toLowerCase().includes(q)) ||
					course.content?.toLowerCase().includes(q)
				);
			}

			// Category filter
			if (selectedCategories.length > 0) {
				results = results.filter(course => 
					selectedCategories.includes(course.category || '') ||
					selectedCategories.some(cat => course.tags?.includes(cat))
				);
			}

			// Difficulty filter
			if (selectedDifficulties.length > 0) {
				results = results.filter(course => 
					course.difficulty && selectedDifficulties.includes(course.difficulty)
				);
			}

			// Tags filter
			if (selectedTags.length > 0) {
				results = results.filter(course => 
					course.tags && selectedTags.some(tag => course.tags.includes(tag))
				);
			}

			// Content type filter
			if (contentTypes.length > 0) {
				results = results.filter(course => 
					contentTypes.includes(course.contentType || 'course')
				);
			}

			// Sort results
			results = sortResults(results, sortBy, query);

			searchResults = results;
			totalResults = results.length;
			searchTime = performance.now() - startTime;

			// Update URL
			const url = new URL(window.location.href);
			if (query.trim()) {
				url.searchParams.set('q', query);
			} else {
				url.searchParams.delete('q');
			}
			window.history.replaceState({}, '', url.toString());

		} catch (error) {
			console.error('Search error:', error);
		} finally {
			isSearching = false;
		}
	}

	function sortResults(results: any[], sortBy: string, query: string) {
		switch (sortBy) {
			case 'relevance':
				// Simple relevance scoring based on query matches
				if (!query.trim()) return results;
				return results.sort((a, b) => {
					const scoreA = calculateRelevanceScore(a, query);
					const scoreB = calculateRelevanceScore(b, query);
					return scoreB - scoreA;
				});
			
			case 'title':
				return results.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
			
			case 'difficulty':
				const difficultyOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
				return results.sort((a, b) => {
					const orderA = difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 0;
					const orderB = difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 0;
					return orderA - orderB;
				});
			
			case 'newest':
				return results.sort((a, b) => new Date(b.lastModified || 0).getTime() - new Date(a.lastModified || 0).getTime());
			
			default:
				return results;
		}
	}

	function calculateRelevanceScore(course: any, query: string): number {
		const q = query.toLowerCase();
		let score = 0;

		// Title matches get highest score
		if (course.title?.toLowerCase().includes(q)) {
			score += 10;
			if (course.title?.toLowerCase().startsWith(q)) score += 5;
		}

		// Description matches
		if (course.description?.toLowerCase().includes(q)) score += 5;

		// Tag matches
		if (course.tags?.some((tag: string) => tag.toLowerCase().includes(q))) score += 3;

		// Content matches (if available)
		if (course.content?.toLowerCase().includes(q)) score += 1;

		return score;
	}

	function clearFilters() {
		selectedCategories = [];
		selectedDifficulties = [];
		selectedTags = [];
		contentTypes = [];
		estimatedTimeMin = '';
		estimatedTimeMax = '';
		performSearch();
	}

	function removeTag(tag: string) {
		selectedTags = selectedTags.filter(t => t !== tag);
		performSearch();
	}

	function removeCategory(category: string) {
		selectedCategories = selectedCategories.filter(c => c !== category);
		performSearch();
	}

	$: paginatedResults = searchResults.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage);
	$: totalPages = Math.ceil(totalResults / resultsPerPage);

	// Reactive search
	$: if (query || selectedCategories.length || selectedTags.length || selectedDifficulties.length) {
		performSearch();
	}
</script>

<svelte:head>
	<title>Advanced Search | LearnFlow</title>
	<meta name="description" content="Advanced search with powerful filters to find exactly the courses and content you need." />
</svelte:head>

<div class="advanced-search min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-50 p-6 sm:p-8">
	<!-- Header -->
	<header class="max-w-7xl mx-auto mb-8">
		<h1 class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 mb-4">
			Advanced Search
		</h1>
		<p class="text-slate-400 text-lg">
			Find exactly what you're looking for with powerful search and filtering tools
		</p>
	</header>

	<!-- Search Interface -->
	<div class="max-w-7xl mx-auto">
		<div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
			<!-- Filters Sidebar -->
			<div class="lg:col-span-1">
				<div class="bg-slate-800/40 border border-slate-700 rounded-xl p-6 sticky top-6">
					<div class="flex items-center justify-between mb-6">
						<h2 class="text-lg font-semibold text-slate-200">Filters</h2>
						<button 
							on:click={clearFilters}
							class="text-sm text-cyan-400 hover:text-cyan-300"
						>
							Clear All
						</button>
					</div>

					<!-- Categories -->
					<div class="mb-6">
						<h3 class="text-sm font-medium text-slate-300 mb-3">Categories</h3>
						<div class="space-y-2">
							{#each data.categories || [] as category}
								<label class="flex items-center gap-2 text-sm">
									<input 
										type="checkbox" 
										bind:group={selectedCategories} 
										value={category.id}
										class="rounded border-slate-600 bg-slate-700 text-cyan-500 focus:ring-cyan-500"
									/>
									<span class="text-slate-300">{category.title}</span>
								</label>
							{/each}
						</div>
					</div>

					<!-- Difficulty -->
					<div class="mb-6">
						<h3 class="text-sm font-medium text-slate-300 mb-3">Difficulty</h3>
						<div class="space-y-2">
							{#each availableDifficulties as difficulty}
								<label class="flex items-center gap-2 text-sm">
									<input 
										type="checkbox" 
										bind:group={selectedDifficulties} 
										value={difficulty}
										class="rounded border-slate-600 bg-slate-700 text-cyan-500 focus:ring-cyan-500"
									/>
									<span class="text-slate-300 capitalize">{difficulty}</span>
								</label>
							{/each}
						</div>
					</div>

					<!-- Tags -->
					<div class="mb-6">
						<h3 class="text-sm font-medium text-slate-300 mb-3">Tags</h3>
						<div class="max-h-40 overflow-y-auto space-y-2">
							{#each availableTags.slice(0, 20) as tag}
								<label class="flex items-center gap-2 text-sm">
									<input 
										type="checkbox" 
										bind:group={selectedTags} 
										value={tag}
										class="rounded border-slate-600 bg-slate-700 text-cyan-500 focus:ring-cyan-500"
									/>
									<span class="text-slate-300">{tag}</span>
								</label>
							{/each}
						</div>
					</div>

					<!-- Content Type -->
					<div class="mb-6">
						<h3 class="text-sm font-medium text-slate-300 mb-3">Content Type</h3>
						<div class="space-y-2">
							{#each availableContentTypes as type}
								<label class="flex items-center gap-2 text-sm">
									<input 
										type="checkbox" 
										bind:group={contentTypes} 
										value={type}
										class="rounded border-slate-600 bg-slate-700 text-cyan-500 focus:ring-cyan-500"
									/>
									<span class="text-slate-300 capitalize">{type.replace('_', ' ')}</span>
								</label>
							{/each}
						</div>
					</div>

					<!-- Advanced Options -->
					<button 
						on:click={() => showAdvancedFilters = !showAdvancedFilters}
						class="text-sm text-cyan-400 hover:text-cyan-300 mb-3"
					>
						{showAdvancedFilters ? '▼' : '▶'} Advanced Options
					</button>

					{#if showAdvancedFilters}
						<div class="space-y-4">
							<div>
								<label class="block text-sm font-medium text-slate-300 mb-2">
									Estimated Time (minutes)
								</label>
								<div class="flex gap-2">
									<input 
										bind:value={estimatedTimeMin}
										placeholder="Min"
										type="number"
										class="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
									/>
									<input 
										bind:value={estimatedTimeMax}
										placeholder="Max"
										type="number"
										class="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
									/>
								</div>
							</div>
						</div>
					{/if}
				</div>
			</div>

			<!-- Search Results -->
			<div class="lg:col-span-3">
				<!-- Search Bar -->
				<div class="mb-6">
					<div class="relative">
						<input 
							bind:value={query}
							placeholder="Search courses, content, tags..."
							class="w-full px-6 py-4 pl-14 bg-slate-800/50 border border-slate-600 rounded-xl text-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
						/>
						<svg class="absolute left-5 top-1/2 transform -translate-y-1/2 h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
						</svg>
						{#if isSearching}
							<div class="absolute right-4 top-1/2 transform -translate-y-1/2">
								<div class="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
							</div>
						{/if}
					</div>
				</div>

				<!-- Active Filters Display -->
				{#if selectedCategories.length > 0 || selectedTags.length > 0 || selectedDifficulties.length > 0}
					<div class="mb-6">
						<div class="flex flex-wrap gap-2">
							{#each selectedCategories as category}
								<span class="inline-flex items-center gap-1 px-3 py-1 bg-blue-900/30 border border-blue-700 rounded-full text-sm text-blue-400">
									Category: {data.categories?.find(c => c.id === category)?.title || category}
									<button on:click={() => removeCategory(category)} class="ml-1 hover:text-blue-300">×</button>
								</span>
							{/each}
							
							{#each selectedTags as tag}
								<span class="inline-flex items-center gap-1 px-3 py-1 bg-green-900/30 border border-green-700 rounded-full text-sm text-green-400">
									{tag}
									<button on:click={() => removeTag(tag)} class="ml-1 hover:text-green-300">×</button>
								</span>
							{/each}

							{#each selectedDifficulties as difficulty}
								<span class="inline-flex items-center gap-1 px-3 py-1 bg-orange-900/30 border border-orange-700 rounded-full text-sm text-orange-400">
									{difficulty}
									<button on:click={() => selectedDifficulties = selectedDifficulties.filter(d => d !== difficulty)} class="ml-1 hover:text-orange-300">×</button>
								</span>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Results Header -->
				<div class="flex justify-between items-center mb-6">
					<div>
						<p class="text-slate-300">
							{#if isSearching}
								Searching...
							{:else if totalResults > 0}
								<span class="font-semibold text-slate-200">{totalResults}</span> results found
								{#if searchTime > 0}
									<span class="text-slate-500">({Math.round(searchTime)}ms)</span>
								{/if}
							{:else if query || selectedCategories.length || selectedTags.length}
								No results found
							{:else}
								Enter a search term or apply filters to get started
							{/if}
						</p>
					</div>

					{#if totalResults > 0}
						<select 
							bind:value={sortBy}
							on:change={performSearch}
							class="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
						>
							<option value="relevance">Most Relevant</option>
							<option value="title">Alphabetical</option>
							<option value="difficulty">By Difficulty</option>
							<option value="newest">Newest First</option>
						</select>
					{/if}
				</div>

				<!-- Results Grid -->
				{#if paginatedResults.length > 0}
					<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
						{#each paginatedResults as course (course.id)}
							<CourseCard {course} />
						{/each}
					</div>

					<!-- Pagination -->
					{#if totalPages > 1}
						<div class="flex justify-center items-center gap-2">
							<button 
								on:click={() => currentPage = Math.max(1, currentPage - 1)}
								disabled={currentPage === 1}
								class="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg disabled:opacity-50 hover:bg-slate-600 transition-colors"
							>
								Previous
							</button>
							
							<span class="px-4 py-2 text-slate-300">
								Page {currentPage} of {totalPages}
							</span>
							
							<button 
								on:click={() => currentPage = Math.min(totalPages, currentPage + 1)}
								disabled={currentPage === totalPages}
								class="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg disabled:opacity-50 hover:bg-slate-600 transition-colors"
							>
								Next
							</button>
						</div>
					{/if}
				{:else if !isSearching && (query || selectedCategories.length || selectedTags.length)}
					<div class="text-center py-20">
						<div class="bg-slate-800/70 rounded-xl border border-slate-700 shadow-xl p-8 max-w-md mx-auto">
							<svg class="mx-auto h-16 w-16 text-slate-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<h3 class="text-xl font-medium text-slate-300 mb-2">No results found</h3>
							<p class="text-slate-400 mb-4">
								Try adjusting your search terms or filters.
							</p>
							<button 
								on:click={clearFilters}
								class="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium transition-colors"
							>
								Clear Filters
							</button>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
