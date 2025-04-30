import { E as ensure_array_like, O as head, I as attr, F as escape_html, M as bind_props, B as pop, z as push } from "../../../../../../../chunks/index.js";
import "../../../../../../../chunks/client.js";
function _page($$payload, $$props) {
  push();
  let data = $$props["data"];
  let { topic, categories } = data;
  let title = topic.title;
  let content = topic.content;
  topic.category;
  let isPinned = topic.is_pinned || false;
  let isLocked = topic.is_locked || false;
  let saving = false;
  const each_array = ensure_array_like(categories);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Edit Topic | Admin</title>`;
  });
  $$payload.out += `<div class="container mx-auto px-4 py-8"><a href="/admin/forums" class="text-blue-600 hover:underline mb-4 inline-block">← Back to Forum Management</a> <h1 class="text-2xl font-bold mb-6">Edit Topic</h1> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <form class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"><div class="mb-4"><label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label> <input id="title" type="text"${attr("value", title)} class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required></div> <div class="mb-4"><label for="category" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label> <select id="category" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let category = each_array[$$index];
    $$payload.out += `<option${attr("value", category.id)}>${escape_html(category.name)}</option>`;
  }
  $$payload.out += `<!--]--></select></div> <div class="mb-4"><label for="content" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label> <textarea id="content" rows="10" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>`;
  const $$body = escape_html(content);
  if ($$body) {
    $$payload.out += `${$$body}`;
  }
  $$payload.out += `</textarea></div> <div class="mb-4 flex items-center"><input id="is-pinned" type="checkbox"${attr("checked", isPinned, true)} class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"> <label for="is-pinned" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">Pin this topic</label></div> <div class="mb-6 flex items-center"><input id="is-locked" type="checkbox"${attr("checked", isLocked, true)} class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"> <label for="is-locked" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">Lock this topic (prevent new replies)</label></div> <div class="flex justify-between"><button type="submit" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md disabled:opacity-50"${attr("disabled", saving, true)}>${escape_html("Save Changes")}</button> <button type="button" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md">Delete Topic</button></div></form></div>`;
  bind_props($$props, { data });
  pop();
}
export {
  _page as default
};
