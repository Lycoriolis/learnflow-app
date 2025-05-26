<script lang="ts">
	export let course: any; // Replace 'any' with a specific Course type/interface later

	const placeholderImage = "https://via.placeholder.com/400x225.png?text=Course+Preview";

	// Helper function to determine difficulty badge styling
	function calculateDifficultyClasses(difficulty: string | undefined): string {
		const lowerDifficulty = String(difficulty).toLowerCase();
		switch (lowerDifficulty) {
			case 'beginner':
				return 'bg-green-700/50 text-green-300 border-green-600/70';
			case 'intermediate':
				return 'bg-yellow-700/50 text-yellow-300 border-yellow-600/70';
			case 'advanced':
				return 'bg-red-700/50 text-red-300 border-red-600/70';
			default:
				return 'bg-slate-600/50 text-slate-300 border-slate-500/70';
		}
	}
	$: difficultyClasses = calculateDifficultyClasses(course.difficulty);
</script>

<a
	href={course.contentPath || '#'}
	class="group block rounded-xl overflow-hidden bg-slate-800 border border-slate-700/70 shadow-lg hover:shadow-cyan-500/20 hover:border-slate-600/80 transition-all duration-300 ease-in-out h-full flex flex-col"
>
	<div class="relative w-full aspect-[16/9] overflow-hidden bg-slate-700">
		<img
			src={course.thumbnail || placeholderImage}
			alt={course.title || 'Course image'}
			class="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
		/>
		{#if course.category}
			<span
				class="absolute top-2 right-2 px-2.5 py-1 text-xs font-semibold rounded-full bg-cyan-600/80 text-cyan-100 backdrop-blur-sm border border-cyan-500/50 shadow-md"
			>
				{course.category}
			</span>
		{/if}
	</div>

	<div class="p-5 flex flex-col flex-grow">
		<h3 class="text-lg sm:text-xl font-semibold text-slate-100 mb-2 leading-tight group-hover:text-cyan-400 transition-colors duration-200">
			{course.title || 'Untitled Course'}
		</h3>
		<p class="text-sm text-slate-400 mb-4 line-clamp-3 flex-grow">
			{course.description || 'No description available.'}
		</p>

		<div class="mt-auto space-y-3">
			{#if course.difficulty || course.estimatedTime}
				<div class="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-400">
					{#if course.difficulty}
						<span
							class="inline-flex items-center px-2.5 py-0.5 rounded-full font-medium border {difficultyClasses}"
						>
							{course.difficulty}
						</span>
					{/if}
					{#if course.estimatedTime}
						<span class="inline-flex items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								class="w-4 h-4 mr-1.5 text-slate-500"
							>
								<path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z"
									clip-rule="evenodd"
								/>
							</svg>
							{course.estimatedTime}
						</span>
					{/if}
				</div>
			{/if}

			{#if course.tags && course.tags.length > 0}
				<div class="flex flex-wrap gap-1.5">
					{#each course.tags as tag (tag)}
						<span
							class="px-2 py-0.5 text-xs rounded-full bg-slate-700 text-slate-300 group-hover:bg-slate-600 transition-colors duration-200"
						>
							{tag}
						</span>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</a>