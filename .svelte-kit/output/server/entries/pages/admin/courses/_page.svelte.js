import { e as ensure_array_like, h as head, f as escape_html, g as bind_props, a as pop, p as push } from "../../../../chunks/index3.js";
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
    let course = each_array[$$index];
    $$payload.out += `<tr class="hover:bg-gray-100 dark:hover:bg-gray-700"><td class="border px-4 py-2">${escape_html(course.title)}</td><td class="border px-4 py-2">${escape_html(course.slug)}</td><td class="border px-4 py-2">${escape_html(course.type)}</td><td class="border px-4 py-2">${escape_html(course.difficulty || "-")}</td><td class="border px-4 py-2 space-x-2"><button class="text-blue-600 hover:underline">Edit</button> <button class="text-red-600 hover:underline">Delete</button></td></tr>`;
  }
  $$payload.out += `<!--]--></tbody></table></div>`;
  bind_props($$props, { data });
  pop();
}
export {
  _page as default
};
//# sourceMappingURL=_page.svelte.js.map
