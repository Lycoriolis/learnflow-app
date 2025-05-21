<script lang="ts">
	export let course: any; // Replace 'any' with a specific Course type/interface later

	// Fallback for missing images, or you can use a placeholder service
	const placeholderImage = "https://via.placeholder.com/300x180.png?text=Course+Preview";
</script>

<a href={course.contentPath || '#'} class="course-card-link">
	<article class="course-card">
		<div class="card-image-container">
			<img src={course.thumbnail || placeholderImage} alt={course.title || 'Course image'} class="card-image" />
		</div>
		<div class="card-content">
			<h3 class="card-title">{course.title || 'Untitled Course'}</h3>
			<p class="card-description">{course.description || 'No description available.'}</p>
			<div class="card-meta">
				{#if course.category}
					<span class="meta-item category-tag">{course.category}</span>
				{/if}
				{#if course.difficulty}
					<span class="meta-item difficulty-tag difficulty-{String(course.difficulty).toLowerCase()}">
						{course.difficulty}
					</span>
				{/if}
				{#if course.estimatedTime}
					<span class="meta-item time-tag">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="icon"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clip-rule="evenodd" /></svg>
						{course.estimatedTime}
					</span>
				{/if}
			</div>
			{#if course.tags && course.tags.length > 0}
				<div class="card-tags">
					{#each course.tags as tag}
						<span class="tag">{tag}</span>
					{/each}
				</div>
			{/if}
		</div>
	</article>
</a>

<style>
	:root {
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
		--primary-color: #4299e1; /* Example primary color */
	}

	.course-card-link {
		text-decoration: none;
		color: inherit;
		display: block;
		border-radius: 0.75rem; /* 12px */
		overflow: hidden;
		transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
	}

	.course-card-link:hover {
		transform: translateY(-4px);
		box-shadow: var(--card-hover-shadow);
	}

	.course-card {
		background-color: var(--card-bg);
		border: 1px solid var(--card-border-color);
		box-shadow: var(--card-shadow);
		display: flex;
		flex-direction: column;
		height: 100%; /* Ensure cards in a grid take same height if needed */
	}
	
	.card-image-container {
		width: 100%;
		aspect-ratio: 16 / 9; /* Maintain aspect ratio for images */
		overflow: hidden;
		background-color: #f0f0f0; /* Placeholder bg */
	}

	.card-image {
		width: 100%;
		height: 100%;
		object-fit: cover; /* Cover the container, might crop */
		transition: transform 0.3s ease;
	}

	.course-card-link:hover .card-image {
		transform: scale(1.05);
	}

	.card-content {
		padding: 1rem 1.25rem; /* 16px 20px */
		font-family: var(--card-font-family);
		flex-grow: 1; /* Allows content to fill space if card heights are matched */
		display: flex;
		flex-direction: column;
	}

	.card-title {
		font-family: var(--card-title-font-family);
		font-size: 1.25rem; /* 20px */
		font-weight: 600;
		color: var(--card-title-color);
		margin: 0 0 0.5rem;
		line-height: 1.3;
	}

	.card-description {
		font-size: 0.9rem; /* 14.4px */
		color: var(--card-text-color);
		line-height: 1.6;
		margin-bottom: 0.75rem;
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
		gap: 0.25rem; /* Space between icon and text */
		padding: 0.2rem 0.5rem;
		border-radius: 0.25rem; /* 4px */
		background-color: var(--tag-bg);
	}
	.icon {
		width: 0.9em; /* 14.4px */
		height: 0.9em;
	}
	.difficulty-beginner { background-color: #c6f6d5; color: #2f855a; }
	.difficulty-intermediate { background-color: #faf089; color: #b7791f; }
	.difficulty-advanced { background-color: #fed7d7; color: #c53030; }


	.card-tags {
		margin-top: auto; /* Pushes tags to the bottom if description doesn't fill space */
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