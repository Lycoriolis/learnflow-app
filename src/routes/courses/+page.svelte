<script lang="ts">
	import type { PageData } from './$types';
	import CourseCard from '$lib/components/courses/CourseCard.svelte';

	export let data: PageData;
</script>

<div class="page-container courses-overview-page">
	<header class="page-header">
		<h1>Discover Our Courses</h1>
		<p class="page-subtitle">Expand your knowledge with our comprehensive range of courses, designed for all skill levels.</p>
		{#if data.error}
			<p class="error-message">{data.error}</p>
		{/if}
	</header>

	{#if data.categories && data.categories.length > 0}
		<section class="categories-section">
			<h2>Filter by Category</h2>
			<div class="categories-grid">
				{#each data.categories as category (category.id)}
					<a href={category.path} class="category-button">
						{category.title} <span class="count">({category.courseCount})</span>
					</a>
				{/each}
			</div>
		</section>
	{/if}

	{#if data.courses && data.courses.length > 0}
		<section class="course-list-section">
			<h2>Available Courses</h2>
			<div class="content-grid">
				{#each data.courses as course (course.id)}
					<CourseCard {course} />
				{/each}
			</div>
		</section>
	{/if}

	{#if (!data.categories || data.categories.length === 0) && (!data.courses || data.courses.length === 0) && !data.error}
			<p class="empty-state-message">No courses available at the moment. Please check back soon!</p>
	{/if}
</div>

<style>
	/* Styles from exercises/+page.svelte are largely reusable. */
	/* Ensure :root variables are defined globally. */
	/* For brevity, assuming styles are similar or inherited. */
	/* If specific adjustments are needed for courses page, add them here. */
	/* Copy relevant styles from exercises/+page.svelte if not using global CSS for page layout */
	.page-container {
		font-family: var(--page-font-family, 'Inter', sans-serif);
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 1.5rem;
	}

	.page-header {
		text-align: center;
		margin-bottom: 3rem;
	}

	.page-header h1 {
		font-family: var(--heading-font-family, 'Lexend Deca', sans-serif);
		font-size: 2.5rem;
		font-weight: 700;
		color: var(--text-color-primary, #1F2937);
		margin-bottom: 0.5rem;
	}

	.page-subtitle {
		font-size: 1.125rem;
		color: var(--text-color-secondary, #4B5563);
		max-width: 600px;
		margin: 0 auto 1rem;
		line-height: 1.6;
	}

	.categories-section {
		margin-bottom: 3rem;
	}

	.categories-section h2, .course-list-section h2 { /* Corrected from .exercise-list-section */
		font-family: var(--heading-font-family, 'Lexend Deca', sans-serif);
		font-size: 1.75rem;
		font-weight: 600;
		color: var(--text-color-primary, #1F2937);
		margin-bottom: 1.5rem;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid var(--primary-color, #3B82F6);
		display: inline-block;
	}
	
	.categories-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.category-button {
		background-color: var(--bg-color-light, #F9FAFB);
		color: var(--primary-color, #3B82F6);
		border: 1px solid var(--border-color-soft, #E5E7EB);
		padding: 0.6rem 1.2rem;
		border-radius: 0.5rem;
		text-decoration: none;
		font-weight: 500;
		font-size: 0.9rem;
		transition: all 0.2s ease-in-out;
	}
	.category-button:hover {
		background-color: var(--primary-color, #3B82F6);
		color: white;
		border-color: var(--primary-color, #3B82F6);
		transform: translateY(-2px);
		box-shadow: 0 4px 10px rgba(0,0,0,0.1);
	}
	.category-button .count {
		font-size: 0.8em;
		opacity: 0.8;
		margin-left: 0.3rem;
	}

	.content-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); /* Slightly wider min for course cards */
		gap: 1.75rem; /* Slightly larger gap */
	}

	.error-message, .empty-state-message {
		text-align: center;
		padding: 2rem;
		background-color: var(--bg-color-light, #F9FAFB);
		border: 1px dashed var(--border-color-soft, #E5E7EB);
		border-radius: 0.5rem;
		color: var(--text-color-secondary, #4B5563);
	}
	.error-message {
		color: #D9534F;
		background-color: #F2DEDE;
		border-color: #EBCCD1;
	}
</style>