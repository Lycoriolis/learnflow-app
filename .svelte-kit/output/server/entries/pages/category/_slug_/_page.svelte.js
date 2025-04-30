import { O as head, F as escape_html, M as bind_props, B as pop, z as push } from "../../../../chunks/index.js";
function _page($$payload, $$props) {
  push();
  let data = $$props["data"];
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>LearnFlow | Category: ${escape_html(data.categoryName)}</title>`;
  });
  $$payload.out += `<div class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8"><h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Category: ${escape_html(data.categoryName)}</h1> <p class="text-gray-600 dark:text-gray-300">Courses and content related to '${escape_html(data.slug)}' will be listed here. (Placeholder)</p></div>`;
  bind_props($$props, { data });
  pop();
}
export {
  _page as default
};
