import { e as ensure_array_like, h as head, d as attr_class, f as escape_html, j as stringify, b as attr, a as pop, p as push } from "../../../../chunks/index3.js";
import { o as onDestroy } from "../../../../chunks/index-server.js";
import MarkdownIt from "markdown-it";
import markdownItKatex from "markdown-it-katex";
import "firebase/firestore";
import "../../../../chunks/authStore.js";
import { h as html } from "../../../../chunks/html.js";
function _page($$payload, $$props) {
  push();
  const md = new MarkdownIt({ html: true }).use(markdownItKatex);
  const modes = [
    {
      id: "assist",
      label: "Assist Mode",
      model: "deepseek/deepseek-prover-v2:free"
    },
    {
      id: "support",
      label: "Support Mode",
      model: "google/gemini-2.5-pro-exp-03-25:free"
    }
  ];
  let mode = "assist";
  let messages = [];
  let input = "";
  onDestroy(() => {
  });
  const each_array = ensure_array_like(modes);
  const each_array_1 = ensure_array_like(messages);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>AI Study Chat | LearnFlow</title>`;
  });
  $$payload.out += `<div class="max-w-2xl mx-auto px-4 py-10 flex flex-col h-[75vh] svelte-b8plu3"><h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 svelte-b8plu3">AI Study Chat</h1> <div class="flex space-x-4 mb-4 svelte-b8plu3"><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let m = each_array[$$index];
    $$payload.out += `<button${attr_class(`px-4 py-2 rounded-lg font-semibold transition ${stringify(mode === m.id ? "bg-indigo-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600")}`, "svelte-b8plu3")}>${escape_html(m.label)}</button>`;
  }
  $$payload.out += `<!--]--></div> <div class="flex-1 overflow-y-auto space-y-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-inner svelte-b8plu3" id="chat-window"><!--[-->`;
  for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
    let msg = each_array_1[$$index_1];
    $$payload.out += `<div${attr_class(`flex ${stringify(msg.role === "assistant" ? "justify-start" : "justify-end")}`, "svelte-b8plu3")}><div${attr_class(`max-w-[80%] p-3 prose dark:prose-invert ${stringify(msg.role === "assistant" ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-tr-xl rounded-br-xl rounded-tl-xl" : "bg-indigo-600 dark:bg-indigo-500 text-white rounded-tl-xl rounded-bl-xl rounded-br-xl")}`, "svelte-b8plu3")}>${html(md.render(msg.text))}</div></div>`;
  }
  $$payload.out += `<!--]--> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div> <div class="mt-4 flex svelte-b8plu3"><textarea class="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 p-2 resize-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 svelte-b8plu3" rows="2" placeholder="Type your question...">`;
  const $$body = escape_html(input);
  if ($$body) {
    $$payload.out += `${$$body}`;
  }
  $$payload.out += `</textarea> <button class="ml-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow transition disabled:opacity-50 svelte-b8plu3"${attr("disabled", !input.trim(), true)}>Send</button></div></div>`;
  pop();
}
export {
  _page as default
};
//# sourceMappingURL=_page.svelte.js.map
