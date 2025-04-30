import { C as store_get, F as escape_html, I as attr, K as unsubscribe_stores, B as pop, z as push, N as fallback, M as bind_props } from "../../../../../chunks/index.js";
import { u as user } from "../../../../../chunks/authStore.js";
import "marked";
/* empty css                                                                   */
function NewPostForm($$payload, $$props) {
  push();
  var $$store_subs;
  let currentUser;
  let content = "";
  currentUser = store_get($$store_subs ??= {}, "$user", user);
  if (currentUser?.uid) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="new-post-form"><textarea class="w-full p-3 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" rows="4" placeholder="Write your reply here...">`;
    const $$body = escape_html(content);
    if ($$body) {
      $$payload.out += `${$$body}`;
    }
    $$payload.out += `</textarea> <button class="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"${attr("disabled", !content.trim(), true)}>Post Reply</button></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<p class="text-gray-600 dark:text-gray-400">You must be <a href="/login" class="text-indigo-600 hover:underline">logged in</a> to post a reply.</p>`;
  }
  $$payload.out += `<!--]-->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function ForumTopic($$payload, $$props) {
  push();
  var $$store_subs;
  let paginatedPosts;
  let topic = fallback(
    $$props["topic"],
    () => ({
      id: "",
      title: "Loading...",
      content: "",
      author: "",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    }),
    true
  );
  let posts = [];
  let repliesPerPage = 10;
  let currentPage = 1;
  posts.length > paginatedPosts.length;
  paginatedPosts = posts.slice(0, repliesPerPage * currentPage);
  store_get($$store_subs ??= {}, "$user", user);
  $$payload.out += `<div class="forum-topic p-4"><h1 class="text-3xl font-bold mb-2">${escape_html(topic.title)}</h1> <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Started by ${escape_html(topic.author)} on ${escape_html(new Date(topic.createdAt).toLocaleString())}</p> <div class="topic-content mb-6 p-4 border rounded bg-gray-50 dark:bg-gray-800"><p>${escape_html(topic.content)}</p></div> <h2 class="text-2xl font-semibold mb-4">Replies</h2> `;
  {
    $$payload.out += "<!--[-->";
    $$payload.out += `<p>Loading replies...</p>`;
  }
  $$payload.out += `<!--]--> <div class="mt-8"><h3 class="text-xl font-semibold mb-3">Add a Reply</h3> `;
  NewPostForm($$payload);
  $$payload.out += `<!----></div></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { topic });
  pop();
}
function _page($$payload, $$props) {
  push();
  let data = $$props["data"];
  let topic = data.topic;
  let posts = data.posts;
  ForumTopic($$payload, { topic, posts });
  bind_props($$props, { data });
  pop();
}
export {
  _page as default
};
