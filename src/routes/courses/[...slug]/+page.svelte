<script lang="ts">
	import type { PageData } from './$types';
	import { marked } from 'marked';
	import { page, navigating, updated } from '$app/stores';
	import markedKatex from "marked-katex-extension";

	// --- Custom Marked Renderer for Callouts ---
	const calloutConfig = [
		{ type: 'definition', keywords: ['Définition'], class: 'callout-definition' },
		{ type: 'proposition', keywords: ['Proposition', 'Théorème', 'Lemme', 'Corollaire'], class: 'callout-proposition' },
		{ type: 'example', keywords: ['Exemple'], class: 'callout-example' },
		{ type: 'note', keywords: ['Note', 'Remarque'], class: 'callout-note' },
		{ 
			type: 'emphasis', 
			keywords: [
				'Sommes géométriques', 'Sommes télescopiques', 'Combinaisons',
				'Formule du binôme de Newton', 'Factorisations remarquables',
				'Structure affine de l’ensemble des solutions',
				'Méthode du pivot de Gauss',
				"Développement d\\'\\'\\'un produit de sommes :" // Escaped for JS string
			], 
			class: 'callout-generic-emphasis' 
		}
	];

	function getParagraphMarkup(text: string) {
		const strongContentMatch = text.match(/^<strong>(.*?)<\\/strong>(.*)/s);
		let strongText = '';
		
		if (strongContentMatch) {
			strongText = strongContentMatch[1];
			const trailingText = strongContentMatch[2];
			const isStrongOnlyLine = !trailingText || trailingText.trim() === '';

			for (const config of calloutConfig) {
				if (config.keywords.some(kw => strongText.startsWith(kw))) {
					if (config.type === 'emphasis' && !isStrongOnlyLine) {
						continue; // Don't apply emphasis callout if there's more text after the bold part
					}
					return { html: `<div class="callout ${config.class}"><p>${text}</p></div>` };
				}
			}
		}
		return { html: `<p>${text}</p>` }; // Default paragraph
	}

	const customRenderer = new marked.Renderer();
	customRenderer.paragraph = (text: string) => {
		return getParagraphMarkup(text).html;
	};

	marked.use(markedKatex({ throwOnError: false, nonStandard: true }), { renderer: customRenderer });
	// --- End Custom Marked Renderer ---

	export let data: PageData; // Data specific to this lesson page
	
	// Access layout data via $page store
	let layoutData: App.LayoutData;
	$: layoutData = $page.data.layoutData;

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

	// $: console.log('Lesson Page Data:', data);
	// $: console.log('Layout Data on Lesson Page:', layoutData);
	// $: console.log('Prev:', prevLesson, 'Next:', nextLesson, 'CurrentIndex:', currentIndex);

</script>

<div class="lesson-content-wrapper">
	{#if data.contentItem}
		<article class="content-article">
			<header class="content-header">
				<!-- Main Page Title - styled separately from prose h1 -->
				<h1 class="text-4xl font-extrabold text-gray-800 mb-2">{data.contentItem.title || 'Untitled Content'}</h1>
				<p class="meta-info text-sm text-gray-600">
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
				{#if data.contentItem.rawMdxContent}
					{@html marked(data.contentItem.rawMdxContent)}
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
	/* Ensure this component's styles can use @apply or Tailwind directives */
	/* If not, these styles might need to go into a global app.css processed by Tailwind */

	.lesson-content-wrapper {
		@apply max-w-4xl mx-auto px-4 py-8; /* Example: Constrain width and center */
	}
	.content-article {
		@apply bg-white shadow-lg rounded-lg p-6 md:p-10;
	}
	.content-header {
		@apply mb-8 border-b border-gray-200 pb-6;
	}
	.content-header h1 { /* Styles for the main page title passed via data */
		@apply text-4xl font-bold text-gray-800 tracking-tight;
	}
	.meta-info span {
		@apply mr-4 text-sm text-gray-500;
	}
	.content-description { /* Styles for the description from frontmatter */
		@apply text-lg text-gray-700 italic my-6 p-4 bg-slate-50 rounded-md border-l-4 border-slate-300;
	}

	/* Callout Styles */
	:global(.callout) { /* Use :global as these classes are injected by marked */
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
		@apply bg-slate-100 border-slate-400 text-slate-800; /* Darker than description bg */
	}
	:global(.callout-note p strong:first-child),
	:global(.callout-remark p strong:first-child) {
		@apply text-slate-700;
	}
	:global(.callout-generic-emphasis) {
		@apply bg-indigo-50 border-indigo-400 text-indigo-800;
	}
	:global(.callout-generic-emphasis p strong:first-child) { /* For lines that are just bold titles */
		@apply block mb-0 font-semibold text-lg text-indigo-700; /* No extra margin if it's the only content */
	}
	/* General styling for the bolded term within any callout if it's the start of the paragraph */
	:global(.callout > p > strong:first-child) {
		@apply block mb-2 font-semibold text-lg; /* Default styling for the "title" of the callout */
	}


	/* Prose Overrides and Enhancements */
	:global(.prose) { /* Targeting the .prose class on the section */
		@apply text-gray-700;
	}
	:global(.prose h1) { /* Chapter/Top-level heading in MDX content */
		@apply text-3xl font-bold mt-0 mb-8 pb-3 border-b border-gray-300 text-gray-800; /* mt-0 if it's the first thing */
	}
	:global(.prose h2) { /* Section headings */
		@apply text-2xl font-semibold mt-10 mb-6 pb-2 border-b border-gray-200 text-gray-700;
	}
	:global(.prose h3) { /* Sub-section headings */
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
		@apply font-semibold text-gray-800; /* Slightly darker strong text */
	}
	:global(.prose code) { /* Inline code */
		@apply bg-gray-100 text-red-600 px-1 py-0.5 rounded-md text-sm font-mono;
	}
	:global(.prose pre) { /* Code blocks */
		@apply bg-gray-800 text-gray-100 p-4 rounded-md shadow-md overflow-x-auto;
	}
	:global(.prose blockquote) {
		@apply border-l-4 border-gray-300 pl-4 italic text-gray-600 my-6;
	}
	:global(.prose hr) {
		@apply my-8 border-gray-200;
	}

	/* Block Math Styles */
	:global(.prose .katex-display > .katex) { /* KaTeX block math */
		@apply bg-slate-50 p-4 rounded-md overflow-x-auto my-6 shadow text-base; /* text-base to reset prose font scaling if any */
	}
	:global(.prose .katex-display > .katex .mtable) { /* Ensure tables within KaTeX are not too wide */
		@apply max-w-full overflow-x-auto;
	}
	/* Inline Math - KaTeX default is usually fine, but can be tweaked if needed */
	:global(.prose .katex) {
		@apply text-sm; /* Match inline code font size, or adjust as preferred */
	}


	/* Styles for lesson-content-wrapper, content-article, content-header, etc. are mostly inherited or defined in previous steps */
	/* Ensure .prose styles are applied for MDX content */
	/* .lesson-content-wrapper { */
		/* Max-width and basic padding is now handled by the layout's .course-main-content */
		/* Or by the new .lesson-content-wrapper styles above */
	/* } */

	.lesson-pagination {
		display: flex;
		justify-content: space-between;
		margin-top: 3rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--border-color-soft, #E5E7EB);
	}
	.pagination-link {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1.25rem;
		border: 1px solid var(--border-color-medium, #D1D5DB);
		border-radius: 0.5rem;
		text-decoration: none;
		color: var(--primary-color, #3B82F6); /* Ensure this var is defined or replace */
		transition: background-color 0.2s, border-color 0.2s;
		max-width: 48%; /* Ensure they don't overlap if titles are long */
	}
	.pagination-link:hover {
		background-color: var(--bg-color-light, #F9FAFB); /* Ensure this var is defined or replace */
		border-color: var(--primary-color, #3B82F6); /* Ensure this var is defined or replace */
	}
	.pagination-link.disabled {
		visibility: hidden; /* Keep space but hide */
	}
	.pagination-link .text {
		display: flex;
		flex-direction: column;
	}
	.pagination-link.next .text {
		align-items: flex-end;
	}
	.pagination-link .label {
		font-size: 0.8rem;
		color: var(--text-color-muted, #6B7280); /* Ensure this var is defined or replace */
		margin-bottom: 0.1rem;
	}
	.pagination-link .title {
		font-weight: 500;
		color: var(--primary-color, #3B82F6); /* Ensure this var is defined or replace */
		font-size: 1rem;
		line-height: 1.3;
		/* Truncate long titles if necessary */
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 200px; /* Adjust as needed */
	}
	.pagination-link .arrow {
		font-size: 1.5rem;
		line-height: 1;
	}
</style>
