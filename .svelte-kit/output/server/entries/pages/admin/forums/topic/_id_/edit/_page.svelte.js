import { c as store_get, b as attr, u as unsubscribe_stores, a as pop, p as push, j as stringify } from "../../../../../../../chunks/index3.js";
import { p as page } from "../../../../../../../chunks/stores.js";
import "firebase/firestore";
import "firebase/auth";
import "../../../../../../../chunks/client.js";
import { I as Icon } from "../../../../../../../chunks/Icon.js";
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  const topicId = store_get($$store_subs ??= {}, "$page", page).params.id;
  $$payload.out += `<div class="container mx-auto px-4 py-8"><div class="max-w-3xl mx-auto"><div class="mb-6"><a${attr("href", `/forums/topic/${stringify(topicId)}`)} class="inline-flex items-center text-cherry-600 dark:text-cherry-400 hover:underline mb-4">`;
  Icon($$payload, { icon: "mdi:arrow-left", class: "w-5 h-5 mr-1" });
  $$payload.out += `<!----> Back to Topic</a> <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Edit Forum Topic</h1></div> `;
  {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="flex justify-center items-center py-12"><div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cherry-500"></div></div>`;
  }
  $$payload.out += `<!--]--></div></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
//# sourceMappingURL=_page.svelte.js.map
