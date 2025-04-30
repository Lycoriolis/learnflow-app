import "clsx";
import { B as pop, z as push, N as fallback, C as store_get, E as ensure_array_like, I as attr, F as escape_html, G as attr_class, J as stringify, K as unsubscribe_stores, M as bind_props } from "./index.js";
import { p as persistentStore } from "./persistentStore.js";
import { u as user } from "./authStore.js";
function ForumHeader($$payload, $$props) {
  push();
  $$payload.out += `<div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"><div><h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Community Forums</h1> <p class="text-gray-600 dark:text-gray-400">Discuss courses, ask questions, and connect with other learners</p></div> <div class="mt-4 md:mt-0 flex space-x-2"><button class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium flex items-center"><i class="fas fa-plus mr-2"></i> New Topic</button> <button class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md text-sm font-medium flex items-center"><i class="fas fa-bell mr-2"></i> My Subscriptions</button></div></div>`;
  pop();
}
const subscribedTopics = persistentStore("learnflow-subscribed-topics", []);
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
  let topics = fallback($$props["topics"], () => [], true);
  let categories = fallback($$props["categories"], () => [], true);
  let votingTopicId = fallback($$props["votingTopicId"], null);
  let subscribingTopicId = fallback($$props["subscribingTopicId"], null);
  let unsubscribingTopicId = fallback($$props["unsubscribingTopicId"], null);
  store_get($$store_subs ??= {}, "$user", user);
  if (topics.length === 0) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center"><p class="text-gray-600 dark:text-gray-400">No discussions found.</p></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    const each_array = ensure_array_like(topics);
    $$payload.out += `<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"><div class="divide-y divide-gray-200 dark:divide-gray-700"><!--[-->`;
    for (let $$index_2 = 0, $$length = each_array.length; $$index_2 < $$length; $$index_2++) {
      let topic = each_array[$$index_2];
      $$payload.out += `<div class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex justify-between items-start"><div class="flex-1"><div class="flex items-start justify-between"><div><a${attr("href", `/forums/${topic.id}`)} class="text-lg font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400">`;
      if (topic.isPinned) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<i class="fas fa-thumbtack text-indigo-500 mr-1 text-xs"></i>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--> `;
      if (topic.isLocked) {
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
      if (topic.hasCodeExamples) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"><i class="fas fa-code mr-1"></i>Code</span>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--> `;
      if (topic.isResolved) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"><i class="fas fa-check-circle mr-1"></i>Resolved</span>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--></div> `;
      if (topic.tags?.length) {
        $$payload.out += "<!--[-->";
        const each_array_1 = ensure_array_like(topic.tags);
        $$payload.out += `<div class="flex flex-wrap gap-1 mt-2"><!--[-->`;
        for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
          let tag = each_array_1[$$index];
          $$payload.out += `<a${attr("href", `/forums/tag/${tag}`)} class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200">#${escape_html(tag)}</a>`;
        }
        $$payload.out += `<!--]--></div>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--> `;
      if (topic.resourceLinks) {
        $$payload.out += "<!--[-->";
        const each_array_2 = ensure_array_like(topic.resourceLinks);
        $$payload.out += `<div class="mt-2"><span class="text-xs text-gray-500">Resources:</span> <div class="flex flex-wrap gap-2 mt-1"><!--[-->`;
        for (let $$index_1 = 0, $$length2 = each_array_2.length; $$index_1 < $$length2; $$index_1++) {
          let link = each_array_2[$$index_1];
          $$payload.out += `<a${attr("href", link.url)} target="_blank" rel="noopener" class="inline-flex items-center text-xs text-indigo-600 hover:underline"><i class="fas fa-external-link-alt mr-1"></i>${escape_html(link.title)}</a>`;
        }
        $$payload.out += `<!--]--></div></div>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--></div> <div class="ml-2">`;
      if (getCategoryById(topic.category)) {
        $$payload.out += "<!--[-->";
        const cat = getCategoryById(topic.category);
        $$payload.out += `<a${attr("href", `/forums/category/${topic.category}`)}${attr_class(`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stringify(getCategoryColorClass(cat.color))}`)}><i${attr_class(`fas ${cat.icon} mr-1`)}></i> ${escape_html(cat.name)}</a>`;
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
      $$payload.out += `<!--]--> <a${attr("href", `/profile/${topic.author.id}`)} class="font-medium hover:underline text-gray-700">${escape_html(topic.author.name)}</a> <span class="mx-1.5">·</span><span>${escape_html(formatDate(topic.createdAt))}</span></div> <div class="flex items-center ml-auto space-x-4"><div class="flex items-center"><i class="fas fa-eye mr-1 text-gray-400"></i><span>${escape_html(topic.viewsCount)}</span></div> <div class="flex items-center"><i class="fas fa-comment-alt mr-1 text-gray-400"></i><span>${escape_html(topic.repliesCount)}</span></div></div></div> `;
      if (topic.lastPost) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<div class="mt-2 text-xs text-gray-500 flex items-center"><span>Last reply by</span> <div class="flex items-center ml-1">`;
        if (topic.lastPost.author.avatar) {
          $$payload.out += "<!--[-->";
          $$payload.out += `<img${attr("src", topic.lastPost.author.avatar)}${attr("alt", topic.lastPost.author.name)} class="w-4 h-4 rounded-full mr-1">`;
        } else {
          $$payload.out += "<!--[!-->";
        }
        $$payload.out += `<!--]--> <a${attr("href", `/profile/${topic.lastPost.author.id}`)} class="font-medium hover:underline text-gray-700">${escape_html(topic.lastPost.author.name)}</a></div> <span class="mx-1">·</span><span>${escape_html(formatDate(topic.lastPost.date))}</span></div>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--></div> <div class="ml-4 flex flex-col items-end gap-2"><div class="flex flex-col items-center space-y-1"><button${attr_class(`text-gray-400 hover:text-green-600 ${stringify(topic.userVote === "up" ? "text-green-600 font-bold" : "")}`)}${attr("disabled", votingTopicId === topic.id, true)}><i class="fas fa-arrow-up"></i> `;
      if (votingTopicId === topic.id) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<span class="ml-1 animate-spin">⏳</span>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--></button> <span class="text-sm text-gray-600 dark:text-gray-400">${escape_html(topic.upvotes || 0)}</span> <button${attr_class(`text-gray-400 hover:text-red-600 ${stringify(topic.userVote === "down" ? "text-red-600 font-bold" : "")}`)}${attr("disabled", votingTopicId === topic.id, true)}><i class="fas fa-arrow-down"></i> `;
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
    topics,
    categories,
    votingTopicId,
    subscribingTopicId,
    unsubscribingTopicId
  });
  pop();
}
function ForumSidebar($$payload, $$props) {
  let categories = fallback($$props["categories"], () => [], true);
  let filterCategory = $$props["filterCategory"];
  const each_array = ensure_array_like(categories);
  $$payload.out += `<div class="space-y-6"><div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4"><h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Categories</h3> <ul class="space-y-2"><li><a href="/forums"${attr_class(`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${stringify(filterCategory === "all" ? "bg-indigo-100 dark:bg-indigo-700 text-indigo-700 dark:text-indigo-100" : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700")}`)}><i class="fas fa-list mr-2"></i> All Categories</a></li> <!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let category = each_array[$$index];
    $$payload.out += `<li><a${attr("href", `/forums/category/${category.id}`)}${attr_class(`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${stringify(filterCategory === category.id ? "bg-indigo-100 dark:bg-indigo-700 text-indigo-700 dark:text-indigo-100" : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700")}`)}><i${attr_class(`fas ${category.icon} mr-2`)}></i> ${escape_html(category.name)}</a></li>`;
  }
  $$payload.out += `<!--]--></ul></div> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4"><h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Learning Resources</h3> <ul class="space-y-2 text-sm"><li><a href="/resources/study-guides" class="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center"><i class="fas fa-book mr-2"></i> Study Guides</a></li> <li><a href="/resources/code-examples" class="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center"><i class="fas fa-code mr-2"></i> Code Examples</a></li> <li><a href="/resources/practice-exercises" class="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center"><i class="fas fa-laptop-code mr-2"></i> Practice Exercises</a></li> <li><a href="/resources/community-projects" class="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center"><i class="fas fa-project-diagram mr-2"></i> Community Projects</a></li></ul></div></div>`;
  bind_props($$props, { categories, filterCategory });
}
export {
  ForumHeader as F,
  ForumList as a,
  ForumSidebar as b
};
