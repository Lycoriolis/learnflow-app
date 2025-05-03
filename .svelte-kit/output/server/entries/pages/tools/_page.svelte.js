import { e as ensure_array_like, h as head, b as attr, d as attr_class, f as escape_html, a as pop, p as push } from "../../../chunks/index3.js";
import { o as onDestroy } from "../../../chunks/index-server.js";
import "firebase/firestore";
import "../../../chunks/authStore.js";
function _page($$payload, $$props) {
  push();
  const tools = [
    {
      name: "Pomodoro Timer",
      path: "/tools/pomodoro",
      icon: "fa-clock"
    },
    {
      name: "Notepad",
      path: "/tools/notepad",
      icon: "fa-sticky-note"
    },
    {
      name: "Tasks",
      path: "/tools/tasks",
      icon: "fa-list-check"
    },
    {
      name: "AI Study Chat",
      path: "/tools/chat",
      icon: "fa-robot"
    },
    {
      name: "Flashcards",
      path: "/tools/flashcards",
      icon: "fa-layer-group"
    },
    {
      name: "Calculator",
      path: "/tools/calculator",
      icon: "fa-calculator"
    },
    {
      name: "Dictionary",
      path: "/tools/dictionary",
      icon: "fa-book"
    }
  ];
  onDestroy(() => {
  });
  const each_array = ensure_array_like(tools);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Productivity Tools | LearnFlow</title>`;
  });
  $$payload.out += `<div class="max-w-4xl mx-auto px-4 py-10"><h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Productivity &amp; Focus Tools</h1> <p class="text-gray-600 dark:text-gray-300 mb-8">Boost your study sessions with these integrated tools.</p> <div class="grid grid-cols-1 sm:grid-cols-2 gap-6"><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let tool = each_array[$$index];
    $$payload.out += `<a${attr("href", tool.path)} class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex items-center space-x-4 hover:shadow-lg transition"><i${attr_class(`fas ${tool.icon} text-3xl text-indigo-500`)}></i> <span class="text-lg font-medium text-gray-900 dark:text-white">${escape_html(tool.name)}</span></a>`;
  }
  $$payload.out += `<!--]--></div></div>`;
  pop();
}
export {
  _page as default
};
//# sourceMappingURL=_page.svelte.js.map
