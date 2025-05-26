<script lang="ts">
    import type { PageData } from './$types';
    import ExerciseCard from '$lib/components/exercises/ExerciseCard.svelte';
    import OptimizedExerciseRenderer from '$lib/components/exercises/OptimizedExerciseRenderer.svelte';
    import { onMount, onDestroy } from 'svelte';
    import { page } from '$app/stores';
    import { browser } from '$app/environment';
    import { exerciseProgressService } from '$lib/services/exercises/exerciseProgressService';
    import { exerciseBookmarkService } from '$lib/services/exercises/exerciseBookmarkService';
    import '$lib/styles/exercise-enhanced.css';
    
    export let data: PageData;
    
    $: ({ type, exercise, categoryNode, items, breadcrumbs, relatedExercises, statistics, analytics } = data);
    
    let startTime = Date.now();
    let isBookmarked = false;
    let progress = 0;
    let showTableOfContents = false;
    let tocItems: Array<{id: string, text: string, level: number}> = [];
    let showRelated = false;

    // Reading progress tracking for exercises
    let progressInterval: number;
    
    onMount(() => {
        if (browser && type === 'exercise' && exercise) {
            // Start exercise tracking
            exerciseProgressService.startExercise(exercise.href, {
                href: exercise.href,
                title: exercise.title,
                difficulty: exercise.difficulty,
                category: exercise.category,
                tags: exercise.tags
            });
            
            // Track reading progress
            updateProgress();
            progressInterval = window.setInterval(updateProgress, 1000);
            
            // Generate table of contents
            generateTableOfContents();
            
            // Load bookmark status
            loadBookmarkStatus();
            
            // Track analytics
            trackPageView();
            
            // Add keyboard shortcuts
            document.addEventListener('keydown', handleKeyboardShortcuts);
        }
    });
    
    onDestroy(() => {
        if (browser) {
            if (progressInterval) {
                clearInterval(progressInterval);
            }
            
            if (type === 'exercise' && exercise) {
                // End the session
                exerciseProgressService.endSession(exercise.href);
            }
            
            document.removeEventListener('keydown', handleKeyboardShortcuts);
        }
    });
    
    function updateProgress() {
        if (!browser || !exercise) return;
        
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const currentProgress = scrollHeight > 0 ? Math.min((scrollTop / scrollHeight) * 100, 100) : 0;
        
        progress = Math.round(currentProgress);
        
        // Update progress in service
        exerciseProgressService.updateProgress(exercise.href, progress);
        
        // Check if exercise should be marked as completed
        if (progress >= 95 && !exercise.isCompleted) {
            exerciseProgressService.completeExercise(exercise.href);
        }
    }
    
    function generateTableOfContents() {
        if (!browser || !exercise) return;
        
        setTimeout(() => {
            const headings = document.querySelectorAll('article h2, article h3, article h4');
            tocItems = Array.from(headings).map((heading, index) => {
                const id = `heading-${index}`;
                heading.id = id;
                return {
                    id,
                    text: heading.textContent || '',
                    level: parseInt(heading.tagName.substring(1))
                };
            });
        }, 100);
    }
    
    function loadBookmarkStatus() {
        if (!browser || !exercise) return;
        
        isBookmarked = exerciseBookmarkService.isBookmarked(exercise.href);
    }
    
    function toggleBookmark() {
        if (!browser || !exercise) return;
        
        isBookmarked = exerciseBookmarkService.toggleBookmark(exercise.href, {
            href: exercise.href,
            title: exercise.title,
            difficulty: exercise.difficulty,
            category: exercise.category,
            tags: exercise.tags
        });
    }
    
    function scrollToHeading(id: string) {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    function trackPageView() {
        if (!browser || !analytics) return;
        
        // Simple analytics tracking
        const viewData = {
            contentPath: analytics.contentPath,
            viewTime: analytics.viewTime,
            userAgent: navigator.userAgent,
            timestamp: Date.now()
        };
        
        // Store in localStorage for now (could be sent to analytics service)
        const views = JSON.parse(localStorage.getItem('exercise-views') || '[]');
        views.push(viewData);
        localStorage.setItem('exercise-views', JSON.stringify(views.slice(-100))); // Keep last 100 views
    }
    
    function formatDuration(minutes: number): string {
        if (minutes < 60) {
            return `${minutes}min`;
        }
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}h ${remainingMinutes}min`;
    }
    
    function getDifficultyColor(difficulty: string): string {
        switch (difficulty?.toLowerCase()) {
            case 'beginner':
            case 'easy':
                return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
            case 'intermediate':
            case 'medium':
                return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
            case 'advanced':
            case 'hard':
                return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
            default:
                return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
        }
    }
    
    function handleKeyboardShortcuts(event: KeyboardEvent) {
        // Only handle shortcuts if not in an input field
        if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
            return;
        }
        
        switch (event.key) {
            case 'b':
                if (event.ctrlKey || event.metaKey) {
                    event.preventDefault();
                    toggleBookmark();
                }
                break;
            case 't':
                if (event.ctrlKey || event.metaKey) {
                    event.preventDefault();
                    showTableOfContents = !showTableOfContents;
                }
                break;
            case 'r':
                if (event.ctrlKey || event.metaKey) {
                    event.preventDefault();
                    showRelated = !showRelated;
                }
                break;
            case 'ArrowLeft':
                if (event.altKey) {
                    event.preventDefault();
                    history.back();
                }
                break;
            case 'Escape':
                showTableOfContents = false;
                break;
        }
    }
    
    function markAsCompleted() {
        if (!browser || !exercise) return;
        
        exerciseProgressService.completeExercise(exercise.href);
        progress = 100;
        
        // Show completion notification
        showCompletionNotification();
    }
    
    function showCompletionNotification() {
        // Simple notification - could be enhanced with a toast component
        if (window.confirm('Congratulations! You\'ve completed this exercise. Would you like to view related exercises?')) {
            showRelated = true;
        }
    }
    
    function addNote() {
        if (!browser || !exercise) return;
        
        const note = prompt('Add a note for this exercise:', '');
        if (note) {
            exerciseProgressService.addNote(exercise.href, note);
        }
    }
    
    function shareExercise() {
        if (!browser || !exercise) return;
        
        if (navigator.share) {
            navigator.share({
                title: exercise.title,
                text: exercise.description || `Check out this exercise: ${exercise.title}`,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href).then(() => {
                alert('Link copied to clipboard!');
            });
        }
    }

    // ...existing code...
</script>

<svelte:head>
    {#if type === 'exercise' && exercise}
        <title>{exercise.title} | LearnFlow</title>
        <meta name="description" content={exercise.description || `Exercise: ${exercise.title}`} />
        <meta property="og:title" content={exercise.title} />
        <meta property="og:description" content={exercise.description || `Exercise: ${exercise.title}`} />
        <meta property="og:type" content="article" />
        <meta property="article:section" content="Exercise" />
        {#if exercise.difficulty}
            <meta property="article:tag" content={exercise.difficulty} />
        {/if}
        {#if exercise.tags}
            {#each exercise.tags as tag}
                <meta property="article:tag" content={tag} />
            {/each}
        {/if}
    {:else if type === 'category' && categoryNode}
        <title>{categoryNode.title} | LearnFlow</title>
        <meta name="description" content={categoryNode.description || `Category: ${categoryNode.title}`} />
        <meta property="og:title" content={categoryNode.title} />
        <meta property="og:description" content={categoryNode.description || `Category: ${categoryNode.title}`} />
        <meta property="og:type" content="website" />
    {/if}
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<!-- Reading Progress Bar for Exercises -->
{#if type === 'exercise' && progress > 0}
    <div class="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 z-50">
        <div 
            class="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 ease-out"
            style="width: {progress}%"
            aria-label="Reading progress: {progress}%"
        ></div>
    </div>
{/if}

<div class="container mx-auto px-4 py-8 max-w-7xl">
    <!-- Breadcrumbs -->
    {#if breadcrumbs && breadcrumbs.length > 1}
        <nav class="mb-6" aria-label="Breadcrumb">
            <ol class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                {#each breadcrumbs as crumb, index}
                    <li class="flex items-center">
                        {#if index > 0}
                            <svg class="w-4 h-4 mx-2 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                            </svg>
                        {/if}
                        {#if index === breadcrumbs.length - 1}
                            <span class="font-medium text-gray-900 dark:text-white" aria-current="page">{crumb.title}</span>
                        {:else}
                            <a href={crumb.href} class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-sm">
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
        <div class="exercise-page-layout">
            <!-- Table of Contents (Desktop Sidebar) -->
            {#if tocItems.length > 0}
                <aside class="exercise-toc-sidebar">
                    <div class="sticky top-20 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
                        <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-3">Table of Contents</h3>
                        <nav class="space-y-1">
                            {#each tocItems as item}
                                <button
                                    class="block w-full text-left text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-sm pl-{(item.level - 2) * 3} py-1"
                                    on:click={() => scrollToHeading(item.id)}
                                >
                                    {item.text}
                                </button>
                            {/each}
                        </nav>
                    </div>
                </aside>
            {/if}

            <!-- Main Content -->
            <main class="exercise-main-content">
                <article class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                    <header class="p-8 border-b border-gray-200 dark:border-gray-700">
                        <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                            <div class="flex-1">
                                <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">{exercise.title}</h1>
                                {#if exercise.description}
                                    <p class="text-xl text-gray-600 dark:text-gray-300">{exercise.description}</p>
                                {/if}
                            </div>
                            
                            <!-- Action Buttons -->
                            <div class="flex items-center gap-2">
                                <button
                                    class="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    on:click={toggleBookmark}
                                    aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                                    title={isBookmarked ? 'Remove bookmark (Ctrl+B)' : 'Add bookmark (Ctrl+B)'}
                                >
                                    <svg class="w-5 h-5 {isBookmarked ? 'text-yellow-500 fill-current' : 'text-gray-400'}" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                                    </svg>
                                </button>
                                
                                <button
                                    class="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    on:click={addNote}
                                    aria-label="Add note"
                                    title="Add note"
                                >
                                    <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                    </svg>
                                </button>
                                
                                <button
                                    class="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    on:click={shareExercise}
                                    aria-label="Share exercise"
                                    title="Share exercise"
                                >
                                    <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
                                    </svg>
                                </button>
                                
                                {#if progress >= 95}
                                    <button
                                        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-sm font-medium"
                                        on:click={markAsCompleted}
                                        title="Mark as completed"
                                    >
                                        Complete
                                    </button>
                                {:else if tocItems.length > 0}
                                    <button
                                        class="lg:hidden p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                        on:click={() => showTableOfContents = !showTableOfContents}
                                        aria-label="Toggle table of contents"
                                        title="Table of contents (Ctrl+T)"
                                    >
                                        <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path>
                                        </svg>
                                    </button>
                                {/if}
                            </div>
                        </div>
                        
                        <!-- Exercise Metadata -->
                        <div class="flex flex-wrap gap-3 text-sm">
                            {#if exercise.level}
                                <span class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full">
                                    Level: {exercise.level}
                                </span>
                            {/if}
                            {#if exercise.duration}
                                <span class="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full">
                                    <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    {exercise.duration}
                                </span>
                            {/if}
                            {#if exercise.difficulty}
                                <span class="px-3 py-1 rounded-full {getDifficultyColor(exercise.difficulty)}">
                                    Difficulty: {exercise.difficulty}
                                </span>
                            {/if}
                            {#if exercise.tags && exercise.tags.length > 0}
                                {#each exercise.tags as tag}
                                    <span class="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full">
                                        #{tag}
                                    </span>
                                {/each}
                            {/if}
                        </div>
                        
                        <!-- Progress Bar -->
                        {#if progress > 0}
                            <div class="mt-4">
                                <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    <span>Reading Progress</span>
                                    <span>{progress}%</span>
                                </div>
                                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div 
                                        class="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                                        style="width: {progress}%"
                                    ></div>
                                </div>
                            </div>
                        {/if}
                    </header>

                    <!-- Mobile Table of Contents -->
                    {#if showTableOfContents && tocItems.length > 0}
                        <div class="lg:hidden border-b border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-700">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Table of Contents</h3>
                            <nav class="space-y-2">
                                {#each tocItems as item}
                                    <button
                                        class="block w-full text-left text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-sm pl-{(item.level - 2) * 4}"
                                        on:click={() => {
                                            scrollToHeading(item.id);
                                            showTableOfContents = false;
                                        }}
                                    >
                                        {item.text}
                                    </button>
                                {/each}
                            </nav>
                        </div>
                    {/if}

                    <!-- Exercise Content -->
                    <div class="exercise-content-wrapper">
                        {#if exercise.content}
                            <div class="exercise-content-optimized">
                                <OptimizedExerciseRenderer 
                                    content={exercise.content}
                                    className="full-width-exercise-content"
                                    enableMathRendering={true}
                                    enableInteractivity={true}
                                />
                            </div>
                        {:else}
                            <div class="text-center py-12">
                                <svg class="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                                <p class="text-gray-500 dark:text-gray-400 text-lg">No content available for this exercise.</p>
                            </div>
                        {/if}
                    </div>
                </article>

                <!-- Related Exercises -->
                {#if relatedExercises && relatedExercises.length > 0}
                    <section class="mt-8">
                        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-8">
                            <div class="flex items-center justify-between mb-6">
                                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Related Exercises</h2>
                                <button
                                    class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-sm"
                                    on:click={() => showRelated = !showRelated}
                                >
                                    {showRelated ? 'Hide' : 'Show All'}
                                </button>
                            </div>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6" class:hidden={!showRelated}>
                                {#each relatedExercises as relatedExercise}
                                    <ExerciseCard exercise={relatedExercise} />
                                {/each}
                            </div>
                            
                            {#if !showRelated}
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {#each relatedExercises.slice(0, 2) as relatedExercise}
                                        <ExerciseCard exercise={relatedExercise} />
                                    {/each}
                                </div>
                            {/if}
                        </div>
                    </section>
                {/if}
            </main>
        </div>

    {:else if type === 'category' && categoryNode}
        <!-- Category/Overview Page -->
        <div class="max-w-6xl mx-auto">
            <header class="mb-8">
                <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">{categoryNode.title}</h1>
                {#if categoryNode.description}
                    <p class="text-xl text-gray-600 dark:text-gray-300 mb-6">{categoryNode.description}</p>
                {/if}
                
                <!-- Category Statistics -->
                {#if statistics}
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <!-- Total Exercises -->
                        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                            <div class="flex items-center">
                                <div class="p-3 rounded-lg bg-blue-100 dark:bg-blue-900">
                                    <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                    </svg>
                                </div>
                                <div class="ml-4">
                                    <p class="text-2xl font-bold text-gray-900 dark:text-white">{statistics.totalExercises}</p>
                                    <p class="text-sm text-gray-500 dark:text-gray-400">Total Exercises</p>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Estimated Duration -->
                        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                            <div class="flex items-center">
                                <div class="p-3 rounded-lg bg-green-100 dark:bg-green-900">
                                    <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                                <div class="ml-4">
                                    <p class="text-2xl font-bold text-gray-900 dark:text-white">{formatDuration(statistics.estimatedDuration)}</p>
                                    <p class="text-sm text-gray-500 dark:text-gray-400">Total Duration</p>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Difficulty Distribution -->
                        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                            <div class="flex items-center mb-3">
                                <div class="p-3 rounded-lg bg-purple-100 dark:bg-purple-900">
                                    <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                    </svg>
                                </div>
                                <div class="ml-4">
                                    <p class="text-lg font-semibold text-gray-900 dark:text-white">Difficulty</p>
                                    <p class="text-sm text-gray-500 dark:text-gray-400">Distribution</p>
                                </div>
                            </div>
                            <div class="space-y-2">
                                {#each Object.entries(statistics.difficultyDistribution) as [difficulty, count]}
                                    <div class="flex items-center justify-between text-sm">
                                        <span class="text-gray-600 dark:text-gray-300 capitalize">{difficulty}</span>
                                        <span class="font-medium text-gray-900 dark:text-white">{count}</span>
                                    </div>
                                {/each}
                            </div>
                        </div>
                    </div>
                {/if}
            </header>

            <!-- Category Content -->
            {#if categoryNode.content}
                <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-8 mb-8">
                    <div class="prose prose-lg dark:prose-invert max-w-none">
                        <OptimizedExerciseRenderer content={categoryNode.content} className="category-content" />
                    </div>
                </div>
            {/if}

            <!-- Child Items -->
            {#if items && items.length > 0}
                <section>
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                            {categoryNode.childContentType === 'lesson' ? 'Lessons' : 'Exercises'}
                        </h2>
                        <div class="text-sm text-gray-500 dark:text-gray-400">
                            {items.length} {items.length === 1 ? 'item' : 'items'}
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {#each items as item}
                            <ExerciseCard exercise={item} />
                        {/each}
                    </div>
                </section>
            {:else}
                <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-12 text-center">
                    <svg class="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No Content Available</h3>
                    <p class="text-gray-500 dark:text-gray-400 mb-6">No exercises or sub-categories found in this section.</p>
                    <a 
                        href="/exercises" 
                        class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                        </svg>
                        Browse All Exercises
                    </a>
                </div>
            {/if}
        </div>

    {:else}
        <!-- Error state -->
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-12 text-center">
            <svg class="w-20 h-20 text-gray-400 dark:text-gray-500 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Content Not Found</h1>
            <p class="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
                The requested content could not be found. It may have been moved or removed.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                    href="/exercises" 
                    class="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    Return to Exercises
                </a>
                <button 
                    class="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    on:click={() => history.back()}
                >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 17l-5-5m0 0l5-5m-5 5h12"></path>
                    </svg>
                    Go Back
                </button>
            </div>
        </div>
    {/if}
</div>

<style>
    /* New Exercise Page Layout System */
    .exercise-page-layout {
        display: grid;
        grid-template-columns: 1fr;
        gap: 2rem;
        max-width: 100%;
        width: 100%;
    }
    
    /* Desktop layout with sidebar */
    @media (min-width: 1024px) {
        .exercise-page-layout {
            grid-template-columns: 280px 1fr;
            gap: 2rem;
        }
    }
    
    .exercise-toc-sidebar {
        display: none;
    }
    
    @media (min-width: 1024px) {
        .exercise-toc-sidebar {
            display: block;
        }
    }
    
    .exercise-main-content {
        min-width: 0; /* Allow content to shrink */
        width: 100%;
    }
    
    /* Exercise content container styling */
    .exercise-content-wrapper {
        padding: 2rem;
        background-color: #ffffff;
        border-radius: 0.5rem;
        min-height: 400px;
        width: 100%;
        max-width: 100%;
    }
    
    .exercise-content-optimized {
        width: 100%;
        max-width: none; /* Remove max-width constraints */
    }
    
    :global(.dark) .exercise-content-wrapper {
        background-color: #1f2937;
    }
    
    /* Full width exercise content */
    .exercise-content-wrapper :global(.full-width-exercise-content) {
        max-width: 100% !important;
        width: 100% !important;
    }
    
    /* Remove prose constraints for exercise content */
    .exercise-content-wrapper :global(.full-width-exercise-content) :global(.prose) {
        max-width: none !important;
    }
    
    /* Enhanced responsive typography for exercises */
    @media (max-width: 768px) {
        .exercise-content-wrapper {
            padding: 1.5rem;
        }
        
        .exercise-page-layout {
            gap: 1rem;
        }
    }
    
    @media (max-width: 640px) {
        .exercise-content-wrapper {
            padding: 1rem;
        }
    }
    
    /* Exercise content specific enhancements */
    .exercise-content-wrapper :global(.exercise-item) {
        margin-bottom: 2rem;
        padding: 1.5rem;
        background-color: #f8fafc;
        border-radius: 0.5rem;
        border-left: 4px solid #3b82f6;
    }
    
    :global(.dark) .exercise-content-wrapper :global(.exercise-item) {
        background-color: #374151;
        border-left-color: #60a5fa;
    }
    
    /* Math content spacing improvements */
    .exercise-content-wrapper :global(.katex-display) {
        margin: 1.5rem 0;
        text-align: center;
    }
    
    .exercise-content-wrapper :global(.math-block) {
        margin: 1.5rem 0;
        padding: 1rem;
        background-color: #f1f5f9;
        border-radius: 0.375rem;
        overflow-x: auto;
    }
    
    :global(.dark) .exercise-content-wrapper :global(.math-block) {
        background-color: #334155;
    }
    
    /* Code block improvements for wide content */
    .exercise-content-wrapper :global(pre) {
        overflow-x: auto;
        max-width: 100%;
        margin: 1.5rem 0;
        padding: 1.5rem;
        background-color: #1e293b;
        border-radius: 0.5rem;
        line-height: 1.6;
    }
    
    .exercise-content-wrapper :global(pre code) {
        white-space: pre;
        word-wrap: normal;
    }
    
    /* Table improvements for wide tables */
    .exercise-content-wrapper :global(table) {
        width: 100%;
        max-width: 100%;
        overflow-x: auto;
        display: block;
        white-space: nowrap;
    }
    
    .exercise-content-wrapper :global(thead),
    .exercise-content-wrapper :global(tbody),
    .exercise-content-wrapper :global(tr) {
        display: table;
        width: 100%;
        table-layout: auto;
    }
    
    /* Enhanced headings for better structure */
    .exercise-content-wrapper :global(h1),
    .exercise-content-wrapper :global(h2),
    .exercise-content-wrapper :global(h3) {
        margin-top: 2rem;
        margin-bottom: 1rem;
        font-weight: 700;
        line-height: 1.2;
    }
    
    .exercise-content-wrapper :global(h1) {
        font-size: 2.25rem;
        color: #1f2937;
        border-bottom: 2px solid #e5e7eb;
        padding-bottom: 0.5rem;
    }
    
    .exercise-content-wrapper :global(h2) {
        font-size: 1.875rem;
        color: #374151;
    }
    
    .exercise-content-wrapper :global(h3) {
        font-size: 1.5rem;
        color: #4b5563;
    }
    
    :global(.dark) .exercise-content-wrapper :global(h1) {
        color: #f9fafb;
        border-bottom-color: #4b5563;
    }
    
    :global(.dark) .exercise-content-wrapper :global(h2) {
        color: #e5e7eb;
    }
    
    :global(.dark) .exercise-content-wrapper :global(h3) {
        color: #d1d5db;
    }
    
    /* Focus improvements for accessibility */
    .exercise-content-wrapper:focus-within {
        outline: 2px solid #3b82f6;
        outline-offset: 2px;
    }
    
    /* Print styles for exercises */
    @media print {
        .exercise-content-wrapper {
            background-color: transparent !important;
            box-shadow: none !important;
            border: 1px solid #ccc !important;
            padding: 1rem !important;
        }
        
        .exercise-toc-sidebar {
            display: none !important;
        }
        
        .exercise-page-layout {
            grid-template-columns: 1fr !important;
        }
        
        /* Hide interactive elements when printing */
        .reading-progress,
        .action-buttons,
        .keyboard-shortcuts {
            display: none !important;
        }
    }
</style>
