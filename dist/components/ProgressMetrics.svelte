<script>
  export let metrics = [
    {
      title: "Courses in Progress",
      value: "3",
      icon: "fa-book",
      color: "indigo"
    },
    {
      title: "Exercises Completed",
      value: "24",
      icon: "fa-check-circle",
      color: "green"
    },
    {
      title: "Learning Streak",
      value: "7 days",
      icon: "fa-fire",
      color: "yellow"
    }
  ];
</script>

<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
  {#each metrics as metric}
    <div class="bg-gray-700 border border-orange-500 p-6 rounded-2xl shadow-sm squircle-sm card-hover">
      <div class="flex justify-between items-start">
        <div>
          <h3 class="text-gray-400 text-sm font-medium">{metric.title}</h3>
          <p class="text-2xl font-bold text-gray-100 mt-1">{metric.value}</p>
        </div>
        <div class="w-12 h-12 bg-indigo-900 rounded-full flex items-center justify-center">
          <i class="fas {metric.icon} text-indigo-300"></i>
        </div>
      </div>
    </div>
  {/each}
</div>
