<script lang="ts">
	import type { LayoutData } from './$types';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	export let data: LayoutData;

	let sidebarOpen = false;
	let isMobileViewport = false;
	let searchTerm = '';
	let filteredLessons = data.siblingLessons ?? [];
	let totalLessons = data.siblingLessons?.length ?? 0;
	let currentLessonIndex = -1;
	let progressPercent = 0;
	let hasSidebar = Boolean(data.currentCourseOverview && data.siblingLessons && data.siblingLessons.length > 0);

	onMount(() => {
		if (typeof window === 'undefined') return;
		const mediaQuery = window.matchMedia('(max-width: 1199px)');
		const updateViewportState = () => {
			isMobileViewport = mediaQuery.matches;
			if (!isMobileViewport) {
				sidebarOpen = true;
			}
		};
		updateViewportState();
		mediaQuery.addEventListener('change', updateViewportState);
		return () => mediaQuery.removeEventListener('change', updateViewportState);
	});

	function isActiveLesson(lessonPath: string) {
		const currentPagePath = $page.url.pathname.endsWith('/') ? $page.url.pathname.slice(0, -1) : $page.url.pathname;
		const targetPath = lessonPath.endsWith('/') ? lessonPath.slice(0, -1) : lessonPath;
		return currentPagePath === targetPath;
	}

	function getLessonNumber(lessonId?: string) {
		if (!lessonId || !data.siblingLessons) return null;
		const index = data.siblingLessons.findIndex((lesson) => lesson.id === lessonId);
		return index >= 0 ? index + 1 : null;
	}

	function formatMetaValue(value?: string | null) {
		if (!value) return '';
		const lower = String(value).toLowerCase();
		if (lower === 'beginner' || lower === 'intermediate' || lower === 'advanced' || lower === 'expert') {
			return lower.charAt(0).toUpperCase() + lower.slice(1);
		}
		return String(value);
	}

	$: hasSidebar = Boolean(data.currentCourseOverview && data.siblingLessons && data.siblingLessons.length > 0);
	$: totalLessons = hasSidebar ? data.siblingLessons?.length ?? 0 : 0;
	$: currentLessonIndex = hasSidebar && data.siblingLessons
		? data.siblingLessons.findIndex((lesson) => isActiveLesson(lesson.contentPath) || (data.currentLessonId ? lesson.id === data.currentLessonId : false))
		: -1;
	$: progressPercent = currentLessonIndex >= 0 && totalLessons > 0 ? Math.round(((currentLessonIndex + 1) / totalLessons) * 100) : 0;
	$: filteredLessons = hasSidebar && data.siblingLessons
		? data.siblingLessons.filter((lesson) => {
			if (!searchTerm.trim()) return true;
			const term = searchTerm.trim().toLowerCase();
			const title = String(lesson.title ?? '').toLowerCase();
			const description = String(lesson.description ?? '').toLowerCase();
			const tags = Array.isArray(lesson.tags) ? lesson.tags.join(' ').toLowerCase() : '';
			return title.includes(term) || description.includes(term) || tags.includes(term);
		})
		: [];
</script>

<div class="course-layout-container" class:has-sidebar={hasSidebar} class:sidebar-open={sidebarOpen}>
	{#if hasSidebar}
		<button
			type="button"
			class="sidebar-toggle"
			on:click={() => (sidebarOpen = !sidebarOpen)}
			aria-expanded={sidebarOpen}
			aria-controls="course-sidebar"
		>
			<i class="fa-solid fa-bars"></i>
			<span>Lessons</span>
		</button>

		{#if sidebarOpen && isMobileViewport}
			<div class="sidebar-overlay" on:click={() => (sidebarOpen = false)}></div>
		{/if}

		<aside id="course-sidebar" class:open={sidebarOpen}>
			<div class="sidebar-inner">
				<div class="sidebar-header">
					<div class="header-top">
						<a href={data.currentCourseOverview.contentPath || (data.currentCourseId ? `/courses/${data.currentCourseId}` : '/courses')} class="back-link">
							<i class="fa-solid fa-arrow-left"></i>
							<span>Back to course overview</span>
						</a>
						<button type="button" class="close-button" on:click={() => (sidebarOpen = false)} aria-label="Close lesson navigation">
							<i class="fa-solid fa-xmark"></i>
						</button>
					</div>
					<h2>{data.currentCourseOverview.title || 'Course lessons'}</h2>
					{#if data.currentCourseOverview.description}
						<p class="course-summary">{data.currentCourseOverview.description}</p>
					{/if}
				</div>

				{#if totalLessons > 0}
					<div class="progress-card">
						<div class="progress-copy">
							<span class="progress-label">Lesson progress</span>
							<strong>{currentLessonIndex >= 0 ? `Lesson ${currentLessonIndex + 1}` : 'Browse lessons'} <span class="total">/ {totalLessons}</span></strong>
						</div>
						<span class="progress-percent">{progressPercent}%</span>
						<div class="progress-track">
							<div class="progress-fill" style={`width: ${Math.min(progressPercent, 100)}%`}></div>
						</div>
						{#if data.currentCourseOverview.estimatedTime}
							<div class="course-meta">
								<i class="fa-solid fa-stopwatch"></i>
								<span>{data.currentCourseOverview.estimatedTime}</span>
							</div>
						{/if}
					</div>
				{/if}

				<div class="search-field">
					<i class="fa-solid fa-magnifying-glass"></i>
					<input
						type="search"
						placeholder="Search lessons..."
						bind:value={searchTerm}
						aria-label="Search lessons"
					>
				</div>

				<nav class="lessons-nav" aria-label="Course lessons">
					{#if filteredLessons.length === 0}
						<p class="empty-state">No lessons match this search.</p>
					{:else}
						<ul>
							{#each filteredLessons as lesson (lesson.id)}
								{#if lesson.contentPath}
									<li>
										<a
											href={lesson.contentPath}
											class:active={isActiveLesson(lesson.contentPath)}
											aria-current={isActiveLesson(lesson.contentPath) ? 'page' : undefined}
										>
											<span class="lesson-index">{getLessonNumber(lesson.id) ?? '—'}</span>
											<span class="lesson-copy">
												<span class="lesson-title">{lesson.title || 'Untitled lesson'}</span>
												<span class="lesson-meta">
													{#if lesson.estimatedTime}<span class="chip"><i class="fa-solid fa-clock"></i>{lesson.estimatedTime}</span>{/if}
													{#if lesson.difficulty}<span class="chip"><i class="fa-solid fa-signal"></i>{formatMetaValue(lesson.difficulty)}</span>{/if}
												</span>
											</span>
											{#if isActiveLesson(lesson.contentPath)}
												<span class="active-pill">Now</span>
											{/if}
										</a>
									</li>
								{/if}
							{/each}
						</ul>
					{/if}
				</nav>
			</div>
		</aside>
	{/if}

	<main class="course-main-content" class:with-sidebar={hasSidebar}>
		<slot />
	</main>
</div>

<style>
	.course-layout-container {
		display: flex;
		max-width: 1440px;
		margin: 0 auto;
		gap: 2rem;
		padding: 0 1.5rem 4rem;
		font-family: var(--page-font-family, 'Inter', sans-serif);
		position: relative;
	}

	.course-layout-container.has-sidebar .course-main-content {
		flex: 1 1 auto;
	}

	.sidebar-toggle {
		display: none;
		align-items: center;
		gap: 0.5rem;
		margin: 0.75rem 0 0.4rem;
		padding: 0.5rem 0.85rem;
		border-radius: 999px;
		border: 1px solid rgba(15, 118, 110, 0.35);
		background: rgba(13, 148, 136, 0.12);
		color: #0f766e;
		font-weight: 600;
		font-size: 0.9rem;
		cursor: pointer;
		transition: background 0.2s ease, box-shadow 0.2s ease;
	}

	.sidebar-toggle:hover {
		background: rgba(13, 148, 136, 0.18);
		box-shadow: 0 10px 24px -16px rgba(13, 148, 136, 0.6);
	}

	.sidebar-overlay {
		position: fixed;
		inset: 0;
		background: rgba(15, 23, 42, 0.5);
		backdrop-filter: blur(3px);
		z-index: 39;
	}

	#course-sidebar {
		width: 280px;
		flex-shrink: 0;
		height: calc(100vh - 80px);
		position: sticky;
		top: 64px;
		border-radius: 20px;
		overflow: hidden;
		background: radial-gradient(circle at top, rgba(56, 189, 248, 0.18), rgba(15, 23, 42, 0.88) 55%)
			, linear-gradient(135deg, rgba(12, 74, 110, 0.9), rgba(15, 23, 42, 0.96));
		border: 1px solid rgba(148, 163, 184, 0.14);
		box-shadow: 0 32px 80px -40px rgba(15, 23, 42, 0.8);
		transition: transform 0.35s ease, opacity 0.35s ease;
		color: #f8fafc;
		z-index: 40;
	}

	#course-sidebar .sidebar-inner {
		display: flex;
		flex-direction: column;
		height: 100%;
		padding: 1.35rem;
		gap: 1.2rem;
		overflow: hidden;
	}

	.sidebar-header {
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
	}

	.sidebar-header .header-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.6rem;
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.45rem 0.75rem;
		border-radius: 999px;
		background: rgba(148, 163, 184, 0.1);
		color: rgba(226, 232, 240, 0.96);
		font-size: 0.8rem;
		font-weight: 600;
		text-decoration: none;
		transition: background 0.2s ease, color 0.2s ease;
	}

	.back-link:hover {
		background: rgba(148, 163, 184, 0.18);
		color: #f8fafc;
	}

	.close-button {
		display: none;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border-radius: 999px;
		border: 1px solid rgba(148, 163, 184, 0.22);
		background: rgba(15, 23, 42, 0.5);
		color: rgba(226, 232, 240, 0.8);
		cursor: pointer;
	}

	.sidebar-header h2 {
		font-family: var(--heading-font-family, 'Lexend Deca', sans-serif);
		font-size: 1.15rem;
		font-weight: 700;
		letter-spacing: -0.01em;
		margin: 0;
	}

	.course-summary {
		margin: 0;
		color: rgba(226, 232, 240, 0.8);
		font-size: 0.85rem;
		line-height: 1.5;
	}

	.progress-card {
		display: flex;
		flex-direction: column;
		gap: 0.65rem;
		padding: 1rem;
		border-radius: 14px;
		background: rgba(15, 23, 42, 0.6);
		border: 1px solid rgba(56, 189, 248, 0.15);
		box-shadow: inset 0 0 0 1px rgba(8, 145, 178, 0.08);
	}

	.progress-copy {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.progress-label {
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: rgba(226, 232, 240, 0.6);
	}

	.progress-copy strong {
		font-size: 0.95rem;
		font-weight: 700;
	}

	.progress-copy .total {
		font-size: 0.75rem;
		font-weight: 500;
		color: rgba(226, 232, 240, 0.7);
	}

	.progress-percent {
		align-self: flex-start;
		padding: 0.2rem 0.6rem;
		border-radius: 999px;
		font-size: 0.7rem;
		font-weight: 600;
		background: rgba(56, 189, 248, 0.1);
		color: rgba(165, 243, 252, 0.95);
	}

	.progress-track {
		position: relative;
		height: 4px;
		border-radius: 999px;
		overflow: hidden;
		background: rgba(148, 163, 184, 0.2);
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, #38bdf8, #0ea5e9, #22d3ee);
		box-shadow: 0 0 16px rgba(14, 165, 233, 0.45);
	}

	.course-meta {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.75rem;
		color: rgba(226, 232, 240, 0.7);
	}

	.search-field {
		position: relative;
		display: flex;
		align-items: center;
		background: rgba(15, 23, 42, 0.55);
		border: 1px solid rgba(148, 163, 184, 0.2);
		border-radius: 12px;
		padding: 0.55rem 0.75rem;
		gap: 0.65rem;
	}

	.search-field i {
		color: rgba(165, 243, 252, 0.75);
	}

	.search-field input {
		flex: 1;
		border: none;
		background: transparent;
		color: #f8fafc;
		font-size: 0.85rem;
		outline: none;
	}

	.search-field input::placeholder {
		color: rgba(148, 163, 184, 0.7);
	}

	.lessons-nav {
		overflow-y: auto;
		flex: 1 1 auto;
		padding-right: 0.4rem;
	}

	.lessons-nav ul {
		margin: 0;
		padding: 0;
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.lessons-nav li a {
		display: grid;
		grid-template-columns: 36px 1fr auto;
		align-items: center;
		gap: 0.7rem;
		padding: 0.65rem 0.8rem;
		border-radius: 12px;
		text-decoration: none;
		color: rgba(226, 232, 240, 0.86);
		background: rgba(15, 23, 42, 0.55);
		border: 1px solid transparent;
		transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
	}

	.lessons-nav li a:hover {
		transform: translateX(4px);
		border-color: rgba(56, 189, 248, 0.35);
		background: rgba(15, 23, 42, 0.72);
	}

	.lessons-nav li a.active {
		border-color: rgba(14, 165, 233, 0.65);
		background: rgba(14, 165, 233, 0.18);
		box-shadow: 0 18px 40px -30px rgba(37, 99, 235, 0.9);
	}

	.lesson-index {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		border-radius: 999px;
		background: rgba(14, 165, 233, 0.18);
		color: rgba(56, 189, 248, 0.95);
		font-weight: 700;
		font-size: 0.7rem;
	}

	.lesson-copy {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.lesson-title {
		font-weight: 600;
		font-size: 0.9rem;
	}

	.lesson-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
		font-size: 0.7rem;
		color: rgba(148, 163, 184, 0.85);
	}

	.lesson-meta .chip {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		padding: 0.2rem 0.45rem;
		border-radius: 999px;
		background: rgba(15, 118, 110, 0.18);
		color: rgba(190, 242, 100, 0.85);
	}

	.lesson-meta .chip i {
		font-size: 0.65rem;
		color: rgba(190, 242, 100, 0.9);
	}

	.active-pill {
		padding: 0.25rem 0.55rem;
		border-radius: 999px;
		background: rgba(250, 204, 21, 0.24);
		color: rgba(253, 224, 71, 0.95);
		font-size: 0.65rem;
		font-weight: 600;
	}

	.empty-state {
		margin: 0;
		padding: 0.85rem;
		border-radius: 12px;
		background: rgba(15, 23, 42, 0.55);
		border: 1px solid rgba(148, 163, 184, 0.25);
		color: rgba(148, 163, 184, 0.85);
		font-size: 0.8rem;
	}

	.course-main-content {
		flex: 1 1 auto;
		min-width: 0;
		padding-top: 3.25rem;
	}

	@media (max-width: 1199px) {
		.course-layout-container {
			flex-direction: column;
			padding: 0 1rem 3rem;
		}

		#course-sidebar {
			position: fixed;
			top: 16px;
			bottom: 16px;
			right: 16px;
			left: 16px;
			height: auto;
			transform: translateY(20px);
			opacity: 0;
			pointer-events: none;
		}

		#course-sidebar.open {
			transform: translateY(0);
			opacity: 1;
			pointer-events: auto;
		}

		.sidebar-toggle {
			display: inline-flex;
		}

		.close-button {
			display: inline-flex;
		}

		.course-main-content {
			padding-top: 1.75rem;
		}
	}

	@media (max-width: 720px) {
		#course-sidebar {
			left: 12px;
			right: 12px;
		}

		#course-sidebar .sidebar-inner {
			padding: 1.2rem;
		}

		.lessons-nav li a {
			grid-template-columns: 32px 1fr;
			grid-template-rows: auto auto;
			row-gap: 0.4rem;
		}

		.active-pill {
			grid-column: 1 / -1;
			justify-self: start;
		}
	}
</style>
