<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	export let data: PageData;

	// Tree view state
	let expandedFolders = new Set<string>();
	let selectedItem: string | null = null;
	let searchQuery = '';
	let showHiddenItems = false;
	let sortBy: 'name' | 'type' | 'lastModified' = 'name';
	let viewMode: 'tree' | 'grid' = 'tree';

	// Filter and search state
	$: filteredContent = filterContent(data.contentTree || [], searchQuery);

	function filterContent(content: any[], query: string) {
		if (!query.trim()) return content;
		
		const q = query.toLowerCase();
		return content.filter(item => 
			item.title?.toLowerCase().includes(q) ||
			item.description?.toLowerCase().includes(q) ||
			item.tags?.some((tag: string) => tag.toLowerCase().includes(q)) ||
			item.children?.some((child: any) => 
				child.title?.toLowerCase().includes(q) ||
				child.description?.toLowerCase().includes(q)
			)
		);
	}

	function toggleFolder(folderId: string) {
		if (expandedFolders.has(folderId)) {
			expandedFolders.delete(folderId);
		} else {
			expandedFolders.add(folderId);
		}
		expandedFolders = new Set(expandedFolders);
	}

	function selectItem(itemId: string, itemPath?: string) {
		selectedItem = itemId;
		if (itemPath) {
			goto(itemPath);
		}
	}

	function expandAll() {
		expandedFolders = new Set(data.contentTree?.map(item => item.id) || []);
	}

	function collapseAll() {
		expandedFolders.clear();
		expandedFolders = new Set();
	}

	onMount(() => {
		// Auto-expand top level categories
		if (data.contentTree) {
			expandedFolders = new Set(data.contentTree.slice(0, 3).map(item => item.id));
		}
	});
</script>

<svelte:head>
	<title>Browse Courses | LearnFlow</title>
	<meta name="description" content="Browse and explore our complete course library with an intuitive file manager interface." />
</svelte:head>

<div class="browse-courses min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-50 p-6 sm:p-8">
	<!-- Header -->
	<header class="mb-8">
		<div class="flex items-center justify-between mb-6">
			<div>
				<h1 class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400 mb-2">
					Browse Courses
				</h1>
				<p class="text-slate-400">Explore our complete course library with advanced browsing tools</p>
			</div>
			
			<!-- View Controls -->
			<div class="flex items-center gap-4">
				<div class="flex bg-slate-800 rounded-lg p-1">
					<button 
						on:click={() => viewMode = 'tree'}
						class="px-3 py-2 rounded text-sm font-medium transition-colors {viewMode === 'tree' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'}"
					>
						🌳 Tree
					</button>
					<button 
						on:click={() => viewMode = 'grid'}
						class="px-3 py-2 rounded text-sm font-medium transition-colors {viewMode === 'grid' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'}"
					>
						📊 Grid
					</button>
				</div>
			</div>
		</div>

		<!-- Search and Controls -->
		<div class="flex flex-col md:flex-row gap-4 mb-6">
			<!-- Search Bar -->
			<div class="flex-1 relative">
				<input 
					bind:value={searchQuery}
					placeholder="Search courses, categories, or content..."
					class="w-full px-4 py-3 pl-12 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
				/>
				<svg class="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				</svg>
			</div>

			<!-- Controls -->
			<div class="flex gap-2">
				<button 
					on:click={expandAll}
					class="px-4 py-3 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg text-sm font-medium transition-colors"
				>
					Expand All
				</button>
				<button 
					on:click={collapseAll}
					class="px-4 py-3 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg text-sm font-medium transition-colors"
				>
					Collapse All
				</button>
				
				<select 
					bind:value={sortBy}
					class="px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500"
				>
					<option value="name">Sort by Name</option>
					<option value="type">Sort by Type</option>
					<option value="lastModified">Sort by Date</option>
				</select>
			</div>
		</div>
	</header>

	<!-- Content Browser -->
	<main class="max-w-7xl mx-auto">
		{#if data.error}
			<div class="text-center py-12">
				<div class="bg-red-900/30 border border-red-700 rounded-lg p-6 max-w-md mx-auto">
					<p class="text-red-400">{data.error}</p>
				</div>
			</div>
		{:else if viewMode === 'tree'}
			<!-- Tree View -->
			<div class="bg-slate-800/40 border border-slate-700 rounded-xl overflow-hidden">
				<div class="border-b border-slate-700 px-6 py-4">
					<h2 class="text-lg font-semibold text-slate-200">Course Library Structure</h2>
					<p class="text-sm text-slate-400 mt-1">
						{filteredContent.length} categories • Click to expand folders
					</p>
				</div>
				
				<div class="p-6">
					{#if filteredContent.length === 0}
						<div class="text-center py-12">
							<p class="text-slate-400">No content found matching your search.</p>
						</div>
					{:else}
						<div class="tree-view">
							{#each filteredContent as category (category.id)}
								<div class="tree-item">
									<!-- Category Header -->
									<div class="tree-node category-node">
										<button 
											on:click={() => toggleFolder(category.id)}
											class="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-slate-700/50 transition-colors text-left group"
										>
											<span class="text-slate-400 transition-transform {expandedFolders.has(category.id) ? 'rotate-90' : ''}">
												▶
											</span>
											<span class="text-xl">📁</span>
											<div class="flex-1">
												<div class="font-medium text-slate-200 group-hover:text-cyan-400 transition-colors">
													{category.title}
												</div>
												{#if category.description}
													<div class="text-sm text-slate-400 mt-1">
														{category.description}
													</div>
												{/if}
											</div>
											<span class="text-xs text-slate-500 bg-slate-700 px-2 py-1 rounded">
												{category.children?.length || 0} items
											</span>
										</button>
									</div>

									<!-- Category Children -->
									{#if expandedFolders.has(category.id) && category.children}
										<div class="tree-children ml-6 border-l border-slate-600 pl-4 mt-2">
											{#each category.children as course (course.id)}
												<div class="tree-node course-node">
													<button 
														on:click={() => selectItem(course.id, course.contentPath)}
														class="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-slate-700/50 transition-colors text-left group {selectedItem === course.id ? 'bg-cyan-900/30 border border-cyan-700' : ''}"
													>
														<span class="text-slate-400">
															{#if course.contentType === 'course_overview'}
																📚
															{:else if course.contentType === 'lesson_content'}
																📄
															{:else}
																📋
															{/if}
														</span>
														<div class="flex-1">
															<div class="font-medium text-slate-200 group-hover:text-cyan-400 transition-colors">
																{course.title}
															</div>
															{#if course.description}
																<div class="text-sm text-slate-400 mt-1 line-clamp-1">
																	{course.description}
																</div>
															{/if}
															{#if course.difficulty}
																<div class="text-xs text-slate-500 mt-1">
																	Difficulty: {course.difficulty}
																</div>
															{/if}
														</div>
														{#if course.estimatedTime}
															<span class="text-xs text-slate-500 bg-slate-700 px-2 py-1 rounded">
																{course.estimatedTime}
															</span>
														{/if}
													</button>
												</div>
											{/each}
										</div>
									{/if}
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		{:else}
			<!-- Grid View -->
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{#each filteredContent as category (category.id)}
					<div class="bg-slate-800/40 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all duration-200 group">
						<div class="flex items-center gap-3 mb-4">
							<span class="text-2xl">📁</span>
							<div>
								<h3 class="font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">
									{category.title}
								</h3>
								<p class="text-xs text-slate-500">
									{category.children?.length || 0} courses
								</p>
							</div>
						</div>
						
						{#if category.description}
							<p class="text-sm text-slate-400 mb-4 line-clamp-2">
								{category.description}
							</p>
						{/if}

						<div class="space-y-2">
							{#each (category.children || []).slice(0, 3) as course (course.id)}
								<a 
									href={course.contentPath}
									class="block p-2 rounded-lg hover:bg-slate-700/50 transition-colors group/course"
								>
									<div class="flex items-center gap-2">
										<span class="text-sm">
											{#if course.contentType === 'course_overview'}📚{:else}📄{/if}
										</span>
										<span class="text-sm text-slate-300 group-hover/course:text-cyan-400 transition-colors truncate">
											{course.title}
										</span>
									</div>
								</a>
							{/each}
							
							{#if (category.children?.length || 0) > 3}
								<a 
									href="/courses/category/{category.id}"
									class="block p-2 rounded-lg hover:bg-slate-700/50 transition-colors text-xs text-cyan-400 hover:text-cyan-300"
								>
									+{(category.children?.length || 0) - 3} more courses...
								</a>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</main>
</div>

<style>
	.line-clamp-1 {
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
