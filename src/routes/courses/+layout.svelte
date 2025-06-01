<script lang="ts">
<script lang="ts">
	import type { LayoutData, ServerContentNode } from './$types'; // Assuming ServerContentNode is exported or defined in $types
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';

	export let data: LayoutData;

	// Helper to generate breadcrumb items
	type BreadcrumbItem = { title: string; href?: string };
	$: breadcrumbs = (() => {
		const items: BreadcrumbItem[] = [
			{ title: 'Home', href: '/' },
			{ title: 'Courses', href: '/courses' }
		];
		if (data.currentPathSlug) {
			const slugParts = data.currentPathSlug.split('/');
			let currentPath = '/courses';

			// Attempt to use titles from loaded nodes (parentTheme, currentCourseOverview, currentContentNode)
			// This logic assumes specific data shapes from layout.server.ts

			if (slugParts.length > 0 && data.parentTheme && data.parentTheme.contentPath?.endsWith(slugParts[0])) {
				items.push({ title: data.parentTheme.title || formatSlug(slugParts[0]), href: data.parentTheme.contentPath });
			} else if (slugParts.length > 0) {
				currentPath += `/${slugParts[0]}`;
				items.push({ title: formatSlug(slugParts[0]), href: currentPath });
			}

			if (slugParts.length > 1 && data.currentCourseOverview && data.currentCourseOverview.contentPath?.endsWith(slugParts.slice(0,2).join('/'))) {
				items.push({ title: data.currentCourseOverview.title || formatSlug(slugParts[1]), href: data.currentCourseOverview.contentPath });
			} else if (slugParts.length > 1) {
				currentPath += `/${slugParts[1]}`;
				items.push({ title: formatSlug(slugParts[1]), href: currentPath });
			}

			if (slugParts.length > 2 && data.currentContentNode && data.currentContentNode.contentType?.startsWith('lesson_')) {
				items.push({ title: data.currentContentNode.title || formatSlug(slugParts[2]) }); // Last item is current page, no href
			} else if (slugParts.length > 2) {
				// Fallback if currentContentNode is not the lesson (e.g. if layout didn't load it)
				items.push({ title: formatSlug(slugParts[2]) });
			}
		}
		return items;
	})();

	function formatSlug(slug: string): string {
		return slug.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
	}

	function isActiveLesson(lessonPath?: string): boolean {
		if (!lessonPath) return false;
		const currentPagePath = $page.url.pathname.endsWith('/') ? $page.url.pathname.slice(0, -1) : $page.url.pathname;
		const targetPath = lessonPath.endsWith('/') ? lessonPath.slice(0, -1) : lessonPath;
		return currentPagePath === targetPath;
	}
</script>

<div class="course-layout-container flex flex-col md:flex-row min-h-screen bg-white dark:bg-gray-900">
	<!-- Sidebar: Only shown if there's a course overview and lessons -->
	{#if data.currentCourseOverview && data.siblingLessons && data.siblingLessons.length > 0}
		<aside class="course-sidebar w-full md:w-72 lg:w-80 flex-shrink-0 bg-slate-50 dark:bg-gray-800/50 border-r border-slate-200 dark:border-gray-700/60 md:sticky md:top-0 md:h-screen md:overflow-y-auto">
			<div class="p-4 sm:p-6 sticky top-0 bg-slate-50 dark:bg-gray-800/80 backdrop-blur-sm z-10 border-b border-slate-200 dark:border-gray-700/60">
				<a href={data.currentCourseOverview.contentPath || `/courses/${data.currentCourseOverview.id?.replace('_index','')}`} class="block">
					<h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
						{data.currentCourseOverview.title || 'Course Menu'}
					</h2>
				</a>
				{#if data.currentCourseOverview.description}
					<p class="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{data.currentCourseOverview.description}</p>
				{/if}
			</div>
			<nav class="lessons-nav p-4 sm:p-6 space-y-1">
				{#each data.siblingLessons as lesson (lesson.id)}
					{@const isActive = isActiveLesson(lesson.contentPath)}
					<a
						href={lesson.contentPath}
						class="flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150 ease-in-out group"
						class:bg-teal-500={isActive}
						class:text-white={isActive}
						class:hover:bg-teal-500={isActive}
						class:hover:text-white={isActive}
						class:text-gray-700={!isActive}
						class:dark:text-gray-300={!isActive}
						class:hover:bg-slate-200={!isActive}
						class:dark:hover:bg-gray-700={!isActive}
						aria-current={isActive ? 'page' : undefined}
					>
						<Icon icon={lesson.contentType?.includes('quiz') ? 'mdi:help-circle-outline' : 'mdi:book-open-variant-outline'} class="w-5 h-5 mr-3 flex-shrink-0 {isActive ? 'text-white' : 'text-gray-400 dark:text-gray-500 group-hover:text-teal-600 dark:group-hover:text-teal-500'}" />
						<span class="truncate">{lesson.title || 'Untitled Lesson'}</span>
					</a>
				{/each}
			</nav>
		</aside>
	{/if}

	<!-- Main Content Area -->
	<main class="course-main-content flex-grow p-4 sm:p-6 md:p-8 min-w-0" class:md:ml-0={!(data.currentCourseOverview && data.siblingLessons && data.siblingLessons.length > 0)}>
		<!-- Breadcrumbs -->
		{#if breadcrumbs.length > 0}
			<nav aria-label="Breadcrumb" class="mb-6 sm:mb-8">
				<ol class="flex items-center space-x-1.5 text-sm text-gray-500 dark:text-gray-400">
					{#each breadcrumbs as item, i (item.href || item.title)}
						<li>
							{#if item.href && i < breadcrumbs.length - 1}
								<a href={item.href} class="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
									{item.title}
								</a>
							{:else}
								<span class="font-medium text-gray-700 dark:text-gray-200">{item.title}</span>
							{/if}
						</li>
						{#if i < breadcrumbs.length - 1}
							<li aria-hidden="true">
								<Icon icon="mdi:chevron-right" class="w-4 h-4 text-gray-400 dark:text-gray-500" />
							</li>
						{/if}
					{/each}
				</ol>
			</nav>
		{/if}

		<slot /> <!-- Page content (theme overview, course overview, lesson content) -->
	</main>
</div>

<!-- Removed old <style> block as styles are now using Tailwind utility classes -->
