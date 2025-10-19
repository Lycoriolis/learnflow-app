<script lang="ts">
	import type { PageData } from './$types';
	import CourseCard from '$lib/components/CourseCard.svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { user } from '$lib/stores/authStore';
	import { userProgressStore } from '$lib/stores/userProgress';
	import type { CourseProgress } from '$lib/stores/userProgress';
	import type { ContentNode } from '$lib/services/contentService';

	export let data: PageData;

	type CategoryOption = { id: string; title: string; count: number };
	type OverviewCard = { label: string; value: string; icon: string };
	type DifficultyOption = { id: string; label: string };

	interface CourseSummary extends ContentNode {
		contentPath: string;
		categorySlug: string;
		progress: number;
		isCompleted: boolean;
		lastAccessedLabel: string;
		timeSpentMinutes: number;
		completedLessons: number;
		totalLessons: number;
		popularityScore: number;
		metadata?: (ContentNode['metadata'] & Record<string, unknown>);
	}

	const courseProgressStore = userProgressStore.courseProgress;

	let progressInitialised = false;
	let searchQuery = '';
	let selectedCategory = 'all';
	let selectedDifficulty = 'all';
	let sortBy: 'popularity' | 'title' | 'difficulty' | 'newest' | 'progress' = 'popularity';

	let courseProgressMap: Record<string, CourseProgress> = {};
	let processedCourses: CourseSummary[] = [];
	let filteredCourses: CourseSummary[] = [];
	let categoryOptions: CategoryOption[] = [];
	let metrics = {
		total: 0,
		completed: 0,
		inProgress: 0,
		lessonsCompleted: 0,
		totalTimeLabel: '0m'
	};
	let overviewCards: OverviewCard[] = [];

	function slugify(value: string): string {
		return String(value)
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '');
	}

	function toTitleCase(value: string): string {
		return value
			.replace(/[-_]+/g, ' ')
			.replace(/\s+/g, ' ')
			.trim()
			.replace(/\b\w/g, (char) => char.toUpperCase());
	}

	function formatRelativeTime(input: Date | number | null | undefined): string {
		if (!input) return 'Not started yet';
		const date = input instanceof Date ? input : new Date(input);
		if (Number.isNaN(date.getTime())) return 'Not started yet';

		const diff = Date.now() - date.getTime();
		const minute = 60 * 1000;
		const hour = 60 * minute;
		const day = 24 * hour;

		if (diff < minute) return 'Just now';
		if (diff < hour) {
			const minutes = Math.floor(diff / minute);
			return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
		}
		if (diff < day) {
			const hours = Math.floor(diff / hour);
			return `${hours} hour${hours === 1 ? '' : 's'} ago`;
		}
		const days = Math.floor(diff / day);
		if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
		const weeks = Math.floor(days / 7);
		if (weeks < 5) return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
		const months = Math.floor(days / 30);
		if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`;
		const years = Math.floor(days / 365);
		return `${years} year${years === 1 ? '' : 's'} ago`;
	}

	function formatMinutes(totalMinutes: number): string {
		if (!totalMinutes) return '0m';
		if (totalMinutes < 60) return `${totalMinutes}m`;
		const hours = totalMinutes / 60;
		if (hours < 24) {
			const rounded = hours >= 10 ? Math.round(hours) : parseFloat(hours.toFixed(1));
			return `${rounded}h`;
		}
		const days = hours / 24;
		const roundedDays = days >= 10 ? Math.round(days) : parseFloat(days.toFixed(1));
		return `${roundedDays}d`;
	}

	function deriveCategory(node: any): { slug: string; label: string } {
		if (node?.category) {
			const label = String(node.category);
			return { slug: slugify(label), label };
		}
		if (node?.categoryPath) {
			const segments = String(node.categoryPath).split('/').filter(Boolean);
			if (segments.length) {
				const label = toTitleCase(segments[0]);
				return { slug: slugify(segments[0]), label };
			}
		}
		if (node?.contentPath) {
			const segments = String(node.contentPath).split('/').filter(Boolean);
			if (segments.length > 1) {
				const label = toTitleCase(segments[1]);
				return { slug: slugify(segments[1]), label };
			}
		}
		return { slug: 'general', label: 'General' };
	}

	function parseTags(raw: unknown): string[] {
		if (Array.isArray(raw)) {
			return raw.map(String);
		}
		if (typeof raw === 'string') {
			return raw.split(',').map((tag) => tag.trim()).filter(Boolean);
		}
		return [];
	}

	function mapCourseNode(node: any): CourseSummary {
		const { slug, label } = deriveCategory(node);
		const tags = parseTags(node?.tags);
		const level = typeof node?.difficulty === 'string' ? toTitleCase(node.difficulty) : undefined;
		const metadata = (typeof node?.metadata === 'object' && node.metadata !== null)
			? { ...(node.metadata as Record<string, unknown>) }
			: undefined;
		const totalLessons = Array.isArray(node?.children) ? node.children.length : Number(node?.totalLessons) || 0;
		const contentPath = typeof node?.contentPath === 'string'
			? node.contentPath
			: `/courses/${node?.id ?? ''}`;
		const popularityRaw = metadata && typeof (metadata as Record<string, unknown>).popularity === 'number'
			? (metadata as Record<string, number>).popularity
			: 0;

		return {
			id: String(node?.id ?? slug),
			title: node?.title ?? toTitleCase(node?.id ?? 'Course'),
			description: node?.description,
			category: label,
			categorySlug: slug,
			tags,
			contentPath,
			type: 'course',
			level: level as CourseSummary['level'],
			duration: typeof node?.estimatedTime === 'string' ? node.estimatedTime : node?.duration,
			metadata,
			progress: 0,
			isCompleted: false,
			lastAccessedLabel: 'Not started yet',
			timeSpentMinutes: 0,
			completedLessons: 0,
			totalLessons,
			popularityScore: popularityRaw
		} as CourseSummary;
	}

	function withProgress(course: CourseSummary, progress: CourseProgress | undefined): CourseSummary {
		if (!progress) {
			return { ...course, popularityScore: course.popularityScore || (course.totalLessons || 0) };
		}

		const totalLessons = progress.totalLessons || course.totalLessons;
		const completedLessons = progress.completedLessons?.length ?? course.completedLessons;
		const percentage = typeof progress.progressPercentage === 'number'
			? Math.min(100, Math.round(progress.progressPercentage))
			: totalLessons > 0
				? Math.min(100, Math.round((completedLessons / totalLessons) * 100))
				: course.progress;

		const lastAccessed = progress.lastAccessedAt instanceof Date
			? progress.lastAccessedAt
			: progress.lastAccessedAt
				? new Date(progress.lastAccessedAt)
				: null;

		const timeSpent = typeof progress.timeSpent === 'number'
			? Math.max(0, Math.round(progress.timeSpent))
			: course.timeSpentMinutes;

		let popularityScore = course.popularityScore;
		if (timeSpent) popularityScore = Math.max(popularityScore, timeSpent);
		if (completedLessons) popularityScore = Math.max(popularityScore, completedLessons * 5);

		return {
			...course,
			totalLessons,
			completedLessons,
			progress: percentage,
			isCompleted: percentage >= 100,
			timeSpentMinutes: timeSpent,
			lastAccessedLabel: formatRelativeTime(lastAccessed),
			popularityScore
		};
	}

	function rebuildCourses() {
		const source: any[] = Array.isArray(data.courses) ? data.courses : [];
		const baseCourses = source.map(mapCourseNode);

		processedCourses = baseCourses.map((course) => withProgress(course, courseProgressMap[course.id]));
	}

	function deriveCategoriesFromCourses(courses: CourseSummary[]): CategoryOption[] {
		const map = new Map<string, CategoryOption>();
		courses.forEach((course) => {
			const id = course.categorySlug || 'general';
			const title = course.category || toTitleCase(id);
			if (!map.has(id)) {
				map.set(id, { id, title, count: 0 });
			}
			const entry = map.get(id);
			if (entry) entry.count += 1;
		});
		return Array.from(map.values()).sort((a, b) => b.count - a.count || a.title.localeCompare(b.title));
	}

	function computeMetrics(courses: CourseSummary[]) {
		const summary = courses.reduce(
			(acc, course) => {
				acc.total += 1;
				if (course.isCompleted) acc.completed += 1;
				else if (course.progress > 0) acc.inProgress += 1;
				acc.lessonsCompleted += course.completedLessons;
				acc.totalTime += course.timeSpentMinutes;
				return acc;
			},
			{ total: 0, completed: 0, inProgress: 0, lessonsCompleted: 0, totalTime: 0 } as {
				total: number;
				completed: number;
				inProgress: number;
				lessonsCompleted: number;
				totalTime: number;
			}
		);

		return {
			total: summary.total,
			completed: summary.completed,
			inProgress: summary.inProgress,
			lessonsCompleted: summary.lessonsCompleted,
			totalTimeLabel: formatMinutes(summary.totalTime)
		};
	}

	function readMetadataValue(metadata: CourseSummary['metadata'], key: string): unknown {
		if (!metadata || typeof metadata !== 'object') return undefined;
		const record = metadata as Record<string, unknown>;
		return key in record ? record[key] : undefined;
	}

	function toComparableDate(value: unknown): number {
		if (value instanceof Date) return value.getTime();
		if (typeof value === 'number') return value;
		if (typeof value === 'string') {
			const parsed = Date.parse(value);
			return Number.isNaN(parsed) ? 0 : parsed;
		}
		return 0;
	}

	function filterAndSortCourses(
		courses: CourseSummary[],
		query: string,
		category: string,
		difficulty: string,
		sort: typeof sortBy
	): CourseSummary[] {
		let filtered = [...courses];

		if (query.trim()) {
			const q = query.toLowerCase();
			filtered = filtered.filter((course) =>
				course.title?.toLowerCase().includes(q) ||
				course.description?.toLowerCase().includes(q) ||
				course.tags?.some((tag) => tag.toLowerCase().includes(q))
			);
		}

		if (category !== 'all') {
			filtered = filtered.filter((course) => course.categorySlug === category);
		}

		if (difficulty !== 'all') {
			filtered = filtered.filter((course) => course.level?.toLowerCase() === difficulty);
		}

		switch (sort) {
			case 'title':
				filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
				break;
			case 'difficulty': {
				const order = { beginner: 1, intermediate: 2, advanced: 3 } as const;
				const weight = (value: string | undefined) => {
					const key = value?.toLowerCase() as keyof typeof order | undefined;
					return key ? order[key] ?? 99 : 99;
				};
				filtered.sort((a, b) => weight(a.level) - weight(b.level));
				break;
			}
			case 'newest':
				filtered.sort((a, b) => {
					const aDate = toComparableDate(readMetadataValue(a.metadata, 'updatedAt') ?? readMetadataValue(a.metadata, 'createdAt'));
					const bDate = toComparableDate(readMetadataValue(b.metadata, 'updatedAt') ?? readMetadataValue(b.metadata, 'createdAt'));
					return bDate - aDate;
				});
				break;
			case 'progress':
				filtered.sort((a, b) => b.progress - a.progress || b.popularityScore - a.popularityScore);
				break;
			default:
				filtered.sort((a, b) => b.popularityScore - a.popularityScore || b.progress - a.progress);
		}

		return filtered;
	}

	$: courseProgressMap = $courseProgressStore || {};
	$: rebuildCourses();
	$: categoryOptions = deriveCategoriesFromCourses(processedCourses);
	$: metrics = computeMetrics(processedCourses);
	$: overviewCards = [
		{ label: 'Total Courses', value: String(metrics.total), icon: 'fa-books' },
		{ label: 'In Progress', value: String(metrics.inProgress), icon: 'fa-bars-progress' },
		{ label: 'Completed', value: String(metrics.completed), icon: 'fa-circle-check' },
		{ label: 'Time Logged', value: metrics.totalTimeLabel, icon: 'fa-clock' }
	] satisfies OverviewCard[];
	$: filteredCourses = filterAndSortCourses(processedCourses, searchQuery, selectedCategory, selectedDifficulty, sortBy);

	$: if (!progressInitialised && browser && $user?.uid) {
		progressInitialised = true;
		userProgressStore.initializeUserProgress($user.uid);
	}

	const difficultyOptions = [
		{ id: 'beginner', label: 'Beginner' },
		{ id: 'intermediate', label: 'Intermediate' },
		{ id: 'advanced', label: 'Advanced' }
	] satisfies DifficultyOption[];

	function getOverviewCards(): OverviewCard[] {
		return overviewCards;
	}

	function getCategoryOptions(): CategoryOption[] {
		return categoryOptions;
	}

	function getDifficultyOptions(): DifficultyOption[] {
		return difficultyOptions;
	}

	function getFilteredCourses(): CourseSummary[] {
		return filteredCourses;
	}

	function clearFilters() {
		searchQuery = '';
		selectedCategory = 'all';
		selectedDifficulty = 'all';
	}

	function navigateToAdvancedBrowse() {
		goto('/courses/browse');
	}

	function navigateToSearch() {
		goto('/courses/search');
	}
</script>

<svelte:head>
	<title>Courses | LearnFlow</title>
	<meta name="description" content="Discover and explore our comprehensive range of courses designed for all skill levels." />
</svelte:head>

<div class="courses-discovery-hub min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-50 p-6 sm:p-8 md:p-10">
	<!-- Header Section -->
	<header class="mb-12 text-center">
		<h1 class="text-5xl sm:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-500 mb-4">
			Discover Courses
		</h1>
		<p class="text-xl sm:text-2xl text-slate-400 max-w-3xl mx-auto mb-8">
			Explore our comprehensive library of courses designed to accelerate your learning journey
		</p>
		
		<!-- Quick Actions -->
		<div class="flex flex-wrap justify-center gap-4 mb-8">
			<button 
				on:click={navigateToAdvancedBrowse}
				class="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
			>
				📁 Browse All Courses
			</button>
			<button 
				on:click={navigateToSearch}
				class="px-6 py-3 bg-gradient-to-r from-red-600 to-indigo-600 hover:from-red-500 hover:to-indigo-500 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
			>
				🔍 Advanced Search
			</button>
		</div>

		<!-- Overview Metrics -->
		{#if overviewCards.length}
			<div class="mx-auto max-w-5xl">
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					{#each getOverviewCards() as cardItem, index (index)}
						{@const card = cardItem as OverviewCard}
						<div class="rounded-2xl border border-white/10 bg-white/5 px-5 py-6 text-left shadow-lg">
							<div class="flex items-center justify-between text-sm text-slate-300">
								<span>{card.label}</span>
								<i class={`fas ${card.icon} text-slate-400`}></i>
							</div>
							<p class="mt-3 text-3xl font-semibold text-white">{card.value}</p>
							{#if card.label === 'Time Logged'}
								<p class="mt-2 text-xs text-slate-400">Tracked from your study sessions</p>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</header>

	<!-- Search and Filter Section -->
	<section class="mb-12 max-w-6xl mx-auto">
		<div class="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
			<!-- Search Bar -->
			<div class="mb-6">
				<div class="relative">
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Search courses, topics, or skills..."
						class="w-full px-6 py-4 pl-12 bg-slate-700/50 border border-slate-600 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
					>
					<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
						<svg class="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
						</svg>
					</div>
				</div>
			</div>

			<!-- Filter Controls -->
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
				<!-- Category Filter -->
				<div>
					<label class="block text-sm font-medium text-slate-300 mb-2" for="category-filter">Category</label>
					<select 
						id="category-filter"
						bind:value={selectedCategory}
						class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
					>
						<option value="all">All Categories</option>
						{#each getCategoryOptions() as categoryOption, index (index)}
							{@const category = categoryOption as CategoryOption}
							<option value={category.id}>{category.title} ({category.count})</option>
						{/each}
					</select>
				</div>

				<!-- Difficulty Filter -->
				<div>
					<label class="block text-sm font-medium text-slate-300 mb-2" for="difficulty-filter">Difficulty</label>
					<select 
						id="difficulty-filter"
						bind:value={selectedDifficulty}
						class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
					>
						<option value="all">All Levels</option>
						{#each getDifficultyOptions() as difficultyOption, index (index)}
							{@const option = difficultyOption as DifficultyOption}
							<option value={option.id}>{option.label}</option>
						{/each}
					</select>
				</div>

				<!-- Sort Options -->
				<div>
					<label class="block text-sm font-medium text-slate-300 mb-2" for="sort-filter">Sort By</label>
					<select 
						id="sort-filter"
						bind:value={sortBy}
						class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
					>
						<option value="popularity">Most Popular</option>
						<option value="title">Alphabetical</option>
						<option value="difficulty">Difficulty</option>
						<option value="newest">Newest First</option>
						<option value="progress">Learning Progress</option>
					</select>
				</div>
			</div>
		</div>
	</section>

	<!-- Results Summary -->
	<section class="mb-8 max-w-6xl mx-auto">
		<div class="flex justify-between items-center">
			<p class="text-slate-400">
				Showing {filteredCourses.length} of {metrics.total} courses
				{#if searchQuery}<span class="text-cyan-400">for "{searchQuery}"</span>{/if}
			</p>
			{#if searchQuery || selectedCategory !== 'all' || selectedDifficulty !== 'all'}
				<button 
					on:click={clearFilters}
					class="text-cyan-400 hover:text-cyan-300 text-sm underline"
				>
					Clear filters
				</button>
			{/if}
		</div>
	</section>

	<!-- Courses Grid -->
	<section class="max-w-7xl mx-auto">
		{#if data.error}
			<div class="text-center py-12">
				<div class="bg-red-900/30 border border-red-700 rounded-lg p-6 max-w-md mx-auto">
					<p class="text-red-400">{data.error}</p>
				</div>
			</div>
		{:else if filteredCourses.length === 0}
			<div class="text-center py-20">
				<div class="bg-slate-800/70 rounded-xl border border-slate-700 shadow-xl p-8 max-w-md mx-auto">
					<svg class="mx-auto h-16 w-16 text-slate-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<h3 class="text-xl font-medium text-slate-300 mb-2">No courses found</h3>
					<p class="text-slate-400">
						{#if searchQuery || selectedCategory !== 'all' || selectedDifficulty !== 'all'}
							Try adjusting your search criteria or filters.
						{:else}
							No courses are available at the moment.
						{/if}
					</p>
				</div>
			</div>
		{:else}
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
				{#each getFilteredCourses() as courseItem, index (index)}
					{@const course = courseItem as CourseSummary}
					<CourseCard
						{course}
						progress={course.progress}
						isCompleted={course.isCompleted}
						on:select={() => goto(course.contentPath)}
					/>
				{/each}
			</div>
		{/if}
	</section>

	<!-- Categories Section -->
	{#if categoryOptions.length > 0}
		<section class="mt-16 max-w-6xl mx-auto">
			<h2 class="text-3xl font-semibold text-slate-200 mb-8 text-center">Browse by Category</h2>
			<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{#each getCategoryOptions() as categoryOption, index (index)}
					{@const category = categoryOption as CategoryOption}
					<a
						href="/courses/category/{category.id}"
						class="group p-6 bg-slate-800/40 border border-slate-700 rounded-xl hover:bg-slate-700/40 hover:border-slate-600 transition-all duration-200"
					>
						<div class="text-center">
							<h3 class="font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">
								{category.title}
							</h3>
							<p class="text-sm text-slate-400 mt-1">
								{category.count} courses
							</p>
						</div>
					</a>
				{/each}
			</div>
		</section>
	{/if}
</div>

<style>
	.courses-discovery-hub {
		min-height: 100vh;
	}
</style>