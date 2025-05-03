import { c as store_get, e as ensure_array_like, f as escape_html, b as attr, j as stringify, d as attr_class, u as unsubscribe_stores, g as bind_props, a as pop, p as push } from "../../../chunks/index3.js";
import { y as fallback } from "../../../chunks/utils.js";
import { i as isLoading, e as error, s as subscribedTopics, t as topics, r as recentTopics, p as pinnedTopics } from "../../../chunks/forumStore.js";
import { u as user } from "../../../chunks/authStore.js";
import { I as Icon } from "../../../chunks/Icon.js";
import "firebase/firestore";
import "firebase/auth";
function ForumList($$payload, $$props) {
  push();
  var $$store_subs;
  function formatDate(dateString) {
    const date = new Date(dateString);
    const now = /* @__PURE__ */ new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1e3 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1e3 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1e3 * 60));
    if (diffMinutes < 60) return `${diffMinutes} min${diffMinutes !== 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  }
  function getCategoryById(id) {
    return categories.find((c) => c.id === id);
  }
  function getCategoryColorClass(color, forBg = true) {
    const base = {
      blue: [
        "blue-100 dark:blue-900/30",
        "blue-800 dark:blue-300",
        "blue-500 dark:blue-400"
      ],
      green: [
        "green-100 dark:green-900/30",
        "green-800 dark:green-300",
        "green-500 dark:green-400"
      ],
      gray: [
        "gray-100 dark:gray-700",
        "gray-800 dark:gray-300",
        "gray-500 dark:gray-400"
      ]
    }[color] || ["gray-100", "gray-800", "gray-500"];
    return forBg ? `bg-${base[0]} text-${base[2]} dark:bg-${base[1]} dark:text-${base[2]}` : `text-${base[2]} dark:text-${base[1]}`;
  }
  let topics2 = fallback($$props["topics"], () => [], true);
  let votingTopicId = fallback($$props["votingTopicId"], null);
  let subscribingTopicId = fallback($$props["subscribingTopicId"], null);
  let unsubscribingTopicId = fallback($$props["unsubscribingTopicId"], null);
  let showHeader = fallback($$props["showHeader"], true);
  let limit = fallback($$props["limit"], null);
  let filteredCategories = [];
  let categories = [];
  store_get($$store_subs ??= {}, "$user", user);
  {
    filteredCategories = limit ? store_get($$store_subs ??= {}, "$categories", categories).slice(0, limit) : store_get($$store_subs ??= {}, "$categories", categories);
  }
  const each_array_1 = ensure_array_like(categories);
  $$payload.out += `<div class="forum-list">`;
  if (showHeader) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="mb-6"><h1 class="text-2xl font-bold text-gray-900 dark:text-white">Forums</h1> <p class="text-gray-600 dark:text-gray-400 mt-2">Join discussions, ask questions, and share knowledge</p></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  if (store_get($$store_subs ??= {}, "$isLoading", isLoading)) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="flex justify-center items-center py-12"><div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cherry-500"></div></div>`;
  } else if (store_get($$store_subs ??= {}, "$error", error)) {
    $$payload.out += "<!--[1-->";
    $$payload.out += `<div class="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-md mb-6"><p>${escape_html(store_get($$store_subs ??= {}, "$error", error))}</p></div>`;
  } else if (filteredCategories.length === 0) {
    $$payload.out += "<!--[2-->";
    $$payload.out += `<div class="text-center py-12">`;
    Icon($$payload, {
      icon: "mdi:forum-outline",
      class: "w-16 h-16 mx-auto text-gray-400 mb-4"
    });
    $$payload.out += `<!----> <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No categories found</h3> <p class="text-gray-600 dark:text-gray-400">There are no forum categories available yet.</p></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    const each_array = ensure_array_like(filteredCategories);
    $$payload.out += `<div class="space-y-6"><!--[-->`;
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let category = each_array[$$index];
      $$payload.out += `<a${attr("href", `/forums/category/${stringify(category.id)}`)} class="block"><div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:transform hover:scale-[1.01]"><div class="p-5"><div class="flex items-start">`;
      if (category.imageUrl) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<div class="flex-shrink-0 mr-4"><img${attr("src", category.imageUrl)}${attr("alt", category.name)} class="w-12 h-12 rounded-md object-cover"></div>`;
      } else {
        $$payload.out += "<!--[!-->";
        $$payload.out += `<div class="flex-shrink-0 mr-4"><div class="w-12 h-12 rounded-md bg-cherry-100 dark:bg-cherry-900/30 flex items-center justify-center">`;
        Icon($$payload, {
          icon: "mdi:forum",
          class: "w-6 h-6 text-cherry-600 dark:text-cherry-400"
        });
        $$payload.out += `<!----></div></div>`;
      }
      $$payload.out += `<!--]--> <div class="flex-1"><h3 class="text-lg font-semibold text-gray-900 dark:text-white">${escape_html(category.name)}</h3> <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">${escape_html(category.description)}</p></div> <div class="ml-4 flex-shrink-0 text-right"><div class="flex items-center text-cherry-600 dark:text-cherry-400">`;
      Icon($$payload, {
        icon: "mdi:comment-multiple-outline",
        class: "w-5 h-5 mr-1"
      });
      $$payload.out += `<!----> <span class="text-sm font-medium">${escape_html(category.topic_count || 0)}</span></div> `;
      if (category.last_activity_at) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<div class="text-xs text-gray-500 dark:text-gray-400 mt-1">Last activity: ${escape_html(new Date(category.last_activity_at).toLocaleDateString())}</div>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--></div></div></div></div></a>`;
    }
    $$payload.out += `<!--]--></div>`;
  }
  $$payload.out += `<!--]--></div> <div class="forum-list"><!--[-->`;
  for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
    let category = each_array_1[$$index_1];
    $$payload.out += `<div class="category"><h3>${escape_html(category.name)}</h3> <p>${escape_html(category.description)}</p></div>`;
  }
  $$payload.out += `<!--]--></div> `;
  if (topics2.length === 0) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center"><p class="text-gray-600 dark:text-gray-400">No discussions found.</p></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    const each_array_2 = ensure_array_like(topics2);
    $$payload.out += `<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"><div class="divide-y divide-gray-200 dark:divide-gray-700"><!--[-->`;
    for (let $$index_4 = 0, $$length = each_array_2.length; $$index_4 < $$length; $$index_4++) {
      let topic = each_array_2[$$index_4];
      $$payload.out += `<div class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex justify-between items-start"><div class="flex-1"><div class="flex items-start justify-between"><div><a${attr("href", `/forums/${topic.id}`)} class="text-lg font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400">`;
      if (topic.is_pinned) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<i class="fas fa-thumbtack text-indigo-500 mr-1 text-xs"></i>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--> `;
      if (topic.is_locked) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<i class="fas fa-lock text-gray-500 mr-1 text-xs"></i>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--> ${escape_html(topic.title)}</a> <div class="flex flex-wrap gap-1 mt-1">`;
      if (topic.difficulty) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<span${attr_class(`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${stringify(topic.difficulty === "beginner" ? "bg-green-100 text-green-800" : topic.difficulty === "intermediate" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800")}`)}>${escape_html(topic.difficulty.charAt(0).toUpperCase() + topic.difficulty.slice(1))}</span>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--> `;
      if (topic.has_code_examples) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"><i class="fas fa-code mr-1"></i>Code</span>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--> `;
      if (topic.is_resolved) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"><i class="fas fa-check-circle mr-1"></i>Resolved</span>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--></div> `;
      if (topic.tags?.length) {
        $$payload.out += "<!--[-->";
        const each_array_3 = ensure_array_like(topic.tags);
        $$payload.out += `<div class="flex flex-wrap gap-1 mt-2"><!--[-->`;
        for (let $$index_2 = 0, $$length2 = each_array_3.length; $$index_2 < $$length2; $$index_2++) {
          let tag = each_array_3[$$index_2];
          $$payload.out += `<a${attr("href", `/forums/tag/${tag}`)} class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200">#${escape_html(tag)}</a>`;
        }
        $$payload.out += `<!--]--></div>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--> `;
      if (topic.resource_links) {
        $$payload.out += "<!--[-->";
        const each_array_4 = ensure_array_like(topic.resource_links);
        $$payload.out += `<div class="mt-2"><span class="text-xs text-gray-500">Resources:</span> <div class="flex flex-wrap gap-2 mt-1"><!--[-->`;
        for (let $$index_3 = 0, $$length2 = each_array_4.length; $$index_3 < $$length2; $$index_3++) {
          let link = each_array_4[$$index_3];
          $$payload.out += `<a${attr("href", link.url)} target="_blank" rel="noopener" class="inline-flex items-center text-xs text-indigo-600 hover:underline"><i class="fas fa-external-link-alt mr-1"></i>${escape_html(link.title)}</a>`;
        }
        $$payload.out += `<!--]--></div></div>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--></div> <div class="ml-2">`;
      if (getCategoryById(topic.category_id)) {
        $$payload.out += "<!--[-->";
        const cat = getCategoryById(topic.category_id);
        $$payload.out += `<a${attr("href", `/forums/category/${topic.category_id}`)}${attr_class(`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stringify(getCategoryColorClass(cat.color))}`)}><i${attr_class(`fas ${cat.icon} mr-1`)}></i> ${escape_html(cat.name)}</a>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--></div></div> <div class="mt-2 flex items-center text-sm text-gray-500"><div class="flex items-center">`;
      if (topic.author.avatar) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<img${attr("src", topic.author.avatar)}${attr("alt", topic.author.name)} class="w-5 h-5 rounded-full mr-1.5">`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--> <a${attr("href", `/profile/${topic.author.id}`)} class="font-medium hover:underline text-gray-700">${escape_html(topic.author.name)}</a> <span class="mx-1.5">·</span><span>${escape_html(formatDate(topic.created_at))}</span></div> <div class="flex items-center ml-auto space-x-4"><div class="flex items-center"><i class="fas fa-eye mr-1 text-gray-400"></i><span>${escape_html(topic.views)}</span></div> <div class="flex items-center"><i class="fas fa-comment-alt mr-1 text-gray-400"></i><span>${escape_html(topic.post_count)}</span></div></div></div> `;
      if (topic.last_post) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<div class="mt-2 text-xs text-gray-500 flex items-center"><span>Last reply by</span> <div class="flex items-center ml-1">`;
        if (topic.last_post.author.avatar) {
          $$payload.out += "<!--[-->";
          $$payload.out += `<img${attr("src", topic.last_post.author.avatar)}${attr("alt", topic.last_post.author.name)} class="w-4 h-4 rounded-full mr-1">`;
        } else {
          $$payload.out += "<!--[!-->";
        }
        $$payload.out += `<!--]--> <a${attr("href", `/profile/${topic.last_post.author.id}`)} class="font-medium hover:underline text-gray-700">${escape_html(topic.last_post.author.name)}</a></div> <span class="mx-1">·</span><span>${escape_html(formatDate(topic.last_post.date))}</span></div>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--></div> <div class="ml-4 flex flex-col items-end gap-2"><div class="flex flex-col items-center space-y-1"><button${attr_class(`text-gray-400 hover:text-green-600 ${stringify(topic.user_vote === "up" ? "text-green-600 font-bold" : "")}`)}${attr("disabled", votingTopicId === topic.id, true)}><i class="fas fa-arrow-up"></i> `;
      if (votingTopicId === topic.id) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<span class="ml-1 animate-spin">⏳</span>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--></button> <span class="text-sm text-gray-600 dark:text-gray-400">${escape_html(topic.upvotes || 0)}</span> <button${attr_class(`text-gray-400 hover:text-red-600 ${stringify(topic.user_vote === "down" ? "text-red-600 font-bold" : "")}`)}${attr("disabled", votingTopicId === topic.id, true)}><i class="fas fa-arrow-down"></i> `;
      if (votingTopicId === topic.id) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<span class="ml-1 animate-spin">⏳</span>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--></button> <span class="text-sm text-gray-600 dark:text-gray-400">${escape_html(topic.downvotes || 0)}</span></div> `;
      if (store_get($$store_subs ??= {}, "$subscribedTopics", subscribedTopics).includes(topic.id)) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<button class="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded"${attr("disabled", unsubscribingTopicId === topic.id, true)}><i class="fas fa-bell-slash mr-1"></i>Unsubscribe `;
        if (unsubscribingTopicId === topic.id) {
          $$payload.out += "<!--[-->";
          $$payload.out += `<span class="ml-1 animate-spin">⏳</span>`;
        } else {
          $$payload.out += "<!--[!-->";
        }
        $$payload.out += `<!--]--></button>`;
      } else {
        $$payload.out += "<!--[!-->";
        $$payload.out += `<button class="px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded"${attr("disabled", subscribingTopicId === topic.id, true)}><i class="fas fa-bell mr-1"></i>Subscribe `;
        if (subscribingTopicId === topic.id) {
          $$payload.out += "<!--[-->";
          $$payload.out += `<span class="ml-1 animate-spin">⏳</span>`;
        } else {
          $$payload.out += "<!--[!-->";
        }
        $$payload.out += `<!--]--></button>`;
      }
      $$payload.out += `<!--]--></div></div>`;
    }
    $$payload.out += `<!--]--></div></div>`;
  }
  $$payload.out += `<!--]-->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, {
    topics: topics2,
    votingTopicId,
    subscribingTopicId,
    unsubscribingTopicId,
    showHeader,
    limit
  });
  pop();
}
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let searchQuery = "";
  {
    store_get($$store_subs ??= {}, "$topics", topics);
  }
  $$payload.out += `<div class="container mx-auto px-4 py-8"><div class="grid grid-cols-1 lg:grid-cols-3 gap-8"><div class="lg:col-span-2">`;
  ForumList($$payload, {});
  $$payload.out += `<!----> `;
  if (store_get($$store_subs ??= {}, "$topics", topics).length > 0) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="mt-12"><div class="flex justify-between items-center mb-6"><h2 class="text-xl font-semibold text-gray-900 dark:text-white">Recent Discussions</h2> <div class="relative"><input type="text"${attr("value", searchQuery)} placeholder="Search topics..." class="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-cherry-500 focus:border-cherry-500 dark:focus:ring-cherry-400 dark:focus:border-cherry-400"> `;
    Icon($$payload, {
      icon: "mdi:magnify",
      class: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
    });
    $$payload.out += `<!----></div></div> `;
    if (store_get($$store_subs ??= {}, "$isLoading", isLoading)) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div class="flex justify-center items-center py-12"><div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cherry-500"></div></div>`;
    } else if (store_get($$store_subs ??= {}, "$error", error)) {
      $$payload.out += "<!--[1-->";
      $$payload.out += `<div class="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-md mb-6"><p>${escape_html(store_get($$store_subs ??= {}, "$error", error))}</p></div>`;
    } else {
      $$payload.out += "<!--[!-->";
      const each_array_1 = ensure_array_like(store_get($$store_subs ??= {}, "$recentTopics", recentTopics));
      if (store_get($$store_subs ??= {}, "$pinnedTopics", pinnedTopics).length > 0 && true) {
        $$payload.out += "<!--[-->";
        const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$pinnedTopics", pinnedTopics));
        $$payload.out += `<div class="mb-6"><h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Pinned Topics</h3> <div class="space-y-4"><!--[-->`;
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let topic = each_array[$$index];
          $$payload.out += `<a${attr("href", `/forums/topic/${stringify(topic.id)}`)} class="block"><div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border-l-4 border-cherry-500 dark:border-cherry-400"><div class="p-4"><div class="flex items-start"><div class="flex-shrink-0 mr-3">`;
          Icon($$payload, {
            icon: "mdi:pin",
            class: "w-5 h-5 text-cherry-600 dark:text-cherry-400"
          });
          $$payload.out += `<!----></div> <div class="flex-1"><h4 class="text-lg font-medium text-gray-900 dark:text-white mb-1">${escape_html(topic.title)}</h4> <div class="flex items-center text-sm text-gray-600 dark:text-gray-400"><span>${escape_html(topic.authorName || "Unknown")}</span> <span class="mx-2">•</span> <span>${escape_html(new Date(topic.createdAt).toLocaleDateString())}</span> <span class="mx-2">•</span> <span class="flex items-center">`;
          Icon($$payload, {
            icon: "mdi:comment-outline",
            class: "w-4 h-4 mr-1"
          });
          $$payload.out += `<!----> ${escape_html(topic.replyCount)}</span></div></div></div></div></div></a>`;
        }
        $$payload.out += `<!--]--></div></div>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--> <div class="space-y-4"><!--[-->`;
      for (let $$index_2 = 0, $$length = each_array_1.length; $$index_2 < $$length; $$index_2++) {
        let topic = each_array_1[$$index_2];
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
        $$payload.out += `<!----> ${escape_html(topic.replyCount)}</span></div> `;
        if (topic.tags && topic.tags.length > 0) {
          $$payload.out += "<!--[-->";
          const each_array_2 = ensure_array_like(topic.tags);
          $$payload.out += `<div class="flex flex-wrap gap-2"><!--[-->`;
          for (let $$index_1 = 0, $$length2 = each_array_2.length; $$index_1 < $$length2; $$index_1++) {
            let tag = each_array_2[$$index_1];
            $$payload.out += `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">${escape_html(tag)}</span>`;
          }
          $$payload.out += `<!--]--></div>`;
        } else {
          $$payload.out += "<!--[!-->";
        }
        $$payload.out += `<!--]--></div></div></a>`;
      }
      $$payload.out += `<!--]--></div>`;
    }
    $$payload.out += `<!--]--></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div> <div class="lg:col-span-1"><div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 mb-6"><h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Start a Discussion</h3> <p class="text-gray-600 dark:text-gray-400 mb-4">Have a question or want to share something with the community?</p> <a href="/forums/create" class="inline-block w-full px-4 py-2 text-center bg-cherry-600 text-white rounded-md hover:bg-cherry-700 dark:bg-cherry-500 dark:hover:bg-cherry-600 transition-colors">Create New Topic</a></div> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5"><h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Forum Guidelines</h3> <ul class="space-y-2 text-gray-600 dark:text-gray-400"><li class="flex items-start">`;
  Icon($$payload, {
    icon: "mdi:check-circle",
    class: "w-5 h-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5"
  });
  $$payload.out += `<!----> <span>Be respectful and kind to others</span></li> <li class="flex items-start">`;
  Icon($$payload, {
    icon: "mdi:check-circle",
    class: "w-5 h-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5"
  });
  $$payload.out += `<!----> <span>Stay on topic and use appropriate categories</span></li> <li class="flex items-start">`;
  Icon($$payload, {
    icon: "mdi:check-circle",
    class: "w-5 h-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5"
  });
  $$payload.out += `<!----> <span>Search before posting to avoid duplicates</span></li> <li class="flex items-start">`;
  Icon($$payload, {
    icon: "mdi:check-circle",
    class: "w-5 h-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5"
  });
  $$payload.out += `<!----> <span>Use descriptive titles for your topics</span></li> <li class="flex items-start">`;
  Icon($$payload, {
    icon: "mdi:check-circle",
    class: "w-5 h-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5"
  });
  $$payload.out += `<!----> <span>Format code properly using markdown</span></li></ul></div></div></div></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
//# sourceMappingURL=_page.svelte.js.map
