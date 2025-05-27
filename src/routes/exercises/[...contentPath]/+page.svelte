<script lang="ts">
    import type { PageData } from './$types';
    import type { ServerContentNode } from '$lib/server/contentService';
    import ExerciseCard from '$lib/components/exercises/ExerciseCard.svelte';
    import OptimizedExerciseRenderer from '$lib/components/exercises/OptimizedExerciseRenderer.svelte';
    import { onMount, onDestroy } from 'svelte';
    import { page } from '$app/stores';
    import { browser } from '$app/environment';
    import { exerciseProgressService } from '$lib/services/exercises/exerciseProgressService';
    import { exerciseBookmarkService } from '$lib/services/exercises/exerciseBookmarkService';
    import '$lib/styles/exercise-enhanced.css';
    
    export let data: PageData;
    
    // Utility function to ensure data conforms to ServerContentNode interface
    function ensureServerContentNode(item: any): ServerContentNode {
        if (!item) {
            return {
                id: 'unknown',
                title: 'Unknown Exercise',
                description: '',
                contentPath: '',
                filePath: '',
                rawMdxContent: '',
                itemType: 'exercise',
                contentType: 'exercise',
                order: 0,
                children: []
            } as ServerContentNode;
        }
        
        return {
            id: item.id || item.href || 'unknown',
            title: item.title || 'Untitled',
            description: item.description || '',
            contentPath: item.contentPath || item.href || '',
            filePath: item.filePath || '',
            rawMdxContent: item.rawMdxContent || item.content || '',
            itemType: item.itemType || 'exercise',
            contentType: item.contentType || 'exercise',
            order: item.order || 0,
            difficulty: item.difficulty,
            estimatedTime: item.estimatedTime,
            category: item.category,
            tags: item.tags || [],
            featured: item.featured || false,
            children: item.children || [],
            ...item // Spread the rest of the properties
        } as ServerContentNode;
    }
    
    $: ({ type, exercise, categoryNode, items, breadcrumbs, relatedExercises, statistics, analytics } = data);
    
   
    
    let startTime = Date.now();
    let isBookmarked = false;
    let progress = 0;
    let showTableOfContents = false;
    let tocItems: Array<{id: string, text: string, level: number}> = [];
    let showRelated = false;
    let showFloatingActions = false;
    let isScrolled = false;
    let readingTime = 0;
    let estimatedReadTime = 0;
    let showCompletionAnimation = false;
    let darkMode = false;
    let currentSection = '';
    let showNotification = false;
    let notificationMessage = '';
    let notificationType: 'success' | 'info' | 'warning' | 'error' = 'info';

    // Reading progress tracking for exercises
    let progressInterval: number;
    let readingTimeInterval: number;
    
    onMount(() => {
        if (browser && type === 'exercise' && exercise) {
            // Initialize dark mode detection
            darkMode = document.documentElement.classList.contains('dark');
            
            // Calculate estimated reading time
            estimatedReadTime = calculateReadingTime(exercise.content || '');
            
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
            
            // Track reading time
            readingTimeInterval = window.setInterval(() => {
                readingTime = Math.floor((Date.now() - startTime) / 1000);
            }, 1000);
            
            // Generate table of contents
            generateTableOfContents();
            
            // Load bookmark status
            loadBookmarkStatus();
            
            // Track analytics
            trackPageView();
            
            // Add scroll listener for floating actions
            window.addEventListener('scroll', handleScroll);
            
            // Add keyboard shortcuts
            document.addEventListener('keydown', handleKeyboardShortcuts);
            
            // Add intersection observer for section tracking
            setupSectionObserver();
        }
    });
    
    onDestroy(() => {
        if (browser) {
            if (progressInterval) {
                clearInterval(progressInterval);
            }
            
            if (readingTimeInterval) {
                clearInterval(readingTimeInterval);
            }
            
            if (type === 'exercise' && exercise) {
                // End the session
                exerciseProgressService.endSession(exercise.href);
            }
            
            window.removeEventListener('scroll', handleScroll);
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
        
        showNotificationMessage(
            isBookmarked ? 'Exercise bookmarked!' : 'Bookmark removed',
            'success'
        );
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
        // Enhanced completion animation
        showCompletionAnimation = true;
        showNotification = true;
        notificationMessage = 'Congratulations! Exercise completed successfully!';
        notificationType = 'success';
        
        setTimeout(() => {
            showCompletionAnimation = false;
            if (window.confirm('Congratulations! You\'ve completed this exercise. Would you like to view related exercises?')) {
                showRelated = true;
            }
            hideNotification();
        }, 2000);
    }
    
    function calculateReadingTime(content: string): number {
        // Estimate reading time based on word count (average 200 words per minute)
        const words = content.split(/\s+/).length;
        return Math.ceil(words / 200);
    }
    
    function handleScroll() {
        const scrollTop = window.pageYOffset;
        isScrolled = scrollTop > 100;
        showFloatingActions = scrollTop > 300;
    }
    
    function setupSectionObserver() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        currentSection = entry.target.textContent?.slice(0, 50) || '';
                    }
                });
            },
            { threshold: 0.5 }
        );
        
        setTimeout(() => {
            const headings = document.querySelectorAll('article h2, article h3');
            headings.forEach(heading => observer.observe(heading));
        }, 500);
    }
    
    function showNotificationMessage(message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') {
        notificationMessage = message;
        notificationType = type;
        showNotification = true;
        setTimeout(hideNotification, 3000);
    }
    
    function hideNotification() {
        showNotification = false;
    }
    
    function copyLink() {
        if (!browser) return;
        
        navigator.clipboard.writeText(window.location.href).then(() => {
            showNotificationMessage('Link copied to clipboard!', 'success');
        }).catch(() => {
            showNotificationMessage('Failed to copy link', 'error');
        });
    }
    
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            showNotificationMessage('Entered fullscreen mode', 'info');
        } else {
            document.exitFullscreen();
            showNotificationMessage('Exited fullscreen mode', 'info');
        }
    }
    
    function jumpToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    function jumpToBottom() {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
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

<!-- Enhanced Reading Progress Bar for Exercises -->
{#if type === 'exercise' && progress > 0}
    <div class="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 z-50 transition-opacity duration-300" class:opacity-100={isScrolled} class:opacity-0={!isScrolled}>
        <div 
            class="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 ease-out shadow-lg"
            style="width: {progress}%"
            aria-label="Reading progress: {progress}%"
        ></div>
    </div>
{/if}

<!-- Floating Action Buttons -->
{#if type === 'exercise' && showFloatingActions}
    <div class="fixed right-4 bottom-4 z-40 flex flex-col gap-2 transition-all duration-300 transform" class:translate-y-0={showFloatingActions} class:translate-y-16={!showFloatingActions}>
        <!-- Bookmark Button -->
        <button
            class="w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200 hover:scale-110 flex items-center justify-center group"
            on:click={toggleBookmark}
            aria-label="Toggle bookmark"
        >
            <svg class="w-5 h-5 transition-colors duration-200 {isBookmarked ? 'text-yellow-500 fill-current' : 'text-gray-500 group-hover:text-yellow-500'}" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
            </svg>
        </button>
        
        <!-- Table of Contents Button -->
        {#if tocItems.length > 0}
            <button
                class="w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200 hover:scale-110 flex items-center justify-center group"
                on:click={() => showTableOfContents = !showTableOfContents}
                aria-label="Toggle table of contents"
            >
                <svg class="w-5 h-5 text-gray-500 group-hover:text-blue-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path>
                </svg>
            </button>
        {/if}
        
        <!-- Back to Top Button -->
        <button
            class="w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200 hover:scale-110 flex items-center justify-center group"
            on:click={jumpToTop}
            aria-label="Back to top"
        >
            <svg class="w-5 h-5 text-gray-500 group-hover:text-green-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
            </svg>
        </button>
    </div>
{/if}

<!-- Enhanced Notification System -->
{#if showNotification}
    <div class="fixed top-20 right-4 z-50 max-w-sm w-full transition-all duration-300 transform animate-slide-in-right">
        <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 flex items-center gap-3">
            {#if notificationType === 'success'}
                <div class="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
            {:else if notificationType === 'error'}
                <div class="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                    <svg class="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </div>
            {:else}
                <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
            {/if}
            
            <p class="text-sm text-gray-900 dark:text-white flex-1">{notificationMessage}</p>
            
            <button
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                on:click={hideNotification}
                aria-label="Close notification"
            >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    </div>
{/if}

<!-- Completion Animation Overlay -->
{#if showCompletionAnimation}
    <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center animate-fade-in">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md mx-4 text-center animate-scale-in">
            <div class="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Congratulations!</h3>
            <p class="text-gray-600 dark:text-gray-300">You've completed this exercise successfully!</p>
        </div>
    </div>
{/if}

<!-- Enhanced Container with Dynamic Background -->
<div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
    <div class="container mx-auto px-4 py-8 max-w-7xl relative">
        <!-- Enhanced Breadcrumbs -->
        {#if breadcrumbs && breadcrumbs.length > 1}
            <nav class="mb-8" aria-label="Breadcrumb">
                <ol class="flex items-center space-x-2 text-sm bg-white dark:bg-gray-800 rounded-full px-4 py-2 shadow-sm border border-gray-200 dark:border-gray-700">
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
                                <a href={crumb.href} class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-sm px-1">
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
                <!-- Table of Contents Sidebar -->
                {#if tocItems.length > 0}
                    <aside class="exercise-toc-sidebar">
                        <div class="sticky top-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
                            <div class="flex items-center justify-between mb-4">
                                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Table of Contents</h3>
                                <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                            </div>
                            <nav class="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
                                {#each tocItems as item}
                                    <button
                                        class="block w-full text-left text-sm transition-all duration-200 rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 {item.id === currentSection ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-l-2 border-blue-500' : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'}"
                                        style="padding-left: {(item.level - 1) * 12 + 12}px"
                                        on:click={() => scrollToHeading(item.id)}
                                    >
                                        <span class="block truncate">{item.text}</span>
                                    </button>
                                {/each}
                            </nav>
                        </div>
                    </aside>
                {/if}

                <!-- Main Content -->
                <main class="exercise-main-content">
                    <article class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
                        <header class="relative p-8 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800">
                            <!-- Decorative Background Pattern -->
                            <div class="absolute inset-0 opacity-5">
                                <div class="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600"></div>
                                <svg class="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                                    <defs>
                                        <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" stroke-width="0.5"/>
                                        </pattern>
                                    </defs>
                                    <rect width="100" height="100" fill="url(#grid)" />
                                </svg>
                            </div>
                            
                            <div class="relative z-10">
                                <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
                                    <div class="flex-1">
                                        <div class="flex items-center gap-3 mb-4">
                                            <div class="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                                            <span class="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">Exercise</span>
                                        </div>
                                        <h1 class="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                                            {exercise.title}
                                        </h1>
                                        {#if exercise.description}
                                            <p class="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">{exercise.description}</p>
                                        {/if}
                                    </div>
                                    
                                    <!-- Action Buttons -->
                                    <div class="flex flex-wrap items-center gap-3">
                                        <button
                                            class="group relative p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                            on:click={toggleBookmark}
                                            aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                                        >
                                            <svg class="w-5 h-5 transition-all duration-200 {isBookmarked ? 'text-yellow-500 fill-current scale-110' : 'text-gray-400 group-hover:text-yellow-500 group-hover:scale-110'}" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                                            </svg>
                                        </button>
                                        
                                        <button
                                            class="group relative p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                            on:click={addNote}
                                            aria-label="Add note"
                                        >
                                            <svg class="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                            </svg>
                                        </button>
                                        
                                        <button
                                            class="group relative p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                            on:click={copyLink}
                                            aria-label="Copy link"
                                        >
                                            <svg class="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
                                            </svg>
                                        </button>
                                        
                                        {#if progress >= 95}
                                            <button
                                                class="relative px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-sm font-semibold"
                                                on:click={markAsCompleted}
                                            >
                                                <span class="relative z-10">Complete Exercise</span>
                                                <div class="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl opacity-0 hover:opacity-20 transition-opacity duration-200"></div>
                                            </button>
                                        {:else if tocItems.length > 0}
                                            <button
                                                class="lg:hidden group relative p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                                on:click={() => showTableOfContents = !showTableOfContents}
                                                aria-label="Toggle table of contents"
                                            >
                                                <svg class="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path>
                                                </svg>
                                            </button>
                                        {/if}
                                    </div>
                                </div>
                                
                                <!-- Exercise Metadata -->
                                <div class="flex flex-wrap gap-3 text-sm">
                                    {#if exercise.level}
                                        <span class="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full font-medium transition-all duration-200 hover:shadow-md hover:scale-105">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                            </svg>
                                            Level: {exercise.level}
                                        </span>
                                    {/if}
                                    {#if exercise.duration}
                                        <span class="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 text-green-800 dark:text-green-200 px-4 py-2 rounded-full font-medium transition-all duration-200 hover:shadow-md hover:scale-105">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                            {exercise.duration}
                                        </span>
                                    {/if}
                                    {#if estimatedReadTime > 0}
                                        <span class="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 text-purple-800 dark:text-purple-200 px-4 py-2 rounded-full font-medium transition-all duration-200 hover:shadow-md hover:scale-105">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                                            </svg>
                                            ~{estimatedReadTime} min read
                                        </span>
                                    {/if}
                                    {#if exercise.difficulty}
                                        <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-200 hover:shadow-md hover:scale-105 {getDifficultyColor(exercise.difficulty)}">
                                            <div class="w-2 h-2 rounded-full bg-current"></div>
                                            {exercise.difficulty}
                                        </span>
                                    {/if}
                                    {#if exercise.tags && exercise.tags.length > 0}
                                        {#each exercise.tags as tag}
                                            <span class="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-full font-medium transition-all duration-200 hover:shadow-md hover:scale-105 hover:bg-gray-200 dark:hover:bg-gray-600">
                                                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path>
                                                </svg>
                                                {tag}
                                            </span>
                                        {/each}
                                    {/if}
                                </div>
                                
                                <!-- Progress Section -->
                                {#if progress > 0}
                                    <div class="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                                        <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-3">
                                            <div class="flex items-center gap-2">
                                                <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                                </svg>
                                                <span class="font-medium">Reading Progress</span>
                                            </div>
                                            <div class="flex items-center gap-4">
                                                <span class="font-semibold text-gray-900 dark:text-white">{progress}%</span>
                                                {#if readingTime > 0}
                                                    <span class="text-xs">
                                                        <svg class="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                        </svg>
                                                        {Math.floor(readingTime / 60)}:{(readingTime % 60).toString().padStart(2, '0')}
                                                    </span>
                                                {/if}
                                            </div>
                                        </div>
                                        <div class="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                                            <div 
                                                class="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out"
                                                style="width: {progress}%"
                                            >
                                                <div class="absolute inset-0 bg-white/20"></div>
                                            </div>
                                        </div>
                                    </div>
                                {/if}
                            </div>
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
                                        <ExerciseCard exercise={ensureServerContentNode(relatedExercise)} />
                                    {/each}
                                </div>
                                
                                {#if !showRelated}
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {#each relatedExercises.slice(0, 2) as relatedExercise}
                                            <ExerciseCard exercise={ensureServerContentNode(relatedExercise)} />
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
                                <ExerciseCard exercise={ensureServerContentNode(item)} />
                            {/each}
                        </div>
                    </section>
                {:else}
                    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-12 text-center">
                        <svg class="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No Content Available</h3>
                        <p class="text-gray-500 dark:text-gray-400 mb-6 text-lg">No exercises or sub-categories found in this section.</p>
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
            <div class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl p-12 text-center">
                <div class="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900 dark:to-red-800 rounded-full flex items-center justify-center">
                    <svg class="w-10 h-10 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                </div>
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Content Not Found</h1>
                <p class="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
                    The requested content could not be found. It may have been moved or removed.
                </p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <a 
                        href="/exercises" 
                        class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                        </svg>
                        Return to Exercises
                    </a>
                    <button 
                        class="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
</div>

<style>
    /* Exercise Page Layout System */
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
            grid-template-columns: 320px 1fr;
            gap: 2.5rem;
        }
    }
    
    /* Sidebar */
    .exercise-toc-sidebar {
        display: none;
    }
    
    @media (min-width: 1024px) {
        .exercise-toc-sidebar {
            display: block;
        }
    }
    
    .exercise-main-content {
        min-width: 0;
        width: 100%;
    }
    
    /* Custom Scrollbar */
    .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 3px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #94a3b8;
    }
    
    :global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #475569;
    }
    
    :global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #64748b;
    }
    
    /* Exercise Content Container */
    .exercise-content-wrapper {
        padding: 3rem;
        background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
        border-radius: 1rem;
        min-height: 400px;
        width: 100%;
        max-width: 100%;
        position: relative;
        overflow: hidden;
    }
    
    .exercise-content-wrapper::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
    }
    
    .exercise-content-optimized {
        width: 100%;
        max-width: none;
        position: relative;
        z-index: 10;
    }
    
    :global(.dark) .exercise-content-wrapper {
        background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
    }
    
    :global(.dark) .exercise-content-wrapper::before {
        background: linear-gradient(90deg, transparent, #374151, transparent);
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
    
    /* Responsive typography for exercises */
    @media (max-width: 768px) {
        .exercise-content-wrapper {
            padding: 2rem;
        }
        
        .exercise-page-layout {
            gap: 1.5rem;
        }
    }
    
    @media (max-width: 640px) {
        .exercise-content-wrapper {
            padding: 1.5rem;
        }
    }
</style>
