<script lang="ts">
	import type { PageData } from './$types';
	import { fade, fly } from 'svelte/transition';
	import Icon from '@iconify/svelte';

	export let data: PageData;

	// $: console.log('Page data in courses/+page.svelte:', data);

	// Helper function to get a placeholder icon if a theme doesn't have one
	// You can expand this with actual theme-specific icons if available in frontmatter
	function getThemeIcon(themeId: string) {
		// Example: you could have a map or logic based on theme.id or title
		if (themeId.includes('math')) return 'mdi:calculator-variant-outline';
		if (themeId.includes('science')) return 'mdi:flask-outline';
		if (themeId.includes('programming')) return 'mdi:code-braces';
		return 'mdi:bookshelf'; // Default icon
	}
</script>

<svelte:head>
	<title>Course Themes | LearnFlow</title>
	<meta name="description" content="Explore various themes offering a structured collection of courses on LearnFlow." />
	<meta name="keywords" content="courses, themes, learning, education, online courses" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-sky-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white">
	<div class="container mx-auto px-4 py-8 sm:py-12">
		<!-- Header Section -->
		<header class="mb-12 md:mb-16 text-center" in:fade={{ duration: 600 }}>
			<div class="mb-6">
				<h1 class="text-5xl md:text-6xl font-bold bg-gradient-to-r from-sky-600 via-teal-500 to-green-600 bg-clip-text text-transparent mb-4 py-2">
					Explore Course Themes
				</h1>
				<p class="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
					Discover our curated themes, each offering a collection of courses designed to guide your learning journey in specific areas of knowledge.
				</p>
			</div>

			<!-- Statistics/Highlights (Optional, can be added if relevant data is available) -->
			{#if data.themes && data.themes.length > 0}
			<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8" in:fly={{ y: 20, duration: 500, delay: 200 }}>
				<div class="bg-white dark:bg-gray-800/50 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700/60 p-5 text-left">
					<div class="flex items-center">
						<Icon icon="mdi:format-list-bulleted-type" class="h-10 w-10 text-sky-600 dark:text-sky-400 mr-4" />
						<div>
							<p class="text-3xl font-bold">{data.themes.length}</p>
							<p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Themes</p>
						</div>
					</div>
				</div>
				<!-- Placeholder for more stats if available, e.g., total courses across all themes -->
				<div class="bg-white dark:bg-gray-800/50 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700/60 p-5 text-left">
					<div class="flex items-center">
						<Icon icon="mdi:book-open-page-variant-outline" class="h-10 w-10 text-teal-600 dark:text-teal-400 mr-4" />
						<div>
							<!-- Sum of children courses - this requires children count on theme objects -->
							<p class="text-3xl font-bold">{(data.themes || []).reduce((acc, theme) => acc + (theme.children?.length || 0), 0)}</p>
							<p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Courses</p>
						</div>
					</div>
				</div>
				<div class="bg-white dark:bg-gray-800/50 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700/60 p-5 text-left">
					<div class="flex items-center">
						<Icon icon="mdi:star-circle-outline" class="h-10 w-10 text-green-600 dark:text-green-400 mr-4" />
						<div>
							<p class="text-3xl font-bold">New!</p> <!-- Placeholder -->
							<p class="text-sm font-medium text-gray-500 dark:text-gray-400">Featured Content</p>
						</div>
					</div>
				</div>
			</div>
			{/if}
		</header>

		<!-- Themes Grid Section -->
		<section class="max-w-7xl mx-auto" in:fly={{ y: 20, duration: 500, delay: 300 }}>
			{#if data.error}
				<div class="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700/80 rounded-lg p-6 text-center">
					<Icon icon="mdi:alert-circle-outline" class="w-16 h-16 text-red-500 dark:text-red-400 mx-auto mb-4" />
					<h3 class="text-xl font-medium text-red-700 dark:text-red-300 mb-2">Error Loading Themes</h3>
					<p class="text-red-600 dark:text-red-400">{data.error}</p>
					<button
						on:click={() => window.location.reload()}
						class="mt-6 px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
					>
						Try Again
					</button>
				</div>
			{:else if data.themes && data.themes.length > 0}
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 sm:gap-x-8 sm:gap-y-10">
					{#each data.themes as theme, index (theme.id)}
						<a
							href={theme.contentPath}
							class="group relative block bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl dark:hover:shadow-gray-700/60 transition-all duration-300 ease-in-out border border-gray-200 dark:border-gray-700 hover:border-transparent transform hover:-translate-y-1 overflow-hidden"
							in:fly={{ y: 20, duration: 400, delay: 100 + index * 70 }}
						>
							<!-- Subtle gradient border effect on hover -->
							<span class="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-sky-500 via-teal-500 to-green-500 opacity-0 group-hover:opacity-75 transition-opacity duration-300 blur-sm group-hover:blur-md"></span>
							<span class="absolute inset-0 rounded-xl bg-white dark:bg-gray-800"></span>

							<div class="relative p-6 z-10 min-h-[220px] flex flex-col">
								<div class="flex-shrink-0 mb-4">
									<div class="w-16 h-16 bg-gradient-to-br from-sky-500 via-teal-500 to-green-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:shadow-teal-500/50 transition-all duration-300 transform group-hover:scale-110">
										<Icon icon={getThemeIcon(theme.id)} class="w-9 h-9 text-white transition-transform duration-300 group-hover:scale-105" />
									</div>
								</div>

								<h3 class="text-xl lg:text-2xl font-semibold text-gray-800 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-200 mb-2 leading-tight">
									{theme.title || 'Untitled Theme'}
								</h3>

								<p class="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 leading-relaxed flex-grow">
									{theme.description || 'No description available.'}
								</p>

								<div class="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700/60 flex items-center justify-between">
									<div class="text-sm text-gray-500 dark:text-gray-400">
										{#if theme.children && theme.children.length > 0}
											<span>{theme.children.length} {theme.children.length === 1 ? 'Course' : 'Courses'}</span>
										{:else}
											<span>Coming Soon</span>
										{/if}
									</div>
									<div class="flex items-center text-sm font-medium text-teal-600 dark:text-teal-400 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
										<span>Explore Theme</span>
										<Icon icon="mdi:arrow-right" class="w-4 h-4 ml-1.5 transform group-hover:translate-x-1 transition-transform" />
									</div>
								</div>
							</div>
						</a>
					{/each}
				</div>
			{:else}
				<div class="text-center py-16" in:fade={{ duration: 400 }}>
					<Icon icon="mdi:bookshelf-remove" class="w-24 h-24 text-gray-400 dark:text-gray-500 mx-auto mb-6" />
					<h3 class="text-2xl font-semibold text-gray-800 dark:text-white mb-4">No Course Themes Found</h3>
					<p class="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
						It seems there are no course themes available at the moment. Please check back later or explore our exercises.
					</p>
					<a
						href="/exercises"
						class="inline-flex items-center px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
					>
						<Icon icon="mdi:weight-lifter" class="w-5 h-5 mr-2" />
						Browse Exercises
					</a>
				</div>
			{/if}
		</section>
	</div>
</div>

<style>
	/* Additional global styles or component-specific overrides if needed */
</style>