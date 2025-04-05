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
    <div class="bg-white p-6 rounded-2xl shadow-sm squircle-sm card-hover">
      <div class="flex justify-between items-start">
        <div>
          <h3 class="text-gray-500 text-sm font-medium">{metric.title}</h3>
          <p class="text-2xl font-bold mt-1">{metric.value}</p>
        </div>
        <div class="w-12 h-12 bg-{metric.color}-50 rounded-full flex items-center justify-center">
          <i class="fas {metric.icon} text-{metric.color}-600"></i>
        </div>
      </div>
    </div>
  {/each}
</div>
