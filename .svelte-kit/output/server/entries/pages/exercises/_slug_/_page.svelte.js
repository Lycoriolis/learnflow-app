import { C as store_get, O as head, K as unsubscribe_stores, B as pop, z as push, F as escape_html } from "../../../../chunks/index.js";
import { p as page } from "../../../../chunks/stores.js";
import "marked";
/* empty css                                                                */
import "gray-matter";
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  store_get($$store_subs ??= {}, "$page", page).params.slug;
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>${escape_html("Exercise")} | LearnFlow</title>`;
  });
  $$payload.out += `<div class="max-w-3xl mx-auto px-4 py-8">`;
  {
    $$payload.out += "<!--[-->";
    $$payload.out += `<p>Loading exercise...</p>`;
  }
  $$payload.out += `<!--]--></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
