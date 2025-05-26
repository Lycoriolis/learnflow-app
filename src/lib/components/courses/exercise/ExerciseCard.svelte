<script lang="ts">
	export let exercise: any; // Replace 'any' with a specific Exercise type/interface later

	// Reactive declarations for difficulty classes
	$: difficultyString = String(exercise?.difficulty || '').toLowerCase();

	$: difficultyClass = (() => {
		switch (difficultyString) {
			case 'beginner':
				return 'bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300';
			case 'intermediate':
				return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-700/30 dark:text-yellow-300';
			case 'advanced':
				return 'bg-red-100 text-red-700 dark:bg-red-700/30 dark:text-red-300';
			default:
				return 'bg-slate-100 text-slate-700 dark:bg-slate-700/30 dark:text-slate-300';
		}
	})();

	$: difficultyDotClass = (() => {
		switch (difficultyString) {
			case 'beginner':
				return 'bg-green-500';
			case 'intermediate':
				return 'bg-yellow-500';
			case 'advanced':
				return 'bg-red-500';
			default:
				return 'bg-slate-500';
		}
	})();
</script>

<a
	href={exercise.contentPath || '#'}
	class="group block rounded-xl border border-slate-700/80 bg-slate-800/60 p-5 shadow-lg transition-all duration-300 ease-in-out hover:shadow-blue-500/20 hover:border-blue-500/50 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
>
	<article class="flex h-full flex-col">
		<div class="mb-3">
			<h3 class="text-lg font-semibold text-slate-100 group-hover:text-blue-400 transition-colors duration-200">
				{exercise.title || 'Untitled Exercise'}
			</h3>
		</div>

		<p class="mb-4 text-sm text-slate-400 line-clamp-3 flex-grow">
			{exercise.description || 'No description available.'}
		</p>

		<div class="mt-auto space-y-3">
			<div class="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs">
				{#if exercise.category}
					<span class="inline-flex items-center rounded-md bg-slate-700 px-2.5 py-1 font-medium text-slate-300">
						{exercise.category}
					</span>
				{/if}
				{#if exercise.difficulty}
					<span class="inline-flex items-center rounded-md px-2.5 py-1 font-medium {difficultyClass}">
						<span class="mr-1.5 h-2 w-2 rounded-full {difficultyDotClass}"></span>
						{exercise.difficulty}
					</span>
				{/if}
				{#if exercise.estimatedTime}
					<span class="inline-flex items-center text-slate-400">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							class="mr-1 h-4 w-4"
						>
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z"
								clip-rule="evenodd"
							/>
						</svg>
						{exercise.estimatedTime}
					</span>
				{/if}
			</div>

			{#if exercise.tags && Array.isArray(exercise.tags) && exercise.tags.length > 0}
				<div class="flex flex-wrap gap-1.5">
					{#each exercise.tags as tag (tag)}
						<span
							class="rounded-full bg-slate-700/70 px-2.5 py-0.5 text-xs font-medium text-slate-400 group-hover:text-slate-300 transition-colors duration-200"
						>
							{tag}
						</span>
					{/each}
				</div>
			{/if}
		</div>
	</article>
</a>