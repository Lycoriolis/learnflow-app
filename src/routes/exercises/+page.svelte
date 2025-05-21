<script lang="ts">
	import type { PageData } from './$types';
	import ExerciseCard from '$lib/components/courses/exercise/ExerciseCard.svelte';

	export let data: PageData;
</script>

<div class="page-container exercises-overview-page">
	<header class="page-header">
		<h1>Explore Exercises</h1>
		<p class="page-subtitle">Challenge yourself and reinforce your learning with our collection of exercises.</p>
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
						{category.title} <span class="count">({category.exerciseCount})</span>
					</a>
				{/each}
			</div>
		</section>
	{/if}

	{#if data.exercises && data.exercises.length > 0}
		<section class="exercise-list-section">
			<h2>Featured Exercises</h2>
			<div class="content-grid">
				{#each data.exercises as exercise (exercise.id)}
					<ExerciseCard {exercise} />
				{/each}
			</div>
		</section>
	{/if}

	{#if (!data.categories || data.categories.length === 0) && (!data.exercises || data.exercises.length === 0) && !data.error}
			<p class="empty-state-message">No exercises available at the moment. Check back soon!</p>
	{/if}
</div>

<style>
	/* Ensure :root variables are defined globally (e.g., in app.html or a global CSS file) */
	/* For example, in a global.css or layout component:
	:root {
		--page-font-family: 'Inter', sans-serif;
		--heading-font-family: 'Lexend Deca', sans-serif;
		--primary-color: #3B82F6; // Example blue
		--text-color-primary: #1F2937;
		--text-color-secondary: #4B5563;
		--bg-color-light: #F9FAFB;
		--border-color-soft: #E5E7EB;
	}
	*/

	.page-container {
		font-family: var(--page-font-family, 'Inter', sans-serif);
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 1.5rem; /* More padding */
	}

	.page-header {
		text-align: center;
		margin-bottom: 3rem;
	}

	.page-header h1 {
		font-family: var(--heading-font-family, 'Lexend Deca', sans-serif);
		font-size: 2.5rem; /* Larger title */
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

	.categories-section h2, .exercise-list-section h2 {
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
		border-radius: 0.5rem; /* 8px */
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
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1.5rem; /* Increased gap */
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
		color: #D9534F; /* Error red */
		background-color: #F2DEDE;
		border-color: #EBCCD1;
	}
</style>