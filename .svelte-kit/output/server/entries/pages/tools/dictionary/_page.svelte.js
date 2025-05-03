import { h as head, b as attr, c as store_get, e as ensure_array_like, f as escape_html, u as unsubscribe_stores, a as pop, p as push } from "../../../../chunks/index3.js";
import { p as persistentStore } from "../../../../chunks/persistentStore.js";
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  const searchHistory = persistentStore("learnflow-dictionary-history", []);
  let searchTerm = "";
  function formatDate(timestamp) {
    return new Date(timestamp).toLocaleString();
  }
  function handleKeydown(event) {
    if ((event.ctrlKey || event.metaKey) && event.key === "/") {
      event.preventDefault();
      const searchInput = document.querySelector("#word-search");
      if (searchInput) {
        searchInput.focus();
      }
    }
  }
  onMount(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  });
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Dictionary &amp; Reference | LearnFlow</title>`;
  });
  $$payload.out += `<div class="max-w-4xl mx-auto px-4 py-10"><div class="flex justify-between items-start mb-8"><div><h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center"><i class="fas fa-book mr-3 text-cyan-500"></i> Dictionary &amp; Reference</h1> <p class="text-gray-600 dark:text-gray-400">Look up definitions, pronunciations, and related words</p></div></div> <div class="grid grid-cols-1 lg:grid-cols-4 gap-8"><div class="lg:col-span-3"><div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-6"><form><div class="flex gap-2"><div class="flex-1 relative"><input id="word-search" type="text"${attr("value", searchTerm)} placeholder="Enter a word to look up..." class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"> <div class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"><kbd class="px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600">Ctrl</kbd> <span class="mx-1">+</span> <kbd class="px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600">/</kbd></div></div> <button type="submit" class="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition flex items-center disabled:opacity-50"${attr("disabled", !searchTerm.trim(), true)}>`;
  {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<i class="fas fa-search mr-2"></i> Search`;
  }
  $$payload.out += `<!--]--></button></div></form></div> `;
  {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center"><i class="fas fa-search text-4xl text-gray-400 dark:text-gray-600 mb-4"></i> <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Ready to Look Up Words</h3> <p class="text-gray-600 dark:text-gray-400">Enter a word in the search box above to get started</p></div>`;
  }
  $$payload.out += `<!--]--></div> <div class="lg:col-span-1"><div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg sticky top-4"><h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Searches</h3> `;
  if (store_get($$store_subs ??= {}, "$searchHistory", searchHistory).length === 0) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<p class="text-gray-500 dark:text-gray-400 text-sm">No recent searches</p>`;
  } else {
    $$payload.out += "<!--[!-->";
    const each_array_4 = ensure_array_like(store_get($$store_subs ??= {}, "$searchHistory", searchHistory));
    $$payload.out += `<div class="space-y-3"><!--[-->`;
    for (let $$index_4 = 0, $$length = each_array_4.length; $$index_4 < $$length; $$index_4++) {
      let entry = each_array_4[$$index_4];
      $$payload.out += `<button class="w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition group"><div class="text-gray-900 dark:text-gray-100 font-medium group-hover:text-cyan-600 dark:group-hover:text-cyan-400">${escape_html(entry.word)}</div> <div class="text-xs text-gray-500 dark:text-gray-400">${escape_html(formatDate(entry.timestamp))}</div></button>`;
    }
    $$payload.out += `<!--]--></div>`;
  }
  $$payload.out += `<!--]--></div></div></div></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
//# sourceMappingURL=_page.svelte.js.map
