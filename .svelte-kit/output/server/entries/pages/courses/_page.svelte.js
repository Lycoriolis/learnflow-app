import { O as head, B as pop, z as push } from "../../../chunks/index.js";
import { o as onDestroy } from "../../../chunks/index-server.js";
import "firebase/firestore";
import "../../../chunks/courseService.js";
function _page($$payload, $$props) {
  push();
  onDestroy(() => {
  });
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Courses | LearnFlow</title>`;
  });
  $$payload.out += `<div class="max-w-7xl mx-auto px-4 py-8"><h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Courses</h1> `;
  {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="flex justify-center items-center py-12"><div class="w-12 h-12 border-4 border-t-indigo-500 border-indigo-200 rounded-full animate-spin"></div></div>`;
  }
  $$payload.out += `<!--]--></div>`;
  pop();
}
export {
  _page as default
};
