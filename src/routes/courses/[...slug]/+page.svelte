<script lang="ts">
	import type { PageData } from './$types';
	import { page, navigating, updated } from '$app/stores';
	import EnhancedMarkdownRenderer from '$lib/components/EnhancedMarkdownRenderer.svelte';
	import { processCourseCallouts } from '$lib/utils/markdown.ts';

	export let data: PageData; // Data specific to this lesson page
	
	// Create a type for layout data
	interface LayoutData {
		siblingLessons?: any[];
		courseData?: any;
		// Add other properties as needed
	}
	
	// Access layout data via $page store
	let layoutData: LayoutData;
	$: layoutData = $page.data.layoutData || {};

	let currentIndex = -1;
	let prevLesson: any = null;
	let nextLesson: any = null;

	$: if (layoutData?.siblingLessons && data.contentItem?.id) {
		currentIndex = layoutData.siblingLessons.findIndex(lesson => lesson.id === data.contentItem.id);
		if (currentIndex !== -1) {
			prevLesson = currentIndex > 0 ? layoutData.siblingLessons[currentIndex - 1] : null;
			nextLesson = currentIndex < layoutData.siblingLessons.length - 1 ? layoutData.siblingLessons[currentIndex + 1] : null;
		} else {
			// If current lesson not found by ID in siblings (e.g. ID mismatch or not part of explicit list)
			// Try matching by contentPath
			const currentPath = $page.url.pathname;
			currentIndex = layoutData.siblingLessons.findIndex(lesson => lesson.contentPath === currentPath);
			if (currentIndex !== -1) {
				prevLesson = currentIndex > 0 ? layoutData.siblingLessons[currentIndex - 1] : null;
				nextLesson = currentIndex < layoutData.siblingLessons.length - 1 ? layoutData.siblingLessons[currentIndex + 1] : null;
			} else {
				prevLesson = null;
				nextLesson = null;
			}
		}
	} else {
		currentIndex = -1;
		prevLesson = null;
		nextLesson = null;
	}

	// Process the content to convert legacy callouts to enhanced format
	$: processedContent = data.contentItem?.rawMdxContent ? processCourseCallouts(data.contentItem.rawMdxContent) : '';

	// $: console.log('Lesson Page Data:', data);
	// $: console.log('Layout Data on Lesson Page:', layoutData);
	// $: console.log('Prev:', prevLesson, 'Next:', nextLesson, 'CurrentIndex:', currentIndex);
</script>

<div class="lesson-content-wrapper">
	{#if data.contentItem}
		<article class="content-article">
			<header class="content-header">
				<!-- Main Page Title - styled separately from prose h1 -->
				<h1 class="text-4xl font-extrabold text-gray-800 mb-3">{data.contentItem.title || 'Untitled Content'}</h1>
				<p class="meta-info text-sm text-gray-600 mt-1 mb-6">
					{#if data.contentItem.difficulty}<span>Difficulty: {data.contentItem.difficulty}</span>{/if}
					{#if data.contentItem.estimatedTime}<span class="ml-4">Time: {data.contentItem.estimatedTime}</span>{/if}
				</p>
			</header>

			{#if data.contentItem.description}
				<p class="content-description text-lg text-gray-700 italic my-6 p-4 bg-gray-50 rounded-md border-l-4 border-gray-300">
					{data.contentItem.description}
				</p>
			{/if}
			
			<section class="main-content prose lg:prose-xl max-w-none"> <!-- Added max-w-none to allow prose to fill container -->
				{#if processedContent}
					<EnhancedMarkdownRenderer content={processedContent} />
				{:else}
					<p>Content could not be loaded.</p>
				{/if}
			</section>

			{#if prevLesson || nextLesson}
			<nav class="lesson-pagination">
				{#if prevLesson}
					<a href={prevLesson.contentPath} class="pagination-link prev">
						<span class="arrow">&larr;</span>
						<span class="text">
							<span class="label">Previous Lesson</span>
							<span class="title">{prevLesson.title || 'Previous'}</span>
						</span>
					</a>
				{:else}
					<span class="pagination-link disabled prev"></span> <!-- Placeholder for spacing -->
				{/if}
				{#if nextLesson}
					<a href={nextLesson.contentPath} class="pagination-link next">
						<span class="text">
							<span class="label">Next Lesson</span>
							<span class="title">{nextLesson.title || 'Next'}</span>
						</span>
						<span class="arrow">&rarr;</span>
					</a>
				{:else}
					<span class="pagination-link disabled next"></span> <!-- Placeholder for spacing -->
				{/if}
			</nav>
			{/if}

		</article>
	{:else}
		<p>Content not found.</p>
	{/if}
</div>

<style lang="postcss">
	.lesson-content-wrapper {
		@apply max-w-4xl mx-auto px-4 py-8;
	}
	.content-article {
		@apply bg-white shadow-lg rounded-lg p-6 md:p-10;
	}
	.content-header {
		@apply mb-8 border-b border-gray-200 pb-6;
	}
	.content-header h1 { 
		@apply text-4xl font-bold text-gray-800 tracking-tight mb-3;
	}
	.meta-info {
        @apply mt-1 mb-6;
    }
	.meta-info span {
		@apply mr-4 text-sm text-gray-500;
	}
	.content-description { 
		@apply text-lg text-gray-700 italic my-6 p-4 bg-gray-50 rounded-md border-l-4 border-gray-300;
	}

	/* Callout Styles */
	:global(.callout) { 
		@apply p-4 my-6 rounded-md border-l-4 shadow-sm;
	}
	:global(.callout-definition) {
		@apply bg-sky-50 border-sky-400 text-sky-800;
	}
	:global(.callout-definition p strong:first-child) {
		@apply text-sky-700;
	}
	:global(.callout-proposition), :global(.callout-theorem), :global(.callout-lemma), :global(.callout-corollary) {
		@apply bg-emerald-50 border-emerald-400 text-emerald-800;
	}
	:global(.callout-proposition p strong:first-child), 
	:global(.callout-theorem p strong:first-child),
	:global(.callout-lemma p strong:first-child),
	:global(.callout-corollary p strong:first-child) {
		@apply text-emerald-700;
	}
	:global(.callout-example) {
		@apply bg-amber-50 border-amber-400 text-amber-800;
	}
	:global(.callout-example p strong:first-child) {
		@apply text-amber-700;
	}
	:global(.callout-note), :global(.callout-remark) {
		@apply bg-gray-100 border-gray-400 text-gray-800;
	}
	:global(.callout-note p strong:first-child),
	:global(.callout-remark p strong:first-child) {
		@apply text-gray-700;
	}
	:global(.callout-generic-emphasis) {
		@apply bg-indigo-50 border-indigo-400 text-indigo-800;
	}
	:global(.callout-generic-emphasis p strong:first-child) { 
		@apply block mb-0 font-semibold text-lg text-indigo-700;
	}
	:global(.callout > p > strong:first-child) {
		@apply block mb-2 font-semibold text-lg;
	}

	/* Prose Overrides and Enhancements */
	:global(.prose) { 
		@apply text-gray-700;
	}
	:global(.prose h1) { 
		@apply text-3xl font-bold mt-0 mb-8 pb-3 border-b border-gray-300 text-gray-800;
	}
	:global(.prose h2) { 
		@apply text-2xl font-semibold mt-10 mb-6 pb-2 border-b border-gray-200 text-gray-700;
	}
	:global(.prose h3) { 
		@apply text-xl font-semibold mt-8 mb-4 text-gray-700;
	}
	:global(.prose h4) {
		@apply text-lg font-semibold mt-6 mb-3 text-gray-600;
	}

	:global(.prose p) {
		@apply mb-5 leading-relaxed;
	}
	:global(.prose ul), :global(.prose ol) {
		@apply mb-5 pl-5;
	}
	:global(.prose li) {
		@apply mb-2;
	}
	:global(.prose li::marker) {
		@apply text-gray-500;
	}
	:global(.prose a) {
		@apply text-blue-600 hover:text-blue-700 hover:underline font-medium;
	}
	:global(.prose strong) {
		@apply font-semibold text-gray-800;
	}
	:global(.prose code) { 
		@apply bg-sky-50 text-sky-700 px-1.5 py-1 rounded-md text-sm font-mono shadow-sm;
	}
	:global(.prose pre) { 
		@apply bg-gray-800 text-gray-100 p-4 rounded-md shadow-md overflow-x-auto;
	}
	:global(.prose blockquote) {
		@apply border-l-4 border-gray-300 pl-4 italic text-gray-600 my-6;
	}
	:global(.prose hr) {
		@apply my-10 border-gray-200;
	}

	/* Block Math Styles */
	:global(.prose .katex-display > .katex) { 
		@apply bg-gray-50 p-4 rounded-md overflow-x-auto my-6 shadow text-base;
	}
	:global(.prose .katex-display > .katex .mtable) { 
		@apply max-w-full overflow-x-auto;
	}
	:global(.prose .katex) {
		@apply text-sm;
	}

	.lesson-pagination {
		@apply flex justify-between items-stretch mt-12 pt-6 border-t border-gray-200;
	}
	.pagination-link {
		@apply flex flex-col items-start gap-1 p-4 border border-gray-300 rounded-lg text-left w-[calc(50%-0.5rem)];
        @apply hover:bg-gray-50 hover:border-gray-400 transition-colors duration-150 ease-in-out;
	}
    .pagination-link.prev {
        @apply items-start;
    }
    .pagination-link.next {
        @apply items-end text-right;
    }

	.pagination-link .arrow {
		@apply text-xl text-blue-600 font-semibold;
	}

    .pagination-link .text .label {
        @apply block text-xs text-gray-500 mb-0.5;
    }
    .pagination-link .text .title {
        @apply block text-base font-semibold text-gray-700 hover:text-blue-600;
    }

    .pagination-link.disabled {
        @apply opacity-0 pointer-events-none; 
    }

</style>
