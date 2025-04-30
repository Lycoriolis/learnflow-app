import { C as store_get, O as head, K as unsubscribe_stores, B as pop, z as push, F as escape_html } from "../../../../chunks/index.js";
import { p as page } from "../../../../chunks/stores.js";
import "../../../../chunks/client.js";
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  store_get($$store_subs ??= {}, "$page", page).params.id;
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>${escape_html("Group")} | LearnFlow</title>`;
  });
  $$payload.out += `<div class="max-w-2xl mx-auto py-10 px-4">`;
  {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="text-center text-gray-500">Loading...</div>`;
  }
  $$payload.out += `<!--]--></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
