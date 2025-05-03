<script lang="ts">
  export let title: string;
  export let value: string;
  export let icon: string = 'fa-chart-line';
  export let color: 'blue' | 'green' | 'red' | 'yellow' | 'indigo' | 'purple' | 'gray' = 'blue';

  // Color style mapping types
  type ColorStyle = {
    bg: string;
    text: string;
  };

  type ColorClasses = {
    [key in typeof color]: ColorStyle;
  };

  // Map color names to Tailwind CSS classes
  const colorClasses: ColorClasses = {
    blue: {
      bg: 'bg-blue-100 dark:bg-blue-900',
      text: 'text-blue-600 dark:text-blue-300'
    },
    green: {
      bg: 'bg-green-100 dark:bg-green-900',
      text: 'text-green-600 dark:text-green-300'
    },
    red: {
      bg: 'bg-red-100 dark:bg-red-900',
      text: 'text-red-600 dark:text-red-300'
    },
    yellow: {
      bg: 'bg-yellow-100 dark:bg-yellow-900',
      text: 'text-yellow-600 dark:text-yellow-300'
    },
    indigo: {
      bg: 'bg-indigo-100 dark:bg-indigo-900',
      text: 'text-indigo-600 dark:text-indigo-300'
    },
    purple: {
      bg: 'bg-purple-100 dark:bg-purple-900',
      text: 'text-purple-600 dark:text-purple-300'
    },
    gray: {
      bg: 'bg-gray-100 dark:bg-gray-800',
      text: 'text-gray-600 dark:text-gray-300'
    }
  };

  // Get color classes based on the color prop
  $: colorStyle = colorClasses[color];
</script>

<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
  <div class="flex items-center justify-between">
    <div>
      <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
      <p class="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
    <div class="h-12 w-12 {colorStyle.bg} rounded-full flex items-center justify-center {colorStyle.text}">
      <i class="fas {icon} text-xl"></i>
    </div>
  </div>
</div>