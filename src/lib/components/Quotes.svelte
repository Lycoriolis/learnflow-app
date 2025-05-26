<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  const quotes: string[] = [
    "The best way to predict the future is to create it.",
    "Don't watch the clock; do what it does. Keep going.",
    "The only limit to our realization of tomorrow is our doubts of today.",
    "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    "Believe you can and you're halfway there.",
    "The harder you work for something, the greater you'll feel when you achieve it.",
    "Dream big and dare to fail.",
    "Don't stop when you're tired. Stop when you're done.",
    "Little things make big days.",
    "It always seems impossible until it's done.",
    "Start where you are. Use what you have. Do what you can.",
    "Dream it. Wish it. Do it.",
    "If you can dream it, you can do it.",
    "The secret of getting ahead is getting started.",
    "Hardships often prepare ordinary people for an extraordinary destiny.",
    "Keep your eyes on the stars, and your feet on the ground.",
    "The only way to do great work is to love what you do.",
    "Don't count the days, make the days count.",
    "Believe in yourself and all that you are.",
    "Opportunities don't happen. You create them.",
    "Great things never come from comfort zones.",
    "Success doesn't just find you. You have to go out and get it.",
    "The harder the battle, the sweeter the victory.",
    "Don't wait for opportunity. Create it.",
    "Your limitation—it's only your imagination.",
    "Push yourself, because no one else is going to do it for you.",
    "Sometimes later becomes never. Do it now.",
    "If you are working on something that you really care about, you don't have to be pushed. The vision pulls you.",
    "Success is walking from failure to failure with no loss of enthusiasm.",
    "Action is the foundational key to all success."
  ];

  let currentIndex = Math.floor(Math.random() * quotes.length);
  let currentQuote = quotes[currentIndex];
  let intervalId: number;

  onMount(() => {
    intervalId = window.setInterval(() => {
      currentIndex = (currentIndex + 1) % quotes.length;
      currentQuote = quotes[currentIndex];
    }, 5 * 60 * 1000); // every 5 minutes
  });

  onDestroy(() => {
    clearInterval(intervalId);
  });
</script>

<div class="workspace-tool mb-6 border-2 border-transparent rounded-xl bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-400 p-1">
  <div class="bg-[#0D1117] p-6 rounded-lg text-white shadow-lg transition-shadow duration-300 hover:shadow-2xl">
    <h2 class="text-xl font-semibold mb-4">Motivational Quote</h2>
    <blockquote class="italic text-lg leading-relaxed opacity-0 quote-transition">“{currentQuote}”</blockquote>
  </div>
</div>

<style>
  .quote-transition {
    animation: fadeInUp 0.6s ease-out forwards;
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>