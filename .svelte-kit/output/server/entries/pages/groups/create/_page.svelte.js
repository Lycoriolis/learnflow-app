import { h as head, b as attr, f as escape_html, a as pop, p as push } from "../../../../chunks/index3.js";
import "../../../../chunks/client.js";
function _page($$payload, $$props) {
  push();
  let name = "";
  let description = "";
  let topic = "";
  let image = "";
  let isPublic = true;
  let loading = false;
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Create New Group | LearnFlow</title>`;
  });
  $$payload.out += `<div class="max-w-xl mx-auto py-10 px-4"><h1 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Create a New Group</h1> <form class="space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6"><div><label class="block text-sm font-medium mb-1">Group Name</label> <input class="w-full rounded border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"${attr("value", name)} required></div> <div><label class="block text-sm font-medium mb-1">Description</label> <textarea class="w-full rounded border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" rows="3" required>`;
  const $$body = escape_html(description);
  if ($$body) {
    $$payload.out += `${$$body}`;
  }
  $$payload.out += `</textarea></div> <div><label class="block text-sm font-medium mb-1">Topic</label> <input class="w-full rounded border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"${attr("value", topic)} required></div> <div><label class="block text-sm font-medium mb-1">Image URL (optional)</label> <input class="w-full rounded border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"${attr("value", image)}></div> <div class="flex items-center gap-2"><input type="checkbox" id="isPublic"${attr("checked", isPublic, true)}> <label for="isPublic" class="text-sm">Public group (anyone can join)</label></div> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <div class="flex gap-4"><button type="submit" class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"${attr("disabled", loading, true)}>${escape_html("Create Group")}</button> <a href="/groups" class="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md">Cancel</a></div></form></div>`;
  pop();
}
export {
  _page as default
};
//# sourceMappingURL=_page.svelte.js.map
