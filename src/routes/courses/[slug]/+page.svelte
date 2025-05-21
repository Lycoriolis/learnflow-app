<script lang="ts">
	import type { PageData } from './$types';
	// import CourseCard from '$lib/components/courses/CourseCard.svelte'; 
	import { marked } from 'marked'; 

	export let data: PageData;

	// $: console.log('Course [slug] page data:', data); 
</script>

{#if data.type === 'category'}
	<div class="course-category-view page-container">
		<header class="page-header">
			<h1>Course Category: {data.categoryDetails?.title || 'Unknown Category'}</h1>
		</header>
		{#if data.courses && data.courses.length > 0}
			<div class="course-list-grid content-grid">
				{#each data.courses as course (course.id)}
					<!-- Replace with <CourseCard {course} /> -->
					<div class="course-item-card">
						<h3><a href={course.contentPath}>{course.title || 'Untitled Course'}</a></h3>
						<p>{course.description || 'No description available.'}</p>
						{#if course.tags && course.tags.length > 0}
							<div class="tags">
								{#each course.tags as tag}<span class="tag">{tag}</span>{/each}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{:else}
			<!-- This part needs to be connected to actual course fetching for the category -->
			<p>No courses found in this category (or listing not implemented yet).</p>
		{/if}

		{#if data.allCategories && data.allCategories.length > 1}
			<nav class="other-categories-nav">
				<h3>Other Course Categories:</h3>
				<ul>
					{#each data.allCategories as cat (cat.id)}
						{#if cat.id !== data.categoryDetails?.id}
							<li><a href="/courses/{cat.id}">{cat.title}</a></li>
						{/if}
					{/each}
				</ul>
			</nav>
		{/if}
	</div>
{:else if data.type === 'course'}
	<article class="course-detail-view page-container">
		{#if data.courseData}
			<header class="content-header">
				<h1>{data.courseData.title || 'Untitled Course'}</h1>
				<p class="meta-info">
					{#if data.courseData.category}<span>Category: {data.courseData.category}</span>{/if}
					{#if data.courseData.difficulty}<span>Difficulty: {data.courseData.difficulty}</span>{/if}
					{#if data.courseData.estimatedTime}<span>Time: {data.courseData.estimatedTime}</span>{/if}
				</p>
			</header>

			{#if data.courseData.description}
				<p class="content-description"><em>{data.courseData.description}</em></p>
			{/if}
			
			<section class="main-content prose lg:prose-xl">
				{#if data.courseData.rawMdxContent}
					{@html marked(data.courseData.rawMdxContent)}
				{:else}
					<p>Course overview content could not be loaded.</p>
				{/if}
			</section>

			{#if data.lessons && data.lessons.length > 0}
				<section class="lessons-list-section">
					<h2>Lessons in this Course</h2>
					<ul class="lessons-list">
						{#each data.lessons as lesson (lesson.id)}
							<li>
								<a href={lesson.contentPath} class="lesson-link">
									<span class="lesson-title">{lesson.title || 'Untitled Lesson'}</span>
									{#if lesson.estimatedTime}<span class="lesson-meta">({lesson.estimatedTime})</span>{/if}
								</a>
								{#if lesson.description}<p class="lesson-description">{lesson.description}</p>{/if}
							</li>
						{/each}
					</ul>
				</section>
			{/if}
		{:else}
			<p>Course details could not be loaded.</p>
		{/if}
	</article>
{:else}
	<p class="page-container">Loading content or content not found...</p>
{/if}

<style>
	/* General page container styles (can be global or in a layout) */
	.page-container {
		font-family: var(--page-font-family, 'Inter', sans-serif);
		max-width: 900px;
		margin: 0 auto;
		padding: 2rem 1.5rem;
	}
	.page-header h1, .content-header h1 {
		font-family: var(--heading-font-family, 'Lexend Deca', sans-serif);
		font-size: 2.25rem;
		font-weight: 700;
		color: var(--text-color-primary, #1F2937);
		margin-bottom: 0.75rem;
		line-height: 1.2;
	}
	.meta-info {
		font-size: 0.9rem;
		color: var(--text-color-muted, #6B7280);
		margin-bottom: 1.5rem;
	}
	.meta-info span:not(:last-child)::after {
		content: ' | ';
		margin: 0 0.5em;
	}
	.content-description {
		font-size: 1.1rem;
		color: var(--text-color-secondary, #4B5563);
		margin-bottom: 1.5rem;
		line-height: 1.7;
		font-style: italic;
	}
	.main-content { /* For MDX content */
		font-size: 1rem;
		line-height: 1.75;
		color: var(--text-color-primary, #1F2937);
	}

	/* Styles for category view */
	.course-category-view .page-header { text-align: center; margin-bottom: 2rem; }
	.course-list-grid { /* Re-use from main courses page or define here */
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1.5rem;
	}
	.course-item-card { /* Re-use from main courses page or define here */
		border: 1px solid var(--border-color-soft, #E5E7EB);
		padding: 1rem;
		border-radius: 0.5rem;
	}
	.course-item-card h3 a { text-decoration: none; color: var(--text-color-primary); }
	.other-categories-nav { margin-top: 2rem; padding-top: 1rem; border-top: 1px solid var(--border-color-soft); }
	.other-categories-nav h3 { margin-bottom: 0.5rem; font-size: 1.2rem; }
	.other-categories-nav ul { list-style: none; padding: 0; }
	.other-categories-nav li a { text-decoration: none; color: var(--primary-color); }

	/* Styles for course detail view (overview + lessons) */
	.course-detail-view .content-header {
		padding-bottom: 1rem;
		border-bottom: 1px solid var(--border-color-soft, #E5E7EB);
	}

	.lessons-list-section {
		margin-top: 3rem;
		padding-top: 2rem;
		border-top: 1px solid var(--border-color-soft, #E5E7EB);
	}
	.lessons-list-section h2 {
		font-family: var(--heading-font-family, 'Lexend Deca', sans-serif);
		font-size: 1.75rem;
		font-weight: 600;
		color: var(--text-color-primary);
		margin-bottom: 1.5rem;
	}
	.lessons-list {
		list-style: none;
		padding: 0;
	}
	.lessons-list li {
		margin-bottom: 1.25rem;
		padding-bottom: 1.25rem;
		border-bottom: 1px solid var(--border-color-soft, #E5E7EB);
	}
	.lessons-list li:last-child {
		border-bottom: none;
		margin-bottom: 0;
		padding-bottom: 0;
	}
	.lesson-link {
		text-decoration: none;
		display: block;
	}
	.lesson-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--primary-color, #3B82F6);
		margin-bottom: 0.25rem;
		display: inline-block;
	}
	.lesson-link:hover .lesson-title {
		text-decoration: underline;
	}
	.lesson-meta {
		font-size: 0.85rem;
		color: var(--text-color-muted);
		margin-left: 0.5rem;
	}
	.lesson-description {
		font-size: 0.95rem;
		color: var(--text-color-secondary);
		margin-top: 0.3rem;
		line-height: 1.6;
	}

	/* Prose styles from [...slug] can be used here or made global */
	.prose :global(h2) { /* ... */ } /* Copy from previous if not global */
</style>
