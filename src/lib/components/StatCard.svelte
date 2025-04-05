<script lang="ts">
  export let title: string = '';
  export let value: string | number = '';
  export let icon: string = '';
  export let iconColor: string = 'indigo';
  export let iconBg: string = 'indigo-50';
</script>

<div class="bg-white p-6 rounded-2xl shadow-sm squircle-sm card-hover">
  <div class="flex justify-between items-start">
    <div>
      <h3 class="text-gray-500 text-sm font-medium">{title}</h3>
      <p class="text-2xl font-bold mt-1">{value}</p>
    </div>
    <div class="w-12 h-12 bg-{iconBg} rounded-full flex items-center justify-center">
      <i class="fas {icon} text-{iconColor}-600"></i>
    </div>
  </div>
</div> 