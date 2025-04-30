import { E as ensure_array_like, O as head, F as escape_html, M as bind_props, B as pop, z as push } from "../../../../chunks/index.js";
function _page($$payload, $$props) {
  push();
  let data = $$props["data"];
  let courses = data.courses;
  const each_array = ensure_array_like(courses);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Manage Courses | Admin</title>`;
  });
  $$payload.out += `<div class="container mx-auto p-4"><h1 class="text-2xl font-bold mb-4">Course Management</h1> <table class="min-w-full bg-white dark:bg-gray-800"><thead><tr><th class="px-4 py-2">Title</th><th class="px-4 py-2">Slug</th><th class="px-4 py-2">Type</th><th class="px-4 py-2">Difficulty</th><th class="px-4 py-2">Actions</th></tr></thead><tbody><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let c = each_array[$$index];
    $$payload.out += `<tr class="hover:bg-gray-100 dark:hover:bg-gray-700"><td class="border px-4 py-2">${escape_html(c.title)}</td><td class="border px-4 py-2">${escape_html(c.slug)}</td><td class="border px-4 py-2">${escape_html(c.type)}</td><td class="border px-4 py-2">${escape_html(c.difficulty || "-")}</td><td class="border px-4 py-2 space-x-2"><button class="text-blue-600 hover:underline">Edit</button> <button class="text-red-600 hover:underline">Delete</button></td></tr>`;
  }
  $$payload.out += `<!--]--></tbody></table></div>`;
  bind_props($$props, { data });
  pop();
}
export {
  _page as default
};
