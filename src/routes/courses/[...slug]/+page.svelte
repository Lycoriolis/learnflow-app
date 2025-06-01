<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import EnhancedMarkdownRenderer from '$lib/components/EnhancedMarkdownRenderer.svelte';
	import { processCourseCallouts } from '$lib/utils/markdown';
	import Icon from '@iconify/svelte';
	import { fade, fly } from 'svelte/transition';

	export let data: PageData; // Contains contentNode and children

	// Process the main markdown content if it exists (for lessons or overview pages with body content)
	$: processedBodyContent = data.contentNode?.rawMdxContent
		? processCourseCallouts(data.contentNode.rawMdxContent)
		: '';

	// TODO: Prev/Next navigation can be enhanced via layout or by fetching sibling data in +page.server.ts
	let prevItem: any = null; // Placeholder
	let nextItem: any = null; // Placeholder

	// Helper function for icons, similar to courses/+page.svelte
	function getItemIcon(item: any) {
		if (item.contentType === 'course_overview') return 'mdi:school-outline';
		if (item.contentType && item.contentType.startsWith('lesson')) return 'mdi:book-open-outline';
		// Add more specific icons based on tags or other metadata if desired
		return 'mdi:file-document-outline';
	}
</script>

<svelte:head>
	<title>{data.contentNode?.title || 'Content'} | LearnFlow</title>
	<meta name="description" content={data.contentNode?.description || 'Explore educational content on LearnFlow.'} />
</svelte:head>

<!-- Apply the modern gradient background and text colors -->
<div class="min-h-screen bg-gradient-to-br from-sky-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white">
	<div class="container mx-auto px-4 py-8 sm:py-12">
		{#if data.contentNode}
			<article class="content-article-main bg-white dark:bg-gray-800/70 dark:backdrop-blur-md shadow-xl dark:shadow-gray-900/50 rounded-lg p-6 sm:p-8 md:p-10"  in:fade={{ duration: 300 }}>
				<header class="content-header mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
					<!-- Breadcrumbs (Optional - could be part of a layout) -->
					<!-- <nav class="mb-4 text-sm text-gray-500 dark:text-gray-400">
						<a href="/courses" class="hover:text-teal-500">Courses</a>
						{#if data.contentNode.contentPath}
							{#each data.contentNode.contentPath.split('/').filter(p => p && p !== 'courses') as segment, i (segment)}
								<span class="mx-1">/</span>
								{#if i === data.contentNode.contentPath.split('/').filter(p => p && p !== 'courses').length -1}
									<span class="font-medium text-gray-700 dark:text-gray-200">{data.contentNode.title}</span>
								{:else}
									<a href={`/courses/${data.contentNode.contentPath.split('/').filter(p => p && p !== 'courses').slice(0, i+1).join('/')}`} class="hover:text-teal-500 capitalize">{segment.replace('-', ' ')}</a>
								{/if}
							{/each}
						{/if}
					</nav> -->

					<h1 class="text-4xl sm:text-5xl font-bold tracking-tight text-gray-800 dark:text-white mb-3">
						{data.contentNode.title || 'Untitled Content'}
					</h1>
					{#if data.contentNode.description}
						<p class="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mt-2">
							{data.contentNode.description}
						</p>
					{/if}
					<p class="meta-info text-sm text-gray-500 dark:text-gray-400 mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
						{#if data.contentNode.contentType}
							<span class="inline-flex items-center px-2.5 py-1 rounded-full bg-sky-100 dark:bg-sky-700/50 text-sky-700 dark:text-sky-300 font-medium">
								<Icon icon="mdi:tag-outline" class="w-4 h-4 mr-1.5" />
								{data.contentNode.contentType.replace(/_/g, ' ')}
							</span>
						{/if}
						{#if data.contentNode.difficulty}
							<span class="inline-flex items-center">
								<Icon icon="mdi:signal-cellular-outline" class="w-4 h-4 mr-1.5 text-yellow-600 dark:text-yellow-400" />
								Difficulty: {data.contentNode.difficulty}
							</span>
						{/if}
						{#if data.contentNode.estimatedTime}
							<span class="inline-flex items-center">
								<Icon icon="mdi:clock-outline" class="w-4 h-4 mr-1.5 text-green-600 dark:text-green-400" />
								Est. Time: {data.contentNode.estimatedTime}
							</span>
						{/if}
					</p>
				</header>

				<!-- Render based on content type -->
				{#if data.contentNode.contentType === 'theme_overview'}
					<section class="overview-content" in:fly={{ y: 20, duration: 400, delay: 100 }}>
						{#if processedBodyContent}
							<div class="prose dark:prose-invert lg:prose-xl max-w-none mb-10">
								<EnhancedMarkdownRenderer content={processedBodyContent} />
							</div>
						{/if}
						<h2 class="text-2xl sm:text-3xl font-semibold text-gray-700 dark:text-gray-200 mb-6 mt-8">Courses in this Theme:</h2>
						{#if data.children && data.children.length > 0}
							<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
								{#each data.children as course (course.id)}
									<a
										href={course.contentPath}
										class="group relative block bg-white dark:bg-gray-800/80 p-6 rounded-lg shadow-md hover:shadow-lg dark:hover:shadow-gray-700/70 transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-teal-500 dark:hover:border-teal-500 transform hover:-translate-y-0.5"
									>
										<div class="flex items-start">
											<Icon icon={getItemIcon(course)} class="w-8 h-8 text-teal-600 dark:text-teal-400 mr-4 mt-1 flex-shrink-0" />
											<div>
												<h3 class="text-xl font-semibold text-teal-700 dark:text-teal-300 group-hover:text-teal-600 dark:group-hover:text-teal-200 mb-1.5 leading-tight">
													{course.title || 'Untitled Course'}
												</h3>
												<p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{course.description || 'No description available.'}</p>
											</div>
										</div>
									</a>
								{/each}
							</div>
						{:else}
							<p class="text-gray-500 dark:text-gray-400">No courses found in this theme yet.</p>
						{/if}
					</section>
				{:else if data.contentNode.contentType === 'course_overview'}
					<section class="overview-content" in:fly={{ y: 20, duration: 400, delay: 100 }}>
						{#if processedBodyContent}
							<div class="prose dark:prose-invert lg:prose-xl max-w-none mb-10">
								<EnhancedMarkdownRenderer content={processedBodyContent} />
							</div>
						{/if}
						<h2 class="text-2xl sm:text-3xl font-semibold text-gray-700 dark:text-gray-200 mb-6 mt-8">Lessons in this Course:</h2>
						{#if data.children && data.children.length > 0}
							<ul class="space-y-4">
								{#each data.children as lesson (lesson.id)}
									<li>
										<a
											href={lesson.contentPath}
											class="group flex items-start p-4 bg-white dark:bg-gray-800/80 rounded-lg shadow-sm hover:shadow-md dark:hover:shadow-gray-700/70 transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:border-sky-500 dark:hover:border-sky-500"
										>
											<Icon icon={getItemIcon(lesson)} class="w-7 h-7 text-sky-600 dark:text-sky-400 mr-4 mt-1 flex-shrink-0" />
											<div>
												<h4 class="text-lg font-medium text-sky-700 dark:text-sky-300 group-hover:text-sky-600 dark:group-hover:text-sky-200 leading-tight">
													{lesson.title || 'Untitled Lesson'}
												</h4>
												{#if lesson.description}
													<p class="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{lesson.description}</p>
												{/if}
											</div>
										</a>
									</li>
								{/each}
							</ul>
						{:else}
							<p class="text-gray-500 dark:text-gray-400">No lessons found in this course yet.</p>
						{/if}
					</section>
				{:else if data.contentNode.contentType && data.contentNode.contentType.startsWith('lesson')}
					<section class="main-content prose dark:prose-invert lg:prose-xl max-w-none" in:fly={{ y: 20, duration: 400, delay: 100 }}>
						{#if processedBodyContent}
							<EnhancedMarkdownRenderer content={processedBodyContent} />
						{:else}
							<p class="text-gray-500 dark:text-gray-400">This lesson content could not be loaded or is empty.</p>
						{/if}
					</section>

					<!-- Basic Prev/Next (Placeholder - requires more context from layout or server) -->
					{#if prevItem || nextItem}
					<nav class="lesson-pagination mt-12 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
						{#if prevItem}
							<a href={prevItem.contentPath} class="pagination-link prev group inline-flex items-center text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300">
								<Icon icon="mdi:arrow-left" class="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
								{prevItem.title || 'Previous'}
							</a>
						{:else} <span /> {/if}
						{#if nextItem}
							<a href={nextItem.contentPath} class="pagination-link next group inline-flex items-center text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300">
								{nextItem.title || 'Next'}
								<Icon icon="mdi:arrow-right" class="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
							</a>
						{:else} <span /> {/if}
					</nav>
					{/if}
				{:else}
					<!-- Fallback for unknown content types -->
					<section class="main-content prose dark:prose-invert lg:prose-xl max-w-none" in:fly={{ y: 20, duration: 400, delay: 100 }}>
						<p>This content type '{data.contentNode.contentType}' is not fully supported for display.</p>
						{#if processedBodyContent}
							<p>However, here is the raw content if available:</p>
							<EnhancedMarkdownRenderer content={processedBodyContent} />
						{/if}
					</section>
				{/if}

			</article>
		{:else}
			<div class="text-center py-20" in:fade={{duration: 300}}>
				<Icon icon="mdi:file-question-outline" class="w-24 h-24 text-gray-400 dark:text-gray-500 mx-auto mb-6" />
				<h1 class="text-2xl sm:text-3xl font-semibold text-gray-700 dark:text-gray-200">Content Not Found</h1>
				<p class="text-gray-500 dark:text-gray-400 mt-2 mb-8">The requested content could not be loaded. Please check the URL or try again later.</p>
				<a href="/courses" class="inline-flex items-center px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors">
					<Icon icon="mdi:arrow-left" class="w-5 h-5 mr-2" />
					Back to Courses
				</a>
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	/* Ensure main wrapper takes full height */
	.min-h-screen {
		min-height: 100vh;
	}

	/* General article styling, including dark mode */
	.content-article-main {
		@apply dark:bg-gray-800/80 dark:backdrop-blur-md dark:border dark:border-gray-700/60;
	}

	/* Meta info badges styling */
	.meta-info span.inline-flex {
		@apply text-xs font-medium;
	}

	/* Prose adjustments for dark mode */
	:global(.dark .prose) {
		@apply prose-invert; /* This Tailwind class handles most dark mode prose */
		/* Overrides for prose-invert to match sky-teal-green theme if needed */
		--tw-prose-links: theme('colors.teal.400');
		--tw-prose-bullets: theme('colors.teal.500');
		--tw-prose-quote-borders: theme('colors.sky.500');
		/* --tw-prose-code: theme('colors.sky.300'); /* Already handled by specific .prose code below */ */
	}

	:global(.prose) {
		/* Overrides for light mode prose to match sky-teal-green theme */
		--tw-prose-links: theme('colors.teal.600');
		--tw-prose-bullets: theme('colors.teal.600');
		--tw-prose-quote-borders: theme('colors.sky.600');
		/* --tw-prose-code: theme('colors.sky.700'); /* Already handled by specific .prose code below */ */
	}

	:global(.prose a) { /* Specific link styling if prose variables aren't enough, or for hover */
		@apply hover:text-teal-700 dark:hover:text-teal-300 hover:underline;
	}

	/* Inline code: uses sky colors, consistent with copy button & other UI elements */
	:global(.prose code) {
		@apply bg-sky-100 dark:bg-sky-800/60 text-sky-700 dark:text-sky-300 px-1.5 py-0.5 rounded-md text-sm font-medium;
		/* Resetting default prose code pseudo-elements if they exist and add quotes */
		&::before, &::after {
			content: none !important;
		}
	}
	/* Code in headings should be less prominent or match heading color */
	:global(.prose h1 code, .prose h2 code, .prose h3 code, .prose h4 code, .prose h5 code, .prose h6 code) {
		@apply bg-transparent dark:bg-transparent text-inherit dark:text-inherit font-semibold;
		/* font-size: inherit; remove if too large */
	}

	/* Code blocks: use a dark background for both light and dark modes for consistency */
	:global(.prose pre) {
		@apply bg-gray-800 dark:bg-gray-900/70 text-gray-200 dark:text-gray-300 border border-gray-700 dark:border-gray-700/50;
	}
	/* Text color inside pre > code, if not handled by hljs theme */
	:global(.prose pre code) {
		@apply bg-transparent text-inherit p-0 border-none;
		/* Ensure pre code has no extra background/padding if hljs provides its own */
	}


	:global(.prose blockquote) {
		/* Uses --tw-prose-quote-borders defined above */
		@apply pl-4 italic text-slate-600 dark:text-slate-400 my-6;
	}

	:global(.prose hr) { /* Default prose HR is usually fine */
		@apply border-slate-200 dark:border-gray-700;
	}

	/* Headings are generally handled well by prose-invert, but ensure consistency if needed */
	:global(.prose h1, .prose h2, .prose h3, .prose h4) {
		@apply text-gray-800 dark:text-white;
	}

	/* Table styling is largely handled by prose, but ensure dark mode consistency */
	:global(.prose th) {
		@apply text-slate-800 dark:text-slate-100;
	}
	:global(.prose thead) {
		@apply border-b border-slate-300 dark:border-gray-600;
	}
	:global(.prose tbody tr) {
		@apply border-b border-slate-200 dark:border-gray-700;
	}


	/* Callout Styles - ensuring dark mode compatibility */
	:global(.callout) {
		@apply p-4 my-6 rounded-md border-l-4 shadow-sm;
	}

	/* Definition Callout */
	:global(.callout-definition) {
		@apply bg-sky-50 border-sky-400 text-sky-700 dark:bg-sky-800/30 dark:border-sky-600/70 dark:text-sky-200;
	}
	:global(.callout-definition p strong:first-child) {
		@apply text-sky-700 dark:text-sky-300;
	}

	/* Proposition, Theorem, Lemma, Corollary Callout */
	:global(.callout-proposition),
	:global(.callout-theorem),
	:global(.callout-lemma),
	:global(.callout-corollary) {
		@apply bg-emerald-50 border-emerald-400 text-emerald-700 dark:bg-emerald-800/30 dark:border-emerald-600/70 dark:text-emerald-200;
	}
	:global(.callout-proposition p strong:first-child),
	:global(.callout-theorem p strong:first-child),
	:global(.callout-lemma p strong:first-child),
	:global(.callout-corollary p strong:first-child) {
		@apply text-emerald-700 dark:text-emerald-300;
	}

	/* Example Callout */
	:global(.callout-example) {
		@apply bg-amber-50 border-amber-400 text-amber-700 dark:bg-amber-800/30 dark:border-amber-600/70 dark:text-amber-200;
	}
	:global(.callout-example p strong:first-child) {
		@apply text-amber-700 dark:text-amber-300;
	}

	/* Note, Remark Callout */
	:global(.callout-note),
	:global(.callout-remark) {
		@apply bg-gray-100 border-gray-400 text-gray-700 dark:bg-gray-700/40 dark:border-gray-600/70 dark:text-gray-300;
	}
	:global(.callout-note p strong:first-child),
	:global(.callout-remark p strong:first-child) {
		@apply text-gray-700 dark:text-gray-200;
	}

	/* Generic Emphasis Callout */
	:global(.callout-generic-emphasis) {
		@apply bg-indigo-50 border-indigo-400 text-indigo-700 dark:bg-indigo-800/30 dark:border-indigo-600/70 dark:text-indigo-200;
	}
	:global(.callout-generic-emphasis p strong:first-child) {
		@apply block mb-0 font-semibold text-lg text-indigo-700 dark:text-indigo-300;
	}

	:global(.callout > p > strong:first-child) { /* General strong title for callouts */
		@apply block mb-2 font-semibold text-lg;
	}

	/* Block Math Styles - Katex */
	:global(.prose .katex-display > .katex) {
		@apply bg-gray-100 dark:bg-gray-800/50 p-4 rounded-md overflow-x-auto my-6 shadow text-base;
	}
	:global(.prose .katex) { /* Inline Katex */
		@apply text-sm; /* Adjust size if needed */
	}
	/* Ensure Katex text color is appropriate for dark mode if not handled by prose-invert */
	:global(.dark .prose .katex) {
		color: inherit; /* Or set a specific dark mode color like dark:text-gray-200 */
	}

	.pagination-link {
        @apply font-medium;
	}
</style>
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
