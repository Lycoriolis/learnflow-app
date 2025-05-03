import { h as head, e as ensure_array_like, f as escape_html, b as attr, j as stringify, g as bind_props, a as pop, p as push } from "../../../../chunks/index3.js";
function _page($$payload, $$props) {
  push();
  let data = $$props["data"];
  const items = data.items;
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>LearnFlow | Category: ${escape_html(data.slug || "")}</title>`;
  });
  if (items.length > 0) {
    $$payload.out += "<!--[-->";
    const each_array = ensure_array_like(items);
    $$payload.out += `<div class="max-w-4xl mx-auto px-4 py-8"><h1 class="text-3xl font-bold mb-6">Category: ${escape_html(data.slug || "")}</h1> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`;
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let item = each_array[$$index];
      $$payload.out += `<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"><h2 class="text-xl font-semibold mb-2">${escape_html(item.title)}</h2> `;
      if (item.description) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<p class="text-gray-600 dark:text-gray-300 mb-4">${escape_html(item.description)}</p>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--> <a${attr("href", `/courses/${stringify(item.slug || item.id)}`)} class="text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300">View Course →</a></div>`;
    }
    $$payload.out += `<!--]--></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div class="flex justify-center items-center min-h-[60vh]"><div class="text-gray-500">No items found in this category</div></div>`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { data });
  pop();
}
export {
  _page as default
};
//# sourceMappingURL=_page.svelte.js.map
