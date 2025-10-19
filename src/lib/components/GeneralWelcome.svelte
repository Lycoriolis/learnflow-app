<!-- src/lib/components/GeneralWelcome.svelte -->
<div class="bg-gradient-to-r from-indigo-500 via-red-500 to-pink-500 text-white rounded-lg shadow-xl p-8 my-6">
  <h1 class="text-4xl font-bold mb-4">Welcome to LearnFlow!</h1>
  <p class="text-xl mb-6">Your personalized journey to knowledge starts here. Log in or sign up to track your progress, access exclusive content, and connect with fellow learners.</p>
  <p class="text-lg">Discover courses, tackle exercises, and watch your skills grow.</p>
  <!-- You can add a call-to-action button here if needed, though the login is in the header -->
  <!-- Example:
  <button
    class="mt-6 px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg shadow hover:bg-gray-100 transition duration-200"
    on:click={() => import('$lib/authService.js').then(auth => auth.login())}
  >
    Get Started
  </button>
  -->
</div>

<div class="grid md:grid-cols-3 gap-6 my-8">
  <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
    <h2 class="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Explore Courses</h2>
    <p class="text-gray-600 dark:text-gray-300">Browse our extensive library of courses across various domains.</p>
  </div>
  <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
    <h2 class="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Practice Exercises</h2>
    <p class="text-gray-600 dark:text-gray-300">Sharpen your skills with interactive exercises and real-time feedback.</p>
  </div>
  <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
    <h2 class="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Track Progress</h2>
    <p class="text-gray-600 dark:text-gray-300">Log in to monitor your learning journey and achievements.</p>
  </div>
</div> 