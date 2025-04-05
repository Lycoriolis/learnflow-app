<script lang="ts">
  export let title: string = '';
  export let value: string | number = '';
  export let icon: string = '';
  export let iconColor: string = 'indigo';
  export let iconBg: string = 'indigo-50';
</script>

<div class="bg-gray-700 border border-orange-500 p-6 rounded-2xl shadow-sm squircle-sm card-hover">
  <div class="flex justify-between items-start">
    <div>
      <h3 class="text-gray-400 text-sm font-medium">{title}</h3>
      <p class="text-2xl font-bold text-gray-100 mt-1">{value}</p>
    </div>
    <div class="w-12 h-12 bg-indigo-900 rounded-full flex items-center justify-center">
      <i class="fas {icon} text-indigo-300"></i>
    </div>
  </div>
</div> 