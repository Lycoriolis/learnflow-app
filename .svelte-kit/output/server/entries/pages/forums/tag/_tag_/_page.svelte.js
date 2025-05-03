import { c as store_get, f as escape_html, e as ensure_array_like, b as attr, j as stringify, d as attr_class, u as unsubscribe_stores, a as pop, p as push } from "../../../../../chunks/index3.js";
import { p as page } from "../../../../../chunks/stores.js";
import { i as isLoading, e as error, t as topics } from "../../../../../chunks/forumStore.js";
import { I as Icon } from "../../../../../chunks/Icon.js";
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let tag = store_get($$store_subs ??= {}, "$page", page).params.tag;
  $$payload.out += `<div class="container mx-auto px-4 py-8"><div class="mb-6"><a href="/forums" class="inline-flex items-center text-cherry-600 dark:text-cherry-400 hover:underline mb-4">`;
  Icon($$payload, { icon: "mdi:arrow-left", class: "w-5 h-5 mr-1" });
  $$payload.out += `<!----> Back to Forums</a> <h1 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center"><span>Topics tagged:</span> <span class="ml-2 px-2.5 py-0.5 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">${escape_html(tag)}</span></h1></div> `;
  if (store_get($$store_subs ??= {}, "$isLoading", isLoading)) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="flex justify-center items-center py-12"><div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cherry-500"></div></div>`;
  } else if (store_get($$store_subs ??= {}, "$error", error)) {
    $$payload.out += "<!--[1-->";
    $$payload.out += `<div class="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-md mb-6"><p>${escape_html(store_get($$store_subs ??= {}, "$error", error))}</p></div>`;
  } else if (store_get($$store_subs ??= {}, "$topics", topics).length === 0) {
    $$payload.out += "<!--[2-->";
    $$payload.out += `<div class="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">`;
    Icon($$payload, {
      icon: "mdi:tag-outline",
      class: "w-16 h-16 mx-auto text-gray-400 mb-4"
    });
    $$payload.out += `<!----> <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No topics found</h3> <p class="text-gray-600 dark:text-gray-400">There are no topics with the tag "${escape_html(tag)}".</p></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$topics", topics));
    $$payload.out += `<div class="space-y-4"><!--[-->`;
    for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
      let topic = each_array[$$index_1];
      const each_array_1 = ensure_array_like(topic.tags || []);
      $$payload.out += `<a${attr("href", `/forums/topic/${stringify(topic.id)}`)} class="block"><div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"><div class="p-4"><h4 class="text-lg font-medium text-gray-900 dark:text-white mb-1">${escape_html(topic.title)}</h4> <div class="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2"><span>${escape_html(topic.authorName || "Unknown")}</span> <span class="mx-2">•</span> <span>${escape_html(new Date(topic.createdAt).toLocaleDateString())}</span> <span class="mx-2">•</span> <span class="flex items-center">`;
      Icon($$payload, {
        icon: "mdi:eye-outline",
        class: "w-4 h-4 mr-1"
      });
      $$payload.out += `<!----> ${escape_html(topic.viewCount)}</span> <span class="mx-2">•</span> <span class="flex items-center">`;
      Icon($$payload, {
        icon: "mdi:comment-outline",
        class: "w-4 h-4 mr-1"
      });
      $$payload.out += `<!----> ${escape_html(topic.replyCount)}</span></div> <div class="flex flex-wrap gap-2"><!--[-->`;
      for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
        let topicTag = each_array_1[$$index];
        $$payload.out += `<span${attr_class(`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stringify(topicTag === tag ? "bg-cherry-100 dark:bg-cherry-900/30 text-cherry-800 dark:text-cherry-400" : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300")}`)}>${escape_html(topicTag)}</span>`;
      }
      $$payload.out += `<!--]--></div></div></div></a>`;
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
