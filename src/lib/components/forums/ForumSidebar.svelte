<script lang="ts">
  export let categories: Array<{id: string, name: string, icon?: string}> = [];
  export let filterCategory: string;
</script>

<div class="space-y-6">
  <!-- Categories Sidebar -->
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Categories</h3>
    <ul class="space-y-2">
      <li>
        <a href="/forums"
           class="block px-3 py-2 rounded-md text-sm font-medium transition-colors {filterCategory === 'all' ? 'bg-indigo-100 dark:bg-indigo-700 text-indigo-700 dark:text-indigo-100' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}">
          <i class="fas fa-list mr-2"></i> All Categories
        </a>
      </li>
      {#each categories as category}
        <li>
          <a href={`/forums/category/${category.id}`}
             class="block px-3 py-2 rounded-md text-sm font-medium transition-colors {filterCategory === category.id ? 'bg-indigo-100 dark:bg-indigo-700 text-indigo-700 dark:text-indigo-100' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}">
            <i class={`fas ${category.icon} mr-2`}></i> {category.name}
          </a>
        </li>
      {/each}
    </ul>
  </div>

  <!-- Learning Resources -->
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Learning Resources</h3>
    <ul class="space-y-2 text-sm">
      <li>
        <a href="/resources/study-guides" class="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center">
          <i class="fas fa-book mr-2"></i> Study Guides
        </a>
      </li>
      <li>
        <a href="/resources/code-examples" class="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center">
          <i class="fas fa-code mr-2"></i> Code Examples
        </a>
      </li>
      <li>
        <a href="/resources/practice-exercises" class="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center">
          <i class="fas fa-laptop-code mr-2"></i> Practice Exercises
        </a>
      </li>
      <li>
        <a href="/resources/community-projects" class="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center">
          <i class="fas fa-project-diagram mr-2"></i> Community Projects
        </a>
      </li>
    </ul>
  </div>
</div>