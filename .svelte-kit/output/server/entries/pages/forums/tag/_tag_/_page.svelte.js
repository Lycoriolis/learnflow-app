import { O as head, F as escape_html, M as bind_props, B as pop, z as push } from "../../../../../chunks/index.js";
import "clsx";
import "firebase/auth";
import { F as ForumHeader, a as ForumList, b as ForumSidebar } from "../../../../../chunks/ForumSidebar.js";
function _page($$payload, $$props) {
  push();
  let data = $$props["data"];
  let topics = data.topics;
  let categories = data.categories;
  let selectedTag = data.selectedTag;
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Tag: ${escape_html(selectedTag)} | LearnFlow Forums</title>`;
  });
  $$payload.out += `<div class="container mx-auto px-4 py-8 max-w-7xl">`;
  ForumHeader($$payload);
  $$payload.out += `<!----> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <div class="grid grid-cols-1 lg:grid-cols-12 gap-8"><div class="lg:col-span-9"><h2 class="text-2xl font-bold mb-4">Tag: ${escape_html(selectedTag)}</h2> `;
  ForumList($$payload, { topics, categories });
  $$payload.out += `<!----></div> <div class="lg:col-span-3">`;
  ForumSidebar($$payload, { categories, filterCategory: "all" });
  $$payload.out += `<!----></div></div></div>`;
  bind_props($$props, { data });
  pop();
}
export {
  _page as default
};
