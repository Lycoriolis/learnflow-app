import { c as store_get, f as escape_html, b as attr, j as stringify, e as ensure_array_like, u as unsubscribe_stores, g as bind_props, a as pop, p as push } from "../../../../../chunks/index3.js";
import { p as page } from "../../../../../chunks/stores.js";
import { i as isLoading, e as error, a as currentTopic, b as posts } from "../../../../../chunks/forumStore.js";
import { I as Icon } from "../../../../../chunks/Icon.js";
import { M as MarkdownRenderer } from "../../../../../chunks/MarkdownRenderer.js";
import "firebase/firestore";
import "firebase/auth";
function ForumTopic($$payload, $$props) {
  push();
  var $$store_subs;
  let topicId = $$props["topicId"];
  function formatDate(date) {
    if (!date) return "Unknown date";
    const now = /* @__PURE__ */ new Date();
    const diff = now.getTime() - date.getTime();
    if (diff < 24 * 60 * 60 * 1e3) {
      const hours = Math.floor(diff / (60 * 60 * 1e3));
      if (hours < 1) {
        const minutes = Math.floor(diff / (60 * 1e3));
        return minutes < 1 ? "Just now" : `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
      }
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    }
    if (diff < 7 * 24 * 60 * 60 * 1e3) {
      const days = Math.floor(diff / (24 * 60 * 60 * 1e3));
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  }
  $$payload.out += `<div class="forum-topic">`;
  if (store_get($$store_subs ??= {}, "$isLoading", isLoading)) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="flex justify-center items-center py-12"><div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cherry-500"></div></div>`;
  } else if (store_get($$store_subs ??= {}, "$error", error)) {
    $$payload.out += "<!--[1-->";
    $$payload.out += `<div class="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-md mb-6"><p>${escape_html(store_get($$store_subs ??= {}, "$error", error))}</p></div>`;
  } else if (store_get($$store_subs ??= {}, "$currentTopic", currentTopic)) {
    $$payload.out += "<!--[2-->";
    $$payload.out += `<div class="mb-6"><a${attr("href", `/forums/category/${stringify(store_get($$store_subs ??= {}, "$currentTopic", currentTopic).category_id)}`)} class="inline-flex items-center text-cherry-600 dark:text-cherry-400 hover:underline mb-4">`;
    Icon($$payload, { icon: "mdi:arrow-left", class: "w-5 h-5 mr-1" });
    $$payload.out += `<!----> Back to Forum</a> <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">${escape_html(store_get($$store_subs ??= {}, "$currentTopic", currentTopic).title)}</h1> <div class="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4"><span class="flex items-center">`;
    Icon($$payload, { icon: "mdi:account", class: "w-4 h-4 mr-1" });
    $$payload.out += `<!----> ${escape_html(store_get($$store_subs ??= {}, "$currentTopic", currentTopic).author_name || "Unknown")}</span> <span class="mx-2">•</span> <span>${escape_html(formatDate(store_get($$store_subs ??= {}, "$currentTopic", currentTopic).created_at))}</span> <span class="mx-2">•</span> <span class="flex items-center">`;
    Icon($$payload, {
      icon: "mdi:eye-outline",
      class: "w-4 h-4 mr-1"
    });
    $$payload.out += `<!----> ${escape_html(store_get($$store_subs ??= {}, "$currentTopic", currentTopic).views)} view${escape_html(store_get($$store_subs ??= {}, "$currentTopic", currentTopic).views !== 1 ? "s" : "")}</span> <span class="mx-2">•</span> <span class="flex items-center">`;
    Icon($$payload, {
      icon: "mdi:comment-outline",
      class: "w-4 h-4 mr-1"
    });
    $$payload.out += `<!----> ${escape_html(store_get($$store_subs ??= {}, "$currentTopic", currentTopic).post_count)} repl${escape_html(store_get($$store_subs ??= {}, "$currentTopic", currentTopic).post_count !== 1 ? "ies" : "y")}</span></div> `;
    if (store_get($$store_subs ??= {}, "$currentTopic", currentTopic).tags && store_get($$store_subs ??= {}, "$currentTopic", currentTopic).tags.length > 0) {
      $$payload.out += "<!--[-->";
      const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$currentTopic", currentTopic).tags);
      $$payload.out += `<div class="flex flex-wrap gap-2 mb-4"><!--[-->`;
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let tag = each_array[$$index];
        $$payload.out += `<a${attr("href", `/forums/tag/${stringify(tag)}`)} class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">${escape_html(tag)}</a>`;
      }
      $$payload.out += `<!--]--></div>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 mb-6"><div class="prose dark:prose-invert max-w-none">`;
    MarkdownRenderer($$payload, {
      content: store_get($$store_subs ??= {}, "$currentTopic", currentTopic).content
    });
    $$payload.out += `<!----></div></div> <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Replies (${escape_html(store_get($$store_subs ??= {}, "$posts", posts).length)})</h2> `;
    if (store_get($$store_subs ??= {}, "$posts", posts).length === 0) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">`;
      Icon($$payload, {
        icon: "mdi:comment-text-outline",
        class: "w-12 h-12 mx-auto text-gray-400 mb-2"
      });
      $$payload.out += `<!----> <p class="text-gray-600 dark:text-gray-400">No replies yet. Be the first to reply!</p></div>`;
    } else {
      $$payload.out += "<!--[!-->";
      const each_array_1 = ensure_array_like(store_get($$store_subs ??= {}, "$posts", posts));
      $$payload.out += `<div class="space-y-4"><!--[-->`;
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let post = each_array_1[$$index_1];
        $$payload.out += `<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"><div class="p-5"><div class="flex items-start"><div class="flex-shrink-0 mr-4">`;
        if (post.authorAvatar) {
          $$payload.out += "<!--[-->";
          $$payload.out += `<img${attr("src", post.authorAvatar)}${attr("alt", post.author_name)} class="w-10 h-10 rounded-full">`;
        } else {
          $$payload.out += "<!--[!-->";
          $$payload.out += `<div class="w-10 h-10 rounded-full bg-cherry-100 dark:bg-cherry-900/30 flex items-center justify-center"><span class="text-cherry-600 dark:text-cherry-400 text-lg font-medium">${escape_html(post.author_name?.charAt(0) || "A")}</span></div>`;
        }
        $$payload.out += `<!--]--></div> <div class="flex-1"><div class="flex items-center justify-between mb-2"><span class="font-medium text-gray-900 dark:text-white">${escape_html(post.author_name || "Unknown")}</span> <span class="text-sm text-gray-500 dark:text-gray-400">${escape_html(formatDate(post.created_at))}</span></div> <div class="prose dark:prose-invert max-w-none">`;
        MarkdownRenderer($$payload, { content: post.content });
        $$payload.out += `<!----></div> `;
        if (post.is_answer) {
          $$payload.out += "<!--[-->";
          $$payload.out += `<div class="mt-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">`;
          Icon($$payload, {
            icon: "mdi:check-circle",
            class: "w-4 h-4 mr-1"
          });
          $$payload.out += `<!----> Accepted Answer</div>`;
        } else {
          $$payload.out += "<!--[!-->";
        }
        $$payload.out += `<!--]--></div></div></div></div>`;
      }
      $$payload.out += `<!--]--></div>`;
    }
    $$payload.out += `<!--]--> `;
    if (!store_get($$store_subs ??= {}, "$currentTopic", currentTopic).is_locked) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div class="mt-8"><h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Add Your Reply</h3> `;
      {
        $$payload.out += "<!--[!-->";
        $$payload.out += `<div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-5 text-center"><p class="text-gray-700 dark:text-gray-300 mb-3">You need to be logged in to reply to this topic.</p> <a href="/login" class="inline-block px-4 py-2 bg-cherry-600 text-white rounded-md hover:bg-cherry-700 dark:bg-cherry-500 dark:hover:bg-cherry-600 transition-colors">Log In to Reply</a></div>`;
      }
      $$payload.out += `<!--]--></div>`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<div class="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-center text-yellow-800 dark:text-yellow-400">`;
      Icon($$payload, {
        icon: "mdi:lock",
        class: "w-5 h-5 inline-block mr-2"
      });
      $$payload.out += `<!----> This topic is locked. New replies are not allowed.</div>`;
    }
    $$payload.out += `<!--]--></div>`;
  } else if (!store_get($$store_subs ??= {}, "$isLoading", isLoading)) {
    $$payload.out += "<!--[3-->";
    $$payload.out += `<div class="text-center py-12">`;
    Icon($$payload, {
      icon: "mdi:alert-circle-outline",
      class: "w-16 h-16 mx-auto text-gray-400 mb-4"
    });
    $$payload.out += `<!----> <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Topic not found</h3> <p class="text-gray-600 dark:text-gray-400">The topic you're looking for doesn't exist or has been removed.</p> <a href="/forums" class="inline-block mt-4 px-4 py-2 bg-cherry-600 text-white rounded-md hover:bg-cherry-700 dark:bg-cherry-500 dark:hover:bg-cherry-600 transition-colors">Back to Forums</a></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { topicId });
  pop();
}
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  const topicId = store_get($$store_subs ??= {}, "$page", page).params.id;
  $$payload.out += `<div class="container mx-auto px-4 py-8">`;
  ForumTopic($$payload, { topicId });
  $$payload.out += `<!----></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
//# sourceMappingURL=_page.svelte.js.map
