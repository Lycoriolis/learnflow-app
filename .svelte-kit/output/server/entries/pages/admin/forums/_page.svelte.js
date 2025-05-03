import { f as escape_html, c as store_get, e as ensure_array_like, b as attr, j as stringify, u as unsubscribe_stores, a as pop, p as push } from "../../../../chunks/index3.js";
import { i as isLoading, e as error, c as categories } from "../../../../chunks/forumStore.js";
import "firebase/firestore";
import "firebase/auth";
import { I as Icon } from "../../../../chunks/Icon.js";
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  $$payload.out += `<div class="container mx-auto px-4 py-8"><div class="flex justify-between items-center mb-6"><h1 class="text-2xl font-bold text-gray-900 dark:text-white">Forum Administration</h1> <button class="px-4 py-2 bg-cherry-600 text-white rounded-md hover:bg-cherry-700 dark:bg-cherry-500 dark:hover:bg-cherry-600 transition-colors">${escape_html("Create Category")}</button></div> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Forum Categories</h2> `;
  if (store_get($$store_subs ??= {}, "$isLoading", isLoading)) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="flex justify-center items-center py-12"><div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cherry-500"></div></div>`;
  } else if (store_get($$store_subs ??= {}, "$error", error)) {
    $$payload.out += "<!--[1-->";
    $$payload.out += `<div class="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-md mb-6"><p>${escape_html(store_get($$store_subs ??= {}, "$error", error))}</p></div>`;
  } else if (store_get($$store_subs ??= {}, "$categories", categories).length === 0) {
    $$payload.out += "<!--[2-->";
    $$payload.out += `<div class="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">`;
    Icon($$payload, {
      icon: "mdi:forum-outline",
      class: "w-16 h-16 mx-auto text-gray-400 mb-4"
    });
    $$payload.out += `<!----> <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No categories found</h3> <p class="text-gray-600 dark:text-gray-400">There are no forum categories yet. Create your first category to get started.</p></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$categories", categories));
    $$payload.out += `<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"><table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"><thead class="bg-gray-50 dark:bg-gray-900"><tr><th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th><th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th><th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Topics</th><th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order</th><th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th></tr></thead><tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"><!--[-->`;
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let category = each_array[$$index];
      $$payload.out += `<tr class="hover:bg-gray-50 dark:hover:bg-gray-750"><td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">${escape_html(category.name)}</td><td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 truncate max-w-[300px]">${escape_html(category.description)}</td><td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">${escape_html(category.topicCount || 0)}</td><td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">${escape_html(category.order ?? "N/A")}</td><td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"><div class="flex justify-end space-x-2"><a${attr("href", `/admin/forums/category/${stringify(category.id)}/edit`)} class="text-cherry-600 dark:text-cherry-400 hover:text-cherry-900 dark:hover:text-cherry-300" title="Edit category">`;
      Icon($$payload, { icon: "mdi:pencil", class: "w-5 h-5" });
      $$payload.out += `<!----></a> <button class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300" title="Delete category">`;
      Icon($$payload, { icon: "mdi:delete", class: "w-5 h-5" });
      $$payload.out += `<!----></button></div></td></tr>`;
    }
    $$payload.out += `<!--]--></tbody></table></div>`;
  }
  $$payload.out += `<!--]--></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
//# sourceMappingURL=_page.svelte.js.map
