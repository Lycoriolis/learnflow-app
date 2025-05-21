<script lang="ts">
	import type { LayoutData } from './$types';
	import { page } from '$app/stores';

	export let data: LayoutData;

	// $: console.log('[courses/+layout.svelte] Layout Data:', data);
	// $: console.log('[courses/+layout.svelte] Current page path:', $page.url.pathname);

	function isActiveLesson(lessonPath: string) {
		// Ensure paths are consistently formatted (e.g., leading slash, no trailing slash)
		const currentPagePath = $page.url.pathname.endsWith('/') ? $page.url.pathname.slice(0, -1) : $page.url.pathname;
		const targetPath = lessonPath.endsWith('/') ? lessonPath.slice(0, -1) : lessonPath;
		return currentPagePath === targetPath;
	}
</script>

<div class="course-layout-container">
	{#if data.currentCourseOverview && data.siblingLessons && data.siblingLessons.length > 0}
		<aside class="course-sidebar">
			<div class="sidebar-header">
				<a href={data.currentCourseOverview.contentPath || `/courses/${data.currentCourseId}`} class="course-title-link">
					{data.currentCourseOverview.title || 'Course Menu'}
				</a>
			</div>
			<nav class="lessons-nav">
				<ul>
					{#each data.siblingLessons as lesson (lesson.id)}
						<li>
							<a 
								href={lesson.contentPath} 
								class:active={isActiveLesson(lesson.contentPath)}
								aria-current={isActiveLesson(lesson.contentPath) ? 'page' : undefined}
							>
								{lesson.title || 'Untitled Lesson'}
							</a>
						</li>
					{/each}
				</ul>
			</nav>
		</aside>
	{/if}

	<main class="course-main-content" class:with-sidebar={data.currentCourseOverview && data.siblingLessons && data.siblingLessons.length > 0}>
		<slot /> <!-- Page content (lesson, course overview, etc.) goes here -->
	</main>
</div>

<style>
	/* Ensure global :root variables are available */
	.course-layout-container {
		display: flex;
		max-width: 1400px; /* Wider for layout with sidebar */
		margin: 0 auto;
		font-family: var(--page-font-family, 'Inter', sans-serif);
	}

	.course-sidebar {
		width: 280px; /* Fixed width sidebar */
		flex-shrink: 0;
		background-color: var(--bg-color-light, #F9FAFB);
		border-right: 1px solid var(--border-color-soft, #E5E7EB);
		padding: 1.5rem 0; /* Vertical padding */
		height: calc(100vh - 60px); /* Adjust 60px if you have a fixed header */
		position: sticky;
		top: 60px; /* Adjust if you have a fixed header */
		overflow-y: auto;
	}

	.sidebar-header {
		padding: 0 1.5rem 1rem; /* Padding for header */
		margin-bottom: 1rem;
		border-bottom: 1px solid var(--border-color-soft, #E5E7EB);
	}
	.course-title-link {
		font-family: var(--heading-font-family, 'Lexend Deca', sans-serif);
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--text-color-primary, #111827);
		text-decoration: none;
	}
	.course-title-link:hover {
		color: var(--primary-color, #3B82F6);
	}

	.lessons-nav ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.lessons-nav li a {
		display: block;
		padding: 0.6rem 1.5rem; /* Padding for links */
		text-decoration: none;
		color: var(--text-color-secondary, #4B5563);
		font-size: 0.95rem;
		border-left: 3px solid transparent;
		transition: background-color 0.15s ease-in-out, color 0.15s ease-in-out;
	}
	.lessons-nav li a:hover {
		background-color: #EBF4FF; /* Light primary color tint */
		color: var(--primary-color-hover, #2563EB);
	}
	.lessons-nav li a.active {
		background-color: var(--primary-color-hover, #2563EB); /* Primary color for active */
		color: white;
		font-weight: 500;
		border-left-color: var(--primary-color, #3B82F6);
	}

	.course-main-content {
		flex-grow: 1;
		padding: 2rem;
		min-width: 0; /* Prevents content from overflowing flex container */
	}
	.course-main-content.with-sidebar {
		/* padding-left: 2rem; /* Adjust if sidebar has different padding */
	}

	/* Responsive: On smaller screens, you might want to hide sidebar or make it a drawer */
	@media (max-width: 768px) {
		.course-sidebar {
			display: none; /* Example: hide sidebar on small screens */
			/* Or implement a toggle mechanism */
		}
		.course-main-content.with-sidebar {
			padding-left: 2rem; /* Reset padding if sidebar is hidden */
		}
	}
</style>
