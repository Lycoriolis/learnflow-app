import { E as ensure_array_like, O as head, F as escape_html, M as bind_props, B as pop, z as push } from "../../../../chunks/index.js";
import "../../../../chunks/client.js";
function _page($$payload, $$props) {
  push();
  let data = $$props["data"];
  let tmp = data, topics = tmp.topics, categories = tmp.categories;
  const each_array_2 = ensure_array_like(categories);
  const each_array_3 = ensure_array_like(topics);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Manage Forums | Admin</title>`;
  });
  $$payload.out += `<div class="container mx-auto p-4"><h1 class="text-2xl font-bold mb-4">Forum Management</h1> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <div class="flex justify-between items-center mb-2"><h2 class="text-xl font-semibold">Categories</h2> <button class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"><i class="fas fa-plus mr-1"></i> New Category</button></div> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <table class="min-w-full bg-white dark:bg-gray-800 mb-6"><thead><tr><th class="px-4 py-2">ID</th><th class="px-4 py-2">Name</th><th class="px-4 py-2">Description</th><th class="px-4 py-2">Actions</th></tr></thead><tbody><!--[-->`;
  for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
    let c = each_array_2[$$index_2];
    $$payload.out += `<tr class="hover:bg-gray-100 dark:hover:bg-gray-700"><td class="border px-4 py-2 text-sm">${escape_html(c.id)}</td><td class="border px-4 py-2 text-sm">${escape_html(c.name)}</td><td class="border px-4 py-2 text-sm">${escape_html(c.description)}</td><td class="border px-4 py-2 text-sm space-x-2"><button class="text-blue-600 hover:underline">Edit</button> <button class="text-red-600 hover:underline">Delete</button></td></tr>`;
  }
  $$payload.out += `<!--]--></tbody></table> <h2 class="text-xl font-semibold mt-6 mb-2">Topics</h2> <table class="min-w-full bg-white dark:bg-gray-800"><thead><tr><th class="px-4 py-2">Title</th><th class="px-4 py-2">Category</th><th class="px-4 py-2">Author</th><th class="px-4 py-2">Created</th><th class="px-4 py-2">Actions</th></tr></thead><tbody><!--[-->`;
  for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
    let t = each_array_3[$$index_3];
    $$payload.out += `<tr class="hover:bg-gray-100 dark:hover:bg-gray-700"><td class="border px-4 py-2 text-sm">${escape_html(t.title)}</td><td class="border px-4 py-2 text-sm">${escape_html(categories.find((c) => c.id === t.category)?.name || t.category)}</td><td class="border px-4 py-2 text-sm">${escape_html(t.author.name)}</td><td class="border px-4 py-2 text-sm">${escape_html(new Date(t.createdAt).toLocaleDateString())}</td><td class="border px-4 py-2 text-sm space-x-2"><button class="text-blue-600 hover:underline">Edit</button> <button class="text-red-600 hover:underline">Delete</button></td></tr>`;
  }
  $$payload.out += `<!--]--></tbody></table></div>`;
  bind_props($$props, { data });
  pop();
}
export {
  _page as default
};
