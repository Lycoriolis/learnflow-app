<script lang="ts">
	export let exercise: any; // Replace 'any' with a specific Exercise type/interface later
</script>

<a href={exercise.contentPath || '#'} class="exercise-card-link">
	<article class="exercise-card">
		<div class="card-header">
			<!-- Optional: Icon for exercise type or category -->
			<!-- <span class="category-icon">🏋️</span> -->
			<h3 class="card-title">{exercise.title || 'Untitled Exercise'}</h3>
		</div>
		<p class="card-description">{exercise.description || 'No description available.'}</p>
		<div class="card-meta">
			{#if exercise.category}
				<span class="meta-item category-tag">{exercise.category}</span>
			{/if}
			{#if exercise.difficulty}
				<span class="meta-item difficulty-tag difficulty-{String(exercise.difficulty).toLowerCase()}">
					{exercise.difficulty}
				</span>
			{/if}
			{#if exercise.estimatedTime}
				<span class="meta-item time-tag">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="icon"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clip-rule="evenodd" /></svg>
					{exercise.estimatedTime}
				</span>
			{/if}
		</div>
		{#if exercise.tags && exercise.tags.length > 0}
			<div class="card-tags">
				{#each exercise.tags as tag}
					<span class="tag">{tag}</span>
				{/each}
			</div>
		{/if}
	</article>
</a>

<style>
	/* Using :root from CourseCard.svelte or define globally in a layout/app.css */
	/* For brevity, assuming fonts and common vars are globally available or inherited */
	/* If not, copy the :root block from CourseCard.svelte here or to a global CSS file */
	:root { /* Re-declare for standalone demo, ideally these are global */
		--card-font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
		--card-title-font-family: 'Lexend Deca', var(--card-font-family);
		--card-bg: #ffffff;
		--card-border-color: #e2e8f0;
		--card-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
		--card-hover-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
		--card-title-color: #1a202c;
		--card-text-color: #4a5568;
		--card-meta-color: #718096;
		--tag-bg: #edf2f7;
		--tag-text-color: #4a5568;
	}

	.exercise-card-link {
		text-decoration: none;
		color: inherit;
		display: block;
		border-radius: 0.75rem; /* 12px */
		transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
		background-color: var(--card-bg);
		border: 1px solid var(--card-border-color);
		box-shadow: var(--card-shadow);
		overflow: hidden; /* If adding internal elements that might overflow */
	}

	.exercise-card-link:hover {
		transform: translateY(-4px);
		box-shadow: var(--card-hover-shadow);
	}

	.exercise-card {
		padding: 1.25rem; /* 20px */
		font-family: var(--card-font-family);
		display: flex;
		flex-direction: column;
		height: 100%; /* For consistent height in a grid */
	}
	
	.card-header {
		display: flex;
		align-items: center;
		margin-bottom: 0.75rem;
	}

	.card-title {
		font-family: var(--card-title-font-family);
		font-size: 1.125rem; /* 18px */
		font-weight: 600;
		color: var(--card-title-color);
		margin: 0;
		line-height: 1.4;
	}

	.card-description {
		font-size: 0.875rem; /* 14px */
		color: var(--card-text-color);
		line-height: 1.6;
		margin-bottom: 1rem;
		flex-grow: 1; /* Pushes meta and tags down */
	}

	.card-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		font-size: 0.8rem; /* 12.8px */
		color: var(--card-meta-color);
		margin-bottom: 0.75rem;
		align-items: center;
	}
	.meta-item {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.2rem 0.5rem;
		border-radius: 0.25rem;
		background-color: var(--tag-bg);
	}
	.icon {
		width: 0.9em;
		height: 0.9em;
	}
	.difficulty-beginner { background-color: #c6f6d5; color: #2f855a; } /* Tailwind green shades */
	.difficulty-intermediate { background-color: #faf089; color: #b7791f; } /* Tailwind yellow shades */
	.difficulty-advanced { background-color: #fed7d7; color: #c53030; } /* Tailwind red shades */

	.card-tags {
		margin-top: auto; /* Pushes tags to the bottom */
		padding-top: 0.5rem;
	}
	.tag {
		display: inline-block;
		background-color: var(--tag-bg);
		color: var(--tag-text-color);
		padding: 0.25rem 0.6rem;
		border-radius: 9999px; /* Pill shape */
		font-size: 0.75rem; /* 12px */
		margin-right: 0.3rem;
		margin-bottom: 0.3rem;
		font-weight: 500;
	}
</style>