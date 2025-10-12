<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { onMount, onDestroy, tick } from 'svelte';
	import EnhancedMarkdownRenderer from '$lib/components/EnhancedMarkdownRenderer.svelte';
	import { processCourseCallouts } from '$lib/utils/markdown.ts';
	import slugify from 'slugify';
	import { user } from '$lib/stores/authStore';
	import { userProgressStore } from '$lib/stores/userProgress';

	export let data: PageData;

	interface LayoutData {
		siblingLessons?: any[];
		currentCourseOverview?: any;
		currentCourseId?: string | null;
		currentLessonId?: string | null;
	}

	interface TocItem {
		id: string;
		title: string;
		level: number;
	}

	interface Breadcrumb {
		label: string;
		href: string;
	}

	interface MetaHighlight {
		label: string;
		value: string;
		icon: string;
		hint?: string;
	}

	let layoutData: LayoutData = {};
	$: layoutData = ($page?.data?.layoutData as LayoutData) ?? {
		siblingLessons: $page?.data?.siblingLessons,
		currentCourseOverview: $page?.data?.currentCourseOverview,
		currentCourseId: $page?.data?.currentCourseId,
		currentLessonId: $page?.data?.currentLessonId
	};

	let currentIndex = -1;
	let prevLesson: any = null;
	let nextLesson: any = null;
	let totalLessons = 0;
	let lessonSequenceLabel = '';
	let courseProgressPercent = 0;

	$: totalLessons = layoutData?.siblingLessons?.length ?? 0;
	$: {
		if (layoutData?.siblingLessons && data.contentItem?.id) {
			const siblings = layoutData.siblingLessons;
			const byIdIndex = siblings.findIndex((lesson) => lesson.id === data.contentItem.id);
			let index = byIdIndex;
			if (index === -1) {
				const currentPath = $page.url.pathname;
				index = siblings.findIndex((lesson) => lesson.contentPath === currentPath || lesson.contentPath === data.contentItem.contentPath);
			}

			currentIndex = index;

			if (index >= 0) {
				prevLesson = index > 0 ? siblings[index - 1] : null;
				nextLesson = index < siblings.length - 1 ? siblings[index + 1] : null;
			} else {
				prevLesson = null;
				nextLesson = null;
			}
		} else {
			currentIndex = -1;
			prevLesson = null;
			nextLesson = null;
		}

		lessonSequenceLabel = currentIndex >= 0 && totalLessons > 0 ? `Lesson ${currentIndex + 1} of ${totalLessons}` : '';
		courseProgressPercent = currentIndex >= 0 && totalLessons > 0 ? Math.round(((currentIndex + 1) / totalLessons) * 100) : 0;
	}

	let processedContent = '';
	$: processedContent = data.contentItem?.rawMdxContent ? processCourseCallouts(data.contentItem.rawMdxContent) : '';

	let tocItems: TocItem[] = [];
	let activeHeadingId: string | null = null;
	let mobileTocOpen = false;
	let articleElement: HTMLElement | null = null;
	let headingObserver: IntersectionObserver | null = null;
	let observedHeadings: HTMLElement[] = [];

	let lessonWordCount = 0;
	let estimatedMinutes = 0;
	let readingTimeLabel = '';
	let lastUpdatedLabel = '';
	let metaHighlights: MetaHighlight[] = [];
	let breadcrumbs: Breadcrumb[] = [];
	let lessonTags: string[] = [];
	let categoryLabel = '';
	let heroGradientClass = '';
	let difficultyBadgeClass = '';
	let difficultyLabel = '';

	let isAuthenticated = false;
	let progressInitialised = false;
	let trackedLessonKey: string | null = null;
	let unsubscribeUser: (() => void) | undefined;

	let showActionMessage = false;
	let actionMessage = '';
	let actionTone: 'success' | 'info' | 'error' = 'info';
	let actionTimeout: ReturnType<typeof setTimeout> | null = null;

	onMount(() => {
		if (!browser) return;

		unsubscribeUser = user.subscribe(($user) => {
			isAuthenticated = Boolean($user?.uid);

			if ($user?.uid && !progressInitialised) {
				progressInitialised = true;
				userProgressStore.initializeUserProgress($user.uid);
			}

			if ($user?.uid && layoutData?.currentCourseId && data.contentItem?.id) {
				const key = `${layoutData.currentCourseId}::${data.contentItem.id}`;
				if (trackedLessonKey !== key) {
					userProgressStore.trackLessonView(layoutData.currentCourseId, data.contentItem.id);
					trackedLessonKey = key;
				}
			}
		});

		scheduleTocRefresh();
	});

	onDestroy(() => {
		headingObserver?.disconnect();
		unsubscribeUser?.();
		if (actionTimeout) clearTimeout(actionTimeout);
	});

	$: if (browser && progressInitialised && layoutData?.currentCourseId && data.contentItem?.id) {
		const key = `${layoutData.currentCourseId}::${data.contentItem.id}`;
		if (trackedLessonKey !== key) {
			userProgressStore.trackLessonView(layoutData.currentCourseId, data.contentItem.id);
			trackedLessonKey = key;
		}
	}

	$: computeLessonMetrics(data.contentItem?.rawMdxContent ?? '');
	$: lastUpdatedLabel = formatTimestamp(
		data.contentItem?.updatedAt ??
		data.contentItem?.lastUpdated ??
		data.contentItem?.metadata?.updatedAt ??
		data.contentItem?.metadata?.dateAdded ??
		null
	);
	$: lessonTags = Array.isArray(data.contentItem?.tags) ? data.contentItem.tags : [];
	$: categoryLabel = deriveCategoryLabel();
	$: heroGradientClass = getHeroGradient(data.contentItem?.difficulty);
	$: difficultyBadgeClass = getDifficultyBadgeClasses(data.contentItem?.difficulty);
	$: difficultyLabel = formatDifficultyLabel(data.contentItem?.difficulty);
	$: breadcrumbs = buildBreadcrumbs();
	$: metaHighlights = buildMetaHighlights();

	$: {
		if (browser && processedContent) {
			scheduleTocRefresh();
		}
	}

	function scheduleTocRefresh() {
		if (!browser) return;
		tick().then(() => {
			if (!articleElement) return;
			const headingNodes = Array.from(articleElement.querySelectorAll('h2, h3, h4')) as HTMLElement[];

			const items: TocItem[] = [];
			headingNodes.forEach((heading) => {
				const title = heading.textContent?.trim() ?? '';
				if (!title) return;
				const id = heading.id || slugify(title, { lower: true, strict: true });
				heading.id = id;
				items.push({
					id,
					title,
					level: Number(heading.tagName.substring(1))
				});
			});

			tocItems = items;
			activeHeadingId = items[0]?.id ?? null;
			setupHeadingObserver(headingNodes);
		});
	}

	function setupHeadingObserver(headings: HTMLElement[]) {
		headingObserver?.disconnect();
		observedHeadings = headings;

		if (!browser || !headings.length) {
			activeHeadingId = headings[0]?.id ?? null;
			return;
		}

		headingObserver = new IntersectionObserver(handleHeadingIntersection, {
			rootMargin: '-72px 0px -55% 0px',
			threshold: [0, 0.2, 0.4, 0.6, 0.8]
		});

		headings.forEach((heading) => headingObserver?.observe(heading));
	}

	function handleHeadingIntersection(entries: IntersectionObserverEntry[]) {
		const visible = entries
			.filter((entry) => entry.isIntersecting)
			.sort((a, b) => b.intersectionRatio - a.intersectionRatio);

		if (visible.length) {
			activeHeadingId = (visible[0].target as HTMLElement).id;
			return;
		}

		if (observedHeadings.length) {
			const nearest = observedHeadings
				.map((heading) => ({
					heading,
					distance: Math.abs(heading.getBoundingClientRect().top - 96)
				}))
				.sort((a, b) => a.distance - b.distance);

			activeHeadingId = nearest[0]?.heading.id ?? observedHeadings[0]?.id ?? null;
		}
	}

	function handleTocClick(id: string) {
		if (!browser) return;
		mobileTocOpen = false;
		const target = document.getElementById(id);
		if (target) {
			target.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}

	function toggleMobileToc() {
		mobileTocOpen = !mobileTocOpen;
	}

	function closeMobileToc() {
		mobileTocOpen = false;
	}

	function computeLessonMetrics(raw: string) {
		if (!raw) {
			lessonWordCount = 0;
			estimatedMinutes = 0;
			readingTimeLabel = '—';
			return;
		}

		const sanitized = raw
			.replace(/```[\s\S]*?```/g, ' ')
			.replace(/`[^`]*`/g, ' ')
			.replace(/\{#.*?\}/g, ' ')
			.replace(/[*>#_~]/g, ' ');

		const words = sanitized.split(/\s+/).filter(Boolean);
		lessonWordCount = words.length;
		estimatedMinutes = Math.max(1, Math.round(lessonWordCount / 180));
		readingTimeLabel = estimatedMinutes < 60
			? `${estimatedMinutes} min`
			: `${Math.floor(estimatedMinutes / 60)}h${estimatedMinutes % 60 ? ` ${estimatedMinutes % 60} min` : ''}`.trim();
	}

	function formatTimestamp(value: unknown): string {
		if (!value) return '';

		const date = value instanceof Date ? value : new Date(value as string);
		if (Number.isNaN(date.getTime())) return '';

		return date.toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function deriveCategoryLabel(): string {
		const path = data.contentItem?.categoryPath ?? '';
		if (path) {
			const segments = path.split('/').filter(Boolean);
			const last = segments[segments.length - 1];
			if (last) return toTitleCase(last);
		}
		return data.contentItem?.category ? toTitleCase(String(data.contentItem.category)) : '';
	}

	function buildBreadcrumbs(): Breadcrumb[] {
		const crumbs: Breadcrumb[] = [{ label: 'Courses', href: '/courses' }];
		const categoryPath = data.contentItem?.categoryPath ?? '';
		let accumulated = '/courses';

		if (categoryPath) {
			const segments = categoryPath.split('/').filter(Boolean);
			for (const segment of segments) {
				accumulated += `/${segment}`;
				crumbs.push({ label: toTitleCase(segment), href: accumulated });
			}
		} else if (layoutData?.currentCourseOverview?.contentPath && layoutData.currentCourseOverview.title) {
			crumbs.push({ label: layoutData.currentCourseOverview.title, href: layoutData.currentCourseOverview.contentPath });
		}

		if (data.contentItem?.title) {
			crumbs.push({ label: data.contentItem.title, href: $page.url.pathname });
		}

		return crumbs;
	}

	function buildMetaHighlights(): MetaHighlight[] {
		const highlights: MetaHighlight[] = [];

		if (lessonSequenceLabel) {
			highlights.push({
				label: 'Lesson position',
				value: lessonSequenceLabel,
				icon: 'fa-layer-group',
				hint: courseProgressPercent ? `${courseProgressPercent}% through this course` : undefined
			});
		}

		if (readingTimeLabel && readingTimeLabel !== '—') {
			highlights.push({ label: 'Estimated read', value: `${readingTimeLabel}`, icon: 'fa-clock' });
		}

		if (data.contentItem?.estimatedTime && data.contentItem.estimatedTime !== readingTimeLabel) {
			highlights.push({ label: 'Suggested pacing', value: data.contentItem.estimatedTime, icon: 'fa-stopwatch' });
		}

		if (difficultyLabel) {
			highlights.push({ label: 'Difficulty', value: difficultyLabel, icon: 'fa-signal' });
		}

		if (lastUpdatedLabel) {
			highlights.push({ label: 'Last updated', value: lastUpdatedLabel, icon: 'fa-rotate' });
		}

		return highlights;
	}

	function buildInsightList(): MetaHighlight[] {
		const insights: MetaHighlight[] = [];

		if (lessonWordCount) {
			insights.push({ label: 'Word count', value: lessonWordCount.toLocaleString(), icon: 'fa-file-lines' });
		}

		if (categoryLabel) {
			insights.push({ label: 'Category', value: categoryLabel, icon: 'fa-book' });
		}

		if (layoutData?.currentCourseOverview?.title) {
			insights.push({ label: 'Course', value: layoutData.currentCourseOverview.title, icon: 'fa-graduation-cap' });
		}

		if (courseProgressPercent) {
			insights.push({ label: 'Course progress', value: `${courseProgressPercent}% complete`, icon: 'fa-chart-line' });
		}

		return insights;
	}

	const lessonInsights: MetaHighlight[] = [];
	$: {
		lessonInsights.splice(0, lessonInsights.length, ...buildInsightList());
	}

	function toTitleCase(value: string): string {
		return value
			.replace(/[-_]+/g, ' ')
			.replace(/\s+/g, ' ')
			.trim()
			.replace(/\b\w/g, (char) => char.toUpperCase());
	}

	function formatDifficultyLabel(value?: string | null): string {
		if (!value) return '';
		const lower = value.toLowerCase();
		if (lower === 'beginner') return 'Beginner';
		if (lower === 'intermediate') return 'Intermediate';
		if (lower === 'advanced') return 'Advanced';
		if (lower === 'expert') return 'Expert';
		return toTitleCase(value);
	}

	function getDifficultyBadgeClasses(value?: string | null): string {
		switch (value?.toLowerCase()) {
			case 'beginner':
				return 'bg-emerald-500/20 border border-emerald-400 text-emerald-100';
			case 'intermediate':
				return 'bg-sky-500/20 border border-sky-400 text-sky-100';
			case 'advanced':
				return 'bg-violet-500/20 border border-violet-400 text-violet-100';
			case 'expert':
				return 'bg-rose-500/20 border border-rose-400 text-rose-100';
			default:
				return 'bg-slate-500/20 border border-slate-400 text-slate-100';
		}
	}

	function getHeroGradient(value?: string | null): string {
		switch (value?.toLowerCase()) {
			case 'beginner':
				return 'from-emerald-700 via-emerald-900 to-slate-950';
			case 'intermediate':
				return 'from-sky-700 via-blue-900 to-slate-950';
			case 'advanced':
				return 'from-violet-700 via-indigo-900 to-slate-950';
			case 'expert':
				return 'from-rose-700 via-rose-900 to-slate-950';
			default:
				return 'from-slate-800 via-slate-900 to-slate-950';
		}
	}

	function showAction(message: string, tone: 'success' | 'info' | 'error' = 'info') {
		actionMessage = message;
		actionTone = tone;
		showActionMessage = true;
		if (actionTimeout) clearTimeout(actionTimeout);
		actionTimeout = setTimeout(() => {
			showActionMessage = false;
		}, 4000);
	}

	async function markLessonCompleted() {
		if (!isAuthenticated) {
			showAction('Sign in to keep track of your progress.', 'info');
			return;
		}

		if (!layoutData?.currentCourseId || !data.contentItem?.id) {
			showAction('We could not identify this lesson for progress tracking.', 'error');
			return;
		}

		try {
			await userProgressStore.markLessonComplete(layoutData.currentCourseId, data.contentItem.id);
			userProgressStore.completeLessonInCourse(layoutData.currentCourseId, data.contentItem.id);
			showAction('Lesson marked as completed!', 'success');
		} catch (error) {
			console.error('Error updating lesson progress', error);
			showAction('Something went wrong while updating your progress.', 'error');
		}
	}

	async function shareLesson() {
		if (!browser) return;

		const shareUrl = window.location.href;
		const shareTitle = data.contentItem?.title ?? 'LearnFlow lesson';
		const shareText = data.contentItem?.description ?? 'Take a look at this lesson on LearnFlow';

		try {
			if (navigator.share) {
				await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
				showAction('Lesson shared!', 'success');
				return;
			}

			await navigator.clipboard.writeText(shareUrl);
			showAction('Link copied to your clipboard.', 'success');
		} catch (error) {
			console.error('Share failed', error);
			showAction('Unable to share automatically. Try copying the URL.', 'error');
		}
	}

	function saveLessonOffline() {
		if (!browser) return;
		window.print();
		showAction('Opening print dialog so you can save a PDF.', 'info');
	}
</script>

{#if data.contentItem}
	<div class="lesson-page">
		<section class={`lesson-hero bg-gradient-to-br ${heroGradientClass}`}>
			<div class="hero-pattern"></div>
			<div class="hero-content">
				<nav class="lesson-breadcrumbs" aria-label="Breadcrumb">
					{#each breadcrumbs as crumb, index}
						<a href={crumb.href} aria-current={index === breadcrumbs.length - 1 ? 'page' : undefined}>
							{crumb.label}
						</a>
						{#if index < breadcrumbs.length - 1}
							<span class="divider">/</span>
						{/if}
					{/each}
				</nav>

				<div class="hero-heading">
					{#if difficultyLabel}
						<span class={`difficulty-badge ${difficultyBadgeClass}`}>{difficultyLabel}</span>
					{/if}
					<h1>{data.contentItem.title || 'Untitled lesson'}</h1>
				</div>

				{#if data.contentItem.description}
					<p class="hero-summary">{data.contentItem.description}</p>
				{/if}

				{#if metaHighlights.length}
					<div class="hero-meta-grid">
						{#each metaHighlights as card (card.label)}
							<div class="meta-card">
								<div class="meta-icon">
									<i class={`fa-solid ${card.icon}`}></i>
								</div>
								<div class="meta-copy">
									<span class="meta-label">{card.label}</span>
									<strong class="meta-value">{card.value}</strong>
									{#if card.hint}
										<span class="meta-hint">{card.hint}</span>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				{/if}

				{#if courseProgressPercent}
					<div class="course-progress">
						<div class="course-progress-header">
							<span>Course progress</span>
							<span>{courseProgressPercent}%</span>
						</div>
						<div class="course-progress-bar">
							<div class="fill" style={`width: ${Math.min(courseProgressPercent, 100)}%`}></div>
						</div>
					</div>
				{/if}

				<div class="hero-actions">
					<button type="button" class="primary" on:click={markLessonCompleted}>
						<i class="fa-solid fa-circle-check"></i>
						<span>Mark as completed</span>
					</button>
					<button type="button" class="ghost" on:click={shareLesson}>
						<i class="fa-solid fa-share-nodes"></i>
						<span>Share</span>
					</button>
					<button type="button" class="ghost" on:click={saveLessonOffline}>
						<i class="fa-solid fa-file-arrow-down"></i>
						<span>Save for offline</span>
					</button>
					{#if tocItems.length}
						<button type="button" class="ghost mobile-only" on:click={toggleMobileToc} aria-expanded={mobileTocOpen}>
							<i class="fa-solid fa-list"></i>
							<span>Table of contents</span>
						</button>
					{/if}
				</div>
			</div>
		</section>

		{#if mobileTocOpen}
			<div class="lesson-toc-overlay" on:click={closeMobileToc}></div>
		{/if}

		<section class="lesson-shell">
			<article class="lesson-article" bind:this={articleElement}>
				{#if lessonInsights.length}
					<div class="lesson-insights">
						{#each lessonInsights as insight (insight.label)}
							<div class="insight-card">
								<div class="icon"><i class={`fa-solid ${insight.icon}`}></i></div>
								<div class="copy">
									<span class="label">{insight.label}</span>
									<strong class="value">{insight.value}</strong>
								</div>
							</div>
						{/each}
					</div>
				{/if}

				{#if lessonTags.length}
					<div class="lesson-tags" aria-label="Lesson tags">
						{#each lessonTags as tag (tag)}
							<span class="tag">{tag}</span>
						{/each}
					</div>
				{/if}

				<div class="lesson-content">
					{#if processedContent}
						<EnhancedMarkdownRenderer
							content={processedContent}
							className="lesson-markdown"
						/>
					{:else}
						<p class="empty-state">Content could not be loaded.</p>
					{/if}
				</div>

				{#if prevLesson || nextLesson}
					<nav class="lesson-pagination" aria-label="Lesson navigation">
						{#if prevLesson}
							<a class="nav-card" href={prevLesson.contentPath}>
								<div class="nav-direction">
									<i class="fa-solid fa-arrow-left"></i>
									<span>Previous lesson</span>
								</div>
								<strong>{prevLesson.title || 'Previous'}</strong>
							</a>
						{:else}
							<span class="nav-card disabled" aria-hidden="true"></span>
						{/if}

						{#if nextLesson}
							<a class="nav-card" href={nextLesson.contentPath}>
								<div class="nav-direction next">
									<span>Next lesson</span>
									<i class="fa-solid fa-arrow-right"></i>
								</div>
								<strong>{nextLesson.title || 'Next'}</strong>
							</a>
						{:else}
							<span class="nav-card disabled" aria-hidden="true"></span>
						{/if}
					</nav>
				{/if}
			</article>

			{#if tocItems.length}
				<aside class={`lesson-toc ${mobileTocOpen ? 'mobile-open' : ''}`}>
					<div class="toc-card">
						<div class="toc-header">
							<h2>On this page</h2>
							<button type="button" class="toc-close" on:click={closeMobileToc}>
								<i class="fa-solid fa-xmark"></i>
							</button>
						</div>
						<nav class="toc-list" aria-label="Table of contents">
							{#each tocItems as item (item.id)}
								<button
									type="button"
									class={`toc-item level-${item.level} ${activeHeadingId === item.id ? 'active' : ''}`}
									on:click={() => handleTocClick(item.id)}
								>
									<span>{item.title}</span>
								</button>
							{/each}
						</nav>
					</div>
				</aside>
			{/if}
		</section>

		{#if showActionMessage}
			<div class={`lesson-toast ${actionTone}`} role="status" aria-live="polite">{actionMessage}</div>
		{/if}
	</div>
{:else}
	<div class="lesson-empty">
		<div class="empty-card">
			<i class="fa-solid fa-circle-exclamation"></i>
			<h2>Content not found</h2>
			<p>The lesson you are looking for is not available right now.</p>
		</div>
	</div>
{/if}

<style lang="postcss">
	.lesson-page {
		@apply min-h-screen bg-slate-950 text-slate-50;
	}

	.lesson-hero {
		@apply relative overflow-hidden px-6 pt-10 pb-16 lg:px-10;
	}

	.hero-pattern {
		@apply absolute inset-0 opacity-40;
		background-image: radial-gradient(circle at 25% 25%, rgba(148, 163, 184, 0.08) 0, rgba(15, 23, 42, 0.08) 45%, transparent 60%),
			radial-gradient(circle at 75% 75%, rgba(56, 189, 248, 0.08) 0, transparent 55%);
	}

	.hero-content {
		@apply relative mx-auto max-w-5xl;
	}

	.lesson-breadcrumbs {
		@apply mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-300/80;
	}

	.lesson-breadcrumbs a {
		@apply transition hover:text-white;
	}

	.lesson-breadcrumbs .divider {
		@apply text-slate-500;
	}

	.hero-heading {
		@apply flex flex-col gap-4;
	}

	.hero-heading h1 {
		@apply text-4xl font-bold tracking-tight text-white sm:text-5xl;
	}

	.difficulty-badge {
		@apply inline-flex w-max items-center gap-2 rounded-full px-3 py-1 text-xs uppercase tracking-wide;
	}

	.hero-summary {
		@apply mt-4 max-w-3xl text-lg text-slate-200/90;
	}

	.hero-meta-grid {
		@apply mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4;
	}

	.meta-card {
		@apply flex items-start gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-5 backdrop-blur;
	}

	.meta-icon {
		@apply inline-flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-white/15 text-lg text-white;
	}

	.meta-label {
		@apply text-xs uppercase tracking-wide text-white/70;
	}

	.meta-value {
		@apply text-base font-semibold text-white;
	}

	.meta-hint {
		@apply text-xs text-white/70;
	}

	.course-progress {
		@apply mt-8 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur;
	}

	.course-progress-header {
		@apply flex items-center justify-between text-sm text-white/80;
	}

	.course-progress-bar {
		@apply mt-3 h-2 w-full rounded-full bg-white/10;
	}

	.course-progress-bar .fill {
		@apply h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500;
	}

	.hero-actions {
		@apply mt-8 flex flex-wrap gap-3;
	}

	.hero-actions button {
		@apply inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition;
	}

	.hero-actions button.primary {
		@apply bg-white text-slate-900 hover:bg-cyan-200;
	}

	.hero-actions button.ghost {
		@apply border border-white/20 bg-white/10 text-white hover:border-white/40 hover:bg-white/20;
	}

	.hero-actions .mobile-only {
		@apply lg:hidden;
	}

	.lesson-shell {
		@apply relative mx-auto grid max-w-6xl gap-8 px-6 py-12 lg:px-10 lg:grid-cols-[minmax(0,1fr)] xl:grid-cols-[minmax(0,1fr)_260px];
	}

	.lesson-article {
		@apply relative rounded-3xl border border-slate-800/80 bg-slate-900/70 p-5 shadow-2xl backdrop-blur sm:p-8;
	}

	.lesson-article :global(.lesson-markdown) {
		color: rgba(226, 232, 240, 0.9);
		font-size: 1rem;
		line-height: 1.55;
		max-width: none;
	}

	.lesson-article :global(.lesson-markdown p) {
		@apply text-[0.97rem];
		margin-bottom: 0.85rem;
	}

	.lesson-article :global(.lesson-markdown h2),
	.lesson-article :global(.lesson-markdown h3),
	.lesson-article :global(.lesson-markdown h4) {
		@apply text-white;
		margin-top: 2rem;
		margin-bottom: 0.75rem;
	}

	.lesson-article :global(.lesson-markdown h2:first-child),
	.lesson-article :global(.lesson-markdown h3:first-child),
	.lesson-article :global(.lesson-markdown h4:first-child) {
		margin-top: 0;
	}

	.lesson-article :global(.lesson-markdown ul),
	.lesson-article :global(.lesson-markdown ol) {
		margin-top: 0.5rem;
		margin-bottom: 0.9rem;
	}

	.lesson-article :global(.lesson-markdown li) {
		@apply leading-6;
		margin-top: 0.3rem;
		margin-bottom: 0.3rem;
	}

	.lesson-article :global(.lesson-markdown blockquote) {
		@apply border-l-2 border-slate-700/60 bg-slate-900/80;
		padding: 0.75rem 1rem;
		margin: 1.25rem 0;
	}

	.lesson-article :global(.lesson-markdown pre) {
		margin: 1.25rem 0;
	}

	.lesson-article :global(.lesson-markdown table) {
		@apply text-sm;
	}

	.lesson-article :global(.lesson-markdown a) {
		color: #67e8f9;
		text-decoration: none;
		transition: color 0.2s ease;
	}

	.lesson-article :global(.lesson-markdown a:hover) {
		color: #a5f3fc;
	}

	.lesson-article :global(.lesson-markdown strong) {
		color: #f8fafc;
		font-weight: 600;
	}

	.lesson-article :global(.lesson-markdown em) {
		color: #e2e8f0;
	}

	.lesson-article :global(.lesson-markdown code) {
		@apply rounded-md bg-slate-800/80 px-1.5 py-[2px] text-[0.85rem] text-cyan-200;
	}

	.lesson-article :global(.lesson-markdown pre) {
		@apply rounded-2xl border border-slate-800/80 bg-slate-950/70 p-4;
		margin: 1.25rem 0;
		font-size: 0.9rem;
	}

	.lesson-article :global(.lesson-markdown pre code) {
		@apply bg-transparent p-0 text-[0.9rem];
	}

	.lesson-article :global(.lesson-markdown hr) {
		border-color: rgba(148, 163, 184, 0.2);
		margin: 1.75rem 0;
	}

	.lesson-article :global(br) {
		display: block;
		height: 0;
		line-height: 0;
		margin: 0;
	}

	.lesson-insights {
		@apply grid gap-4 rounded-2xl border border-slate-700/60 bg-slate-900/70 p-5 sm:grid-cols-2;
	}

	.insight-card {
		@apply flex items-start gap-3 rounded-xl bg-slate-900/60 p-4;
	}

	.insight-card .icon {
		@apply flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-slate-800 text-slate-200;
	}

	.insight-card .label {
		@apply text-xs uppercase tracking-wide text-slate-400;
	}

	.insight-card .value {
		@apply text-base font-semibold text-slate-50;
	}

	.lesson-tags {
		@apply mt-8 flex flex-wrap gap-2;
	}

	.lesson-tags .tag {
		@apply rounded-full border border-slate-700/70 bg-slate-800/70 px-3 py-1 text-xs font-medium text-slate-200;
	}

	.lesson-content {
		@apply mt-6;
	}



	.empty-state {
		@apply text-center text-slate-400;
	}

	.lesson-pagination {
		@apply mt-14 grid gap-4 sm:grid-cols-2;
	}

	.nav-card {
		@apply flex h-full flex-col justify-between gap-3 rounded-2xl border border-slate-700/60 bg-slate-900/70 p-5 text-left transition hover:border-cyan-400/60 hover:bg-slate-900;
	}

	.nav-card.disabled {
		@apply hidden sm:block opacity-0;
	}

	.nav-direction {
		@apply flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400;
	}

	.nav-direction.next {
		@apply justify-end;
	}

	.nav-card strong {
		@apply text-base font-semibold text-slate-50;
	}

	.lesson-toc {
		@apply hidden xl:block;
	}

	.lesson-toc .toc-card {
		@apply sticky top-24 rounded-3xl border border-slate-800/80 bg-slate-900/70 p-5 backdrop-blur;
	}

	.lesson-toc .toc-header {
		@apply mb-4 flex items-center justify-between;
	}

	.lesson-toc .toc-header h2 {
		@apply text-sm font-semibold uppercase tracking-wide text-slate-300;
	}

	.lesson-toc .toc-close {
		@apply inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-slate-200 transition hover:bg-slate-700;
	}

	.lesson-toc .toc-list {
		@apply flex flex-col gap-1;
	}

	.lesson-toc .toc-item {
		@apply w-full rounded-xl px-3 py-2 text-left text-sm text-slate-300 transition hover:bg-slate-800;
	}

	.lesson-toc .toc-item.level-3 {
		@apply pl-6 text-xs;
	}

	.lesson-toc .toc-item.level-4 {
		@apply pl-8 text-xs;
	}

	.lesson-toc .toc-item.active {
		@apply bg-cyan-500/20 text-cyan-200;
	}

	.lesson-toc.mobile-open {
		@apply fixed inset-y-0 right-0 z-40 block w-72 overflow-y-auto bg-slate-950/95 px-5 py-6 shadow-2xl backdrop-blur;
	}

	.lesson-toc.mobile-open .toc-card {
		@apply relative top-auto border border-slate-800/80;
	}

	.lesson-toc-overlay {
		@apply fixed inset-0 z-30 bg-slate-950/70 backdrop-blur;
	}

	.lesson-toast {
		@apply fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium shadow-2xl backdrop-blur;
	}

	.lesson-toast.success {
		@apply border border-emerald-500/40 bg-emerald-500/20 text-emerald-100;
	}

	.lesson-toast.info {
		@apply border border-sky-500/40 bg-sky-500/20 text-sky-100;
	}

	.lesson-toast.error {
		@apply border border-rose-500/40 bg-rose-500/20 text-rose-100;
	}

	.lesson-empty {
		@apply flex min-h-screen items-center justify-center bg-slate-950 p-6 text-slate-100;
	}

	.empty-card {
		@apply max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 p-10 text-center shadow-2xl;
	}

	.empty-card i {
		@apply mb-4 text-4xl text-slate-400;
	}

	@media (max-width: 1279px) {
		.lesson-toc {
			@apply hidden;
		}
	}

	@media (max-width: 1023px) {
		.lesson-insights {
			@apply grid-cols-1;
		}
	}
</style>
