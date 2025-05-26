<script lang="ts">
    import type { PageData } from './$types';
    import ExerciseCard from '$lib/components/exercises/ExerciseCard.svelte';
    import UnifiedRenderer from '$lib/components/UnifiedRenderer.svelte'; 
    
    export let data: PageData;
    
    $: ({ type, exercise, categoryNode, items, breadcrumbs } = data);
</script>

<svelte:head>
    {#if type === 'exercise' && exercise}
        <title>{exercise.title} | LearnFlow</title>
        <meta name="description" content={exercise.description || `Exercise: ${exercise.title}`} />
    {:else if type === 'category' && categoryNode}
        <title>{categoryNode.title} | LearnFlow</title>
        <meta name="description" content={categoryNode.description || `Category: ${categoryNode.title}`} />
    {/if}
</svelte:head>

<div class="container mx-auto px-4 py-8">
    <!-- Breadcrumbs -->
    {#if breadcrumbs && breadcrumbs.length > 1}
        <nav class="mb-6" aria-label="Breadcrumb">
            <ol class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                {#each breadcrumbs as crumb, index}
                    <li class="flex items-center">
                        {#if index > 0}
                            <svg class="w-4 h-4 mx-2 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                            </svg>
                        {/if}
                        {#if index === breadcrumbs.length - 1}
                            <span class="font-medium text-gray-900 dark:text-white">{crumb.title}</span>
                        {:else}
                            <a href={crumb.href} class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                {crumb.title}
                            </a>
                        {/if}
                    </li>
                {/each}
            </ol>
        </nav>
    {/if}

    {#if type === 'exercise' && exercise}
        <!-- Individual Exercise Page -->
        <article class="max-w-4xl mx-auto">
            <header class="mb-8">
                <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">{exercise.title}</h1>
                {#if exercise.description}
                    <p class="text-xl text-gray-600 dark:text-gray-300 mb-6">{exercise.description}</p>
                {/if}
                
                <div class="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                    {#if exercise.level}
                        <span class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full">
                            Level: {exercise.level}
                        </span>
                    {/if}
                    {#if exercise.duration}
                        <span class="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full">
                            Duration: {exercise.duration}
                        </span>
                    {/if}
                    {#if exercise.difficulty}
                        <span class="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-full">
                            Difficulty: {exercise.difficulty}
                        </span>
                    {/if}
                    {#if exercise.tags && exercise.tags.length > 0}
                        {#each exercise.tags as tag}
                            <span class="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full">
                                {tag}
                            </span>
                        {/each}
                    {/if}
                </div>
            </header>

            {#if exercise.content}
                <div class="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:leading-7 prose-p:mb-4 prose-li:mb-2 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic">
                    <UnifiedRenderer content={exercise.content} type="math" />
                </div>
            {:else}
                <p class="text-gray-500 dark:text-gray-400 italic">No content available for this exercise.</p>
            {/if}
        </article>

    {:else if type === 'category' && categoryNode}
        <!-- Category/Overview Page -->
        <div class="max-w-6xl mx-auto">
            <header class="mb-8">
                <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">{categoryNode.title}</h1>
                {#if categoryNode.description}
                    <p class="text-xl text-gray-600 dark:text-gray-300 mb-6">{categoryNode.description}</p>
                {/if}
            </header>

            <!-- Category Content -->
            {#if categoryNode.content}
                <div class="prose prose-lg dark:prose-invert max-w-none mb-12">
                    <UnifiedRenderer content={categoryNode.content} type="markdown" />
                </div>
            {/if}

            <!-- Child Items -->
            {#if items && items.length > 0}
                <section>
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        {categoryNode.childContentType === 'lesson' ? 'Lessons' : 'Exercises'}
                    </h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {#each items as item}
                            <ExerciseCard exercise={item} />
                        {/each}
                    </div>
                </section>
            {:else}
                <div class="text-center py-12">
                    <p class="text-gray-500 dark:text-gray-400 text-lg">No exercises or sub-categories found in this section.</p>
                </div>
            {/if}
        </div>

    {:else}
        <!-- Error state -->
        <div class="text-center py-12">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Content Not Found</h1>
            <p class="text-gray-600 dark:text-gray-300 mb-6">The requested content could not be found.</p>
            <a href="/exercises" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Return to Exercises
            </a>
        </div>
    {/if}
</div>

<style>
    /* Math content styling */
    :global(.katex-display) {
        background-color: rgba(243, 244, 246, 0.3);
        padding: 1.5rem;
        border-radius: 0.75rem;
        margin: 2rem 0;
        overflow-x: auto;
        border: 1px solid rgba(209, 213, 219, 0.3);
    }
    
    :global(.dark .katex-display) {
        background-color: rgba(31, 41, 55, 0.3);
        border-color: rgba(75, 85, 99, 0.3);
    }
    
    :global(.katex) {
        font-size: 1.1em;
    }
    
    /* Exercise content styling */
    :global(.prose h2) {
        color: #1f2937;
        border-bottom: 2px solid #e5e7eb;
        padding-bottom: 0.5rem;
        margin-top: 2.5rem;
        margin-bottom: 1.5rem;
    }
    
    :global(.dark .prose h2) {
        color: #f9fafb;
        border-bottom-color: #374151;
    }
    
    :global(.prose h3) {
        color: #374151;
        margin-top: 2rem;
        margin-bottom: 1rem;
    }
    
    :global(.dark .prose h3) {
        color: #e5e7eb;
    }
    
    /* Improve list styling */
    :global(.prose ol) {
        counter-reset: item;
        padding-left: 0;
    }
    
    :global(.prose ol > li) {
        display: block;
        margin-bottom: 1rem;
        padding-left: 2rem;
        position: relative;
    }
    
    :global(.prose ol > li:before) {
        content: counter(item) ".";
        counter-increment: item;
        font-weight: bold;
        color: #3b82f6;
        position: absolute;
        left: 0;
        top: 0;
    }
    
    :global(.dark .prose ol > li:before) {
        color: #60a5fa;
    }
    
    /* Math inline styling */
    :global(.prose .katex) {
        background-color: rgba(243, 244, 246, 0.5);
        padding: 0.2rem 0.4rem;
        border-radius: 0.25rem;
        font-size: 1em;
    }
    
    :global(.dark .prose .katex) {
        background-color: rgba(31, 41, 55, 0.5);
    }
    
    /* Code blocks */
    :global(.prose pre) {
        background-color: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 0.5rem;
        padding: 1rem;
        overflow-x: auto;
    }
    
    :global(.dark .prose pre) {
        background-color: #1e293b;
        border-color: #334155;
    }
</style>
