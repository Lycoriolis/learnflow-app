<script lang="ts">
	import type { PageData } from './$types';
	import ExerciseCard from '$lib/components/courses/exercise/ExerciseCard.svelte';
	import { marked } from 'marked'; // Or your MDX rendering solution
	import UnifiedRenderer from '$lib/components/UnifiedRenderer.svelte';

	export let data: PageData;

	// $: console.log('[slug] page data:', data); // For debugging
</script>

{#if data.type === 'category'}
	<div class="category-view">
		<header>
			<h1>Category: {data.categoryDetails?.title || 'Unknown Category'}</h1>
		</header>
		{#if data.exercises && data.exercises.length > 0}
			<div class="exercise-list">
				{#each data.exercises as exercise (exercise.id)}
					<ExerciseCard {exercise} />
				{/each}
			</div>
		{:else}
			<p>No exercises found in this category.</p>
		{/if}

		<!-- Optional: Navigation to other categories -->
		{#if data.allCategories && data.allCategories.length > 1}
			<nav class="other-categories">
				<h3>Other Categories:</h3>
				<ul>
					{#each data.allCategories as cat (cat.id)}
						{#if cat.id !== data.categoryDetails?.id}
							<li><a href="/exercises/{cat.id}">{cat.title}</a></li>
						{/if}
					{/each}
				</ul>
			</nav>
		{/if}
	</div>
{:else if data.type === 'exercise'}
	<article class="exercise-view">
		{#if data.exerciseData}
			<header>
				<h1>{data.exerciseData.title || 'Untitled Exercise'}</h1>
				<p class="meta">
					Category: {data.exerciseData.category || 'N/A'} |
					Difficulty: {data.exerciseData.difficulty || 'N/A'} |
					Estimated Time: {data.exerciseData.estimatedTime || 'N/A'}
				</p>
				{#if data.exerciseData.tags && data.exerciseData.tags.length}
					<div class="tags">
						Tags:
						{#each data.exerciseData.tags as tag}
							<span class="tag">{tag}</span>
						{/each}
					</div>
				{/if}
			</header>

			<section class="description">
				<h2>Description</h2>
				<p>{data.exerciseData.description || 'No description provided.'}</p>
			</section>
			
			<section class="content">
				<h2>Exercise Content</h2>
				{#if data.exerciseData.rawMdxContent}
					<UnifiedRenderer content={data.exerciseData.rawMdxContent} type="exercise" />
				{:else}
					<p>Exercise content could not be loaded.</p>
				{/if}
			</section>
		{:else}
			<p>Exercise details could not be loaded.</p>
		{/if}
	</article>
{:else}
	<!-- This case should ideally be handled by the 404 from the server load function -->
	<p>Loading content or content not found...</p>
{/if}

<style>
	.category-view, .exercise-view {
		max-width: 900px;
		margin: 2rem auto;
		padding: 1rem;
	}
	.exercise-list {
		margin-top: 1.5rem;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1rem;
	}
	.meta {
		font-size: 0.9em;
		color: #555;
		margin-bottom: 1rem;
	}
	.tags {
		margin-bottom: 1rem;
	}
	.tag {
		background-color: #f0f0f0;
		padding: 0.2rem 0.5rem;
		border-radius: 3px;
		font-size: 0.8em;
		margin-right: 0.3rem;
	}
	.description, .content {
		margin-top: 2rem;
	}
	.other-categories {
		margin-top: 2rem;
		padding-top: 1rem;
		border-top: 1px solid #eee;
	}
	.other-categories h3 {
		margin-bottom: 0.5rem;
	}
	.other-categories ul {
		list-style: none;
		padding: 0;
	}
	.other-categories li {
		margin-bottom: 0.25rem;
	}
</style>
