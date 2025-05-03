import { f as escape_html, b as attr, g as bind_props, a as pop, p as push, e as ensure_array_like, m as attr_style, j as stringify, h as head } from "../../../../chunks/index3.js";
import { o as onDestroy } from "../../../../chunks/index-server.js";
import "clsx";
function Timer($$payload, $$props) {
  push();
  let elapsed = 0;
  let isRunning = false;
  function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor(seconds % 3600 / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  function reset() {
    elapsed = 0;
  }
  onDestroy(() => {
  });
  function startTimer() {
  }
  function stopTimer() {
  }
  function resetTimer() {
    reset();
  }
  function getElapsedTime() {
    return elapsed;
  }
  $$payload.out += `<div class="workspace-tool mb-6"><h2 class="text-xl font-semibold mb-2">Timer</h2> <div class="text-2xl font-mono mb-4">${escape_html(formatTime(elapsed))}</div> <div class="space-x-2"><button class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"${attr("disabled", isRunning, true)} aria-label="Start timer">Start</button> <button class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"${attr("disabled", true, true)} aria-label="Stop timer">Stop</button> <button class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2" aria-label="Reset timer">Reset</button></div></div>`;
  bind_props($$props, {
    startTimer,
    stopTimer,
    resetTimer,
    getElapsedTime
  });
  pop();
}
function StickyNotes($$payload, $$props) {
  push();
  let notes = [];
  const colors = [
    "#FFEB3B",
    "#FFCDD2",
    "#C8E6C9",
    "#BBDEFB",
    "#D1C4E9",
    "#F0F4C3"
  ];
  let noteStyles = {};
  function getNoteStyle(id, index) {
    if (!noteStyles[id]) {
      noteStyles[id] = {
        color: colors[index % colors.length],
        rotation: Math.random() * 6 - 3
      };
    }
    return noteStyles[id];
  }
  const each_array = ensure_array_like(notes);
  $$payload.out += `<div class="workspace-tool relative"><div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"><!--[-->`;
  for (let i = 0, $$length = each_array.length; i < $$length; i++) {
    let note = each_array[i];
    $$payload.out += `<!---->`;
    {
      const style = getNoteStyle(note.id, i);
      $$payload.out += `<div role="article"${attr("aria-label", `Sticky note ${i + 1}`)} class="p-3 rounded shadow-lg transition-transform"${attr_style(`background: ${stringify(style.color)}; transform: rotate(${stringify(style.rotation)}deg);`)}><textarea${attr("aria-label", `Content for sticky note ${i + 1}`)} class="w-full h-24 bg-transparent p-2 rounded resize-none focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 border-none outline-none bg-opacity-50 text-gray-900 dark:text-gray-900 placeholder-gray-600 dark:placeholder-gray-400" placeholder="Your note here...">`;
      const $$body = escape_html(note.content);
      if ($$body) {
        $$payload.out += `${$$body}`;
      }
      $$payload.out += `</textarea> <div class="flex justify-end mt-2"><button class="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-700"${attr("aria-label", `Delete note ${i + 1}`)}><i class="fas fa-trash"></i></button></div></div>`;
    }
    $$payload.out += `<!---->`;
  }
  $$payload.out += `<!--]--></div> <button class="absolute bottom-4 right-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-3 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" aria-label="Add Note"><i class="fas fa-plus"></i></button></div>`;
  pop();
}
function Quotes($$payload, $$props) {
  push();
  const quotes = [
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
  let intervalId;
  onDestroy(() => {
    clearInterval(intervalId);
  });
  $$payload.out += `<div class="workspace-tool mb-6"><h2 class="text-xl font-semibold mb-2">Motivational Quote</h2> <blockquote class="italic text-gray-700 dark:text-gray-300">“${escape_html(currentQuote)}”</blockquote></div>`;
  pop();
}
function _page($$payload) {
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Workspace | LearnFlow</title>`;
  });
  $$payload.out += `<div class="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 gap-8"><div><div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"><div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center"><i class="fas fa-stopwatch text-xl text-gray-800 dark:text-gray-200 mr-2"></i> <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Timer</h2></div> <div class="p-6">`;
  Timer($$payload, {});
  $$payload.out += `<!----></div></div></div> <div><div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"><div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center"><i class="fas fa-sticky-note text-xl text-gray-800 dark:text-gray-200 mr-2"></i> <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Sticky Notes</h2></div> <div class="p-6">`;
  StickyNotes($$payload);
  $$payload.out += `<!----></div></div></div> <div><div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"><div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center"><i class="fas fa-video text-xl text-gray-800 dark:text-gray-200 mr-2"></i> <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Tutorial Video</h2></div> <div class="relative w-full" style="padding-top:56.25%"><iframe class="absolute top-0 left-0 w-full h-full" src="https://www.youtube.com/embed/8iP3J8jFYdM" title="Chill beats - Study Music" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div></div></div> <div><div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"><div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center"><i class="fas fa-lightbulb text-xl text-gray-800 dark:text-gray-200 mr-2"></i> <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Quote</h2></div> <div class="p-6">`;
  Quotes($$payload);
  $$payload.out += `<!----></div></div></div></div>`;
}
export {
  _page as default
};
//# sourceMappingURL=_page.svelte.js.map
