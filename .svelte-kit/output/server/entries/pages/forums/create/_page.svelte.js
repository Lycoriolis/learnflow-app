import "clsx";
import { c as categories } from "../../../../chunks/forumStore.js";
import { e as ensure_array_like, c as store_get, b as attr, f as escape_html, u as unsubscribe_stores, g as bind_props, a as pop, p as push } from "../../../../chunks/index3.js";
import { y as fallback } from "../../../../chunks/utils.js";
import "firebase/firestore";
import "firebase/auth";
import "../../../../chunks/client.js";
import { I as Icon } from "../../../../chunks/Icon.js";
function CreateTopicForm($$payload, $$props) {
  push();
  var $$store_subs;
  let categoryId = fallback($$props["categoryId"], null);
  let title = "";
  let content = "";
  let selectedCategoryId = categoryId;
  let tags = [];
  let newTag = "";
  let isSubmitting = false;
  const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$categories", categories));
  $$payload.out += `<div class="create-topic-form"><h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">Create New Topic</h2> <div class="space-y-6">`;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <div><label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label> <input type="text" id="title"${attr("value", title)} placeholder="Enter a descriptive title for your topic" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-cherry-500 focus:border-cherry-500 dark:focus:ring-cherry-400 dark:focus:border-cherry-400"${attr("disabled", isSubmitting, true)}></div> <div><label for="category" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category *</label> <select id="category" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-cherry-500 focus:border-cherry-500 dark:focus:ring-cherry-400 dark:focus:border-cherry-400"${attr("disabled", !!categoryId, true)}><option value="" disabled>Select a category</option><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let category = each_array[$$index];
    $$payload.out += `<option${attr("value", category.id)}>${escape_html(category.name)}</option>`;
  }
  $$payload.out += `<!--]--></select></div> <div><label for="content" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content *</label> <textarea id="content" placeholder="Write your topic content here... (Markdown supported)" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-cherry-500 focus:border-cherry-500 dark:focus:ring-cherry-400 dark:focus:border-cherry-400 min-h-[200px]"${attr("disabled", isSubmitting, true)}>`;
  const $$body = escape_html(content);
  if ($$body) {
    $$payload.out += `${$$body}`;
  }
  $$payload.out += `</textarea> <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">You can use Markdown formatting to structure your content.</p></div> <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags</label> <div class="flex"><input type="text"${attr("value", newTag)} placeholder="Add tags (press Enter to add)" class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-cherry-500 focus:border-cherry-500 dark:focus:ring-cherry-400 dark:focus:border-cherry-400"${attr("disabled", isSubmitting, true)}> <button type="button" class="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 border-l-0 rounded-r-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"${attr("disabled", !newTag.trim(), true)}>Add</button></div> `;
  if (tags.length > 0) {
    $$payload.out += "<!--[-->";
    const each_array_1 = ensure_array_like(tags);
    $$payload.out += `<div class="flex flex-wrap gap-2 mt-2"><!--[-->`;
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let tag = each_array_1[$$index_1];
      $$payload.out += `<div class="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">${escape_html(tag)} <button type="button" class="ml-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"${attr("disabled", isSubmitting, true)}>`;
      Icon($$payload, { icon: "mdi:close", class: "w-4 h-4" });
      $$payload.out += `<!----></button></div>`;
    }
    $$payload.out += `<!--]--></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div> <div class="flex justify-end"><button${attr("disabled", !title.trim() || !content.trim() || !selectedCategoryId, true)} class="px-4 py-2 bg-cherry-600 text-white rounded-md hover:bg-cherry-700 dark:bg-cherry-500 dark:hover:bg-cherry-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">${escape_html("Create Topic")}</button></div></div></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { categoryId });
  pop();
}
function _page($$payload) {
  $$payload.out += `<div class="container mx-auto px-4 py-8"><div class="max-w-3xl mx-auto"><div class="mb-6"><a href="/forums" class="inline-flex items-center text-cherry-600 dark:text-cherry-400 hover:underline mb-4">`;
  Icon($$payload, { icon: "mdi:arrow-left", class: "w-5 h-5 mr-1" });
  $$payload.out += `<!----> Back to Forums</a> <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Create New Topic</h1></div> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">`;
  CreateTopicForm($$payload, {});
  $$payload.out += `<!----></div></div></div>`;
}
export {
  _page as default
};
//# sourceMappingURL=_page.svelte.js.map
