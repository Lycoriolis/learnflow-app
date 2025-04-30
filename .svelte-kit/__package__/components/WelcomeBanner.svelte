<script lang="ts">
  export let username = "Hakim";
</script>

<div class="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl p-6 mb-8 text-white squircle">
  <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
    <div>
      <h2 class="text-2xl font-bold mb-2">Welcome back, {username}!</h2>
      <p class="opacity-90 mb-4 md:mb-0">Continue your learning journey with these recommended courses</p>
    </div>
    <a 
      href="/courses" 
      class="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-lg font-medium hover:bg-indigo-200 transition"
    >
      Explore Courses
    </a>
  </div>
</div>