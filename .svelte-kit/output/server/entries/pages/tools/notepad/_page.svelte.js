import { O as head, F as escape_html, B as pop, z as push } from "../../../../chunks/index.js";
import { o as onDestroy } from "../../../../chunks/index-server.js";
import { j as notepadContent } from "../../../../chunks/pipStores.js";
import { M as MarkdownRenderer } from "../../../../chunks/MarkdownRenderer.js";
import "firebase/firestore";
function _page($$payload, $$props) {
  push();
  let note = "";
  const unsubscribe = notepadContent.subscribe((value) => note = value);
  onDestroy(() => {
    unsubscribe();
  });
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Notepad | LearnFlow</title>`;
  });
  $$payload.out += `<div class="max-w-4xl mx-auto px-4 py-10 svelte-1oo81za"><h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center svelte-1oo81za"><i class="fas fa-sticky-note mr-3 text-yellow-400 svelte-1oo81za"></i> Notepad</h1> <p class="text-gray-600 dark:text-gray-300 mb-6 svelte-1oo81za">Jot down notes, ideas, or summaries. Supports <span class="font-semibold svelte-1oo81za">Markdown</span> with live preview!</p> <div class="grid grid-cols-1 md:grid-cols-2 gap-6 svelte-1oo81za"><div class="flex flex-col svelte-1oo81za"><label class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-200 svelte-1oo81za" for="notepad">Your Notes</label> <textarea id="notepad" class="w-full h-64 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-4 font-mono text-base shadow focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-vertical transition svelte-1oo81za" placeholder="Write your notes here...">`;
  const $$body = escape_html(note);
  if ($$body) {
    $$payload.out += `${$$body}`;
  }
  $$payload.out += `</textarea> <div class="flex space-x-2 mt-4 svelte-1oo81za"><button class="px-4 py-2 bg-indigo-600 text-white rounded-md font-semibold shadow hover:bg-indigo-700 transition svelte-1oo81za"><i class="fas fa-save mr-2 svelte-1oo81za"></i> Save</button> <button class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md font-semibold shadow hover:bg-gray-300 transition svelte-1oo81za"><i class="fas fa-eraser mr-2 svelte-1oo81za"></i> Clear</button> <button class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md font-semibold shadow hover:bg-gray-300 transition svelte-1oo81za">Toggle Preview</button> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div></div> `;
  {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="svelte-1oo81za"><label class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-200 block svelte-1oo81za">Live Preview</label> <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 h-64 overflow-auto shadow-inner prose dark:prose-invert svelte-1oo81za">`;
    MarkdownRenderer($$payload, { content: note });
    $$payload.out += `<!----></div></div>`;
  }
  $$payload.out += `<!--]--></div></div>`;
  pop();
}
export {
  _page as default
};
