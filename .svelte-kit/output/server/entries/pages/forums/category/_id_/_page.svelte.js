import { c as store_get, f as escape_html, b as attr, e as ensure_array_like, d as attr_class, j as stringify, u as unsubscribe_stores, a as pop, p as push } from "../../../../../chunks/index3.js";
import { p as page } from "../../../../../chunks/stores.js";
import { g as getCategoryById, t as topics, i as isLoading, e as error } from "../../../../../chunks/forumStore.js";
import "firebase/firestore";
import "firebase/auth";
import "../../../../../chunks/client.js";
import { I as Icon } from "../../../../../chunks/Icon.js";
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let categoryId = store_get($$store_subs ??= {}, "$page", page).params.id;
  let searchQuery = "";
  let filteredTopics = [];
  let category;
  {
    filteredTopics = store_get($$store_subs ??= {}, "$topics", topics);
  }
  {
    category = getCategoryById(categoryId);
  }
  $$payload.out += `<div class="container mx-auto px-4 py-8"><div class="mb-6"><a href="/forums" class="inline-flex items-center text-cherry-600 dark:text-cherry-400 hover:underline mb-4">`;
  Icon($$payload, { icon: "mdi:arrow-left", class: "w-5 h-5 mr-1" });
  $$payload.out += `<!----> Back to Forums</a> `;
  if (category) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<h1 class="text-2xl font-bold text-gray-900 dark:text-white">${escape_html(category.name)}</h1> <p class="text-gray-600 dark:text-gray-400 mt-2">${escape_html(category.description)}</p>`;
  } else if (!store_get($$store_subs ??= {}, "$isLoading", isLoading)) {
    $$payload.out += "<!--[1-->";
    $$payload.out += `<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Category</h1> <p class="text-gray-600 dark:text-gray-400 mt-2">Loading category details...</p>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div> <div class="flex justify-between items-center mb-6"><div class="relative"><input type="text"${attr("value", searchQuery)} placeholder="Search topics..." class="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-cherry-500 focus:border-cherry-500 dark:focus:ring-cherry-400 dark:focus:border-cherry-400"> `;
  Icon($$payload, {
    icon: "mdi:magnify",
    class: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
  });
  $$payload.out += `<!----></div> <button class="px-4 py-2 bg-cherry-600 text-white rounded-md hover:bg-cherry-700 dark:bg-cherry-500 dark:hover:bg-cherry-600 transition-colors">${escape_html("Create New Topic")}</button></div> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  if (store_get($$store_subs ??= {}, "$isLoading", isLoading)) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="flex justify-center items-center py-12"><div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cherry-500"></div></div>`;
  } else if (store_get($$store_subs ??= {}, "$error", error)) {
    $$payload.out += "<!--[1-->";
    $$payload.out += `<div class="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-md mb-6"><p>${escape_html(store_get($$store_subs ??= {}, "$error", error))}</p></div>`;
  } else if (filteredTopics.length === 0) {
    $$payload.out += "<!--[2-->";
    $$payload.out += `<div class="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">`;
    Icon($$payload, {
      icon: "mdi:forum-outline",
      class: "w-16 h-16 mx-auto text-gray-400 mb-4"
    });
    $$payload.out += `<!----> <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No topics found</h3> `;
    {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<p class="text-gray-600 dark:text-gray-400">There are no topics in this category yet. Be the first to create one!</p>`;
    }
    $$payload.out += `<!--]--></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    const each_array = ensure_array_like(filteredTopics);
    $$payload.out += `<div class="space-y-4"><!--[-->`;
    for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
      let topic = each_array[$$index_1];
      $$payload.out += `<a${attr("href", `/forums/topic/${stringify(topic.id)}`)} class="block"><div${attr_class(`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${stringify(topic.isPinned ? "border-l-4 border-cherry-500 dark:border-cherry-400" : "")}`)}><div class="p-4"><div class="flex items-start">`;
      if (topic.isPinned) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<div class="flex-shrink-0 mr-3">`;
        Icon($$payload, {
          icon: "mdi:pin",
          class: "w-5 h-5 text-cherry-600 dark:text-cherry-400"
        });
        $$payload.out += `<!----></div>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--> <div class="flex-1"><h4 class="text-lg font-medium text-gray-900 dark:text-white mb-1">${escape_html(topic.title)}</h4> <div class="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2"><span>${escape_html(topic.authorName || "Unknown")}</span> <span class="mx-2">•</span> <span>${escape_html(new Date(topic.createdAt).toLocaleDateString())}</span> <span class="mx-2">•</span> <span class="flex items-center">`;
      Icon($$payload, {
        icon: "mdi:eye-outline",
        class: "w-4 h-4 mr-1"
      });
      $$payload.out += `<!----> ${escape_html(topic.viewCount)}</span> <span class="mx-2">•</span> <span class="flex items-center">`;
      Icon($$payload, {
        icon: "mdi:comment-outline",
        class: "w-4 h-4 mr-1"
      });
      $$payload.out += `<!----> ${escape_html(topic.replyCount)}</span></div> `;
      if (topic.tags && topic.tags.length > 0) {
        $$payload.out += "<!--[-->";
        const each_array_1 = ensure_array_like(topic.tags);
        $$payload.out += `<div class="flex flex-wrap gap-2"><!--[-->`;
        for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
          let tag = each_array_1[$$index];
          $$payload.out += `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">${escape_html(tag)}</span>`;
        }
        $$payload.out += `<!--]--></div>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--></div></div></div></div></a>`;
    }
    $$payload.out += `<!--]--></div>`;
  }
  $$payload.out += `<!--]--></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
//# sourceMappingURL=_page.svelte.js.map
