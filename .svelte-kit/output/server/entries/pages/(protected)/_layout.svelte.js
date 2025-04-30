import { C as store_get, P as slot, K as unsubscribe_stores, B as pop, z as push } from "../../../chunks/index.js";
import { g as goto } from "../../../chunks/client.js";
import { p as page } from "../../../chunks/stores.js";
import { l as loading, i as isAuthenticated } from "../../../chunks/authStore.js";
function _layout($$payload, $$props) {
  push();
  var $$store_subs;
  let checked = false;
  if (!store_get($$store_subs ??= {}, "$loading", loading) && !checked) {
    checked = true;
    console.log("Auth check in protected layout:", {
      isAuthenticated: store_get($$store_subs ??= {}, "$isAuthenticated", isAuthenticated),
      loading: store_get($$store_subs ??= {}, "$loading", loading)
    });
    if (!store_get($$store_subs ??= {}, "$isAuthenticated", isAuthenticated)) {
      console.warn("User not authenticated, redirecting to login");
      goto("/login?redirect=" + encodeURIComponent(store_get($$store_subs ??= {}, "$page", page).url.pathname));
    }
  }
  if (store_get($$store_subs ??= {}, "$loading", loading) || !checked) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex justify-center items-center"><div class="flex flex-col items-center"><div class="w-16 h-16 border-4 border-t-indigo-500 border-indigo-200 rounded-full animate-spin"></div> <p class="mt-4 text-gray-600 dark:text-gray-400">Verifying authentication...</p></div></div>`;
  } else if (store_get($$store_subs ??= {}, "$isAuthenticated", isAuthenticated)) {
    $$payload.out += "<!--[1-->";
    $$payload.out += `<!---->`;
    slot($$payload, $$props, "default", {});
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div class="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900"><div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full"><div class="text-center"><div class="mb-4 flex justify-center"><div class="h-16 w-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center"><i class="fas fa-lock text-red-600 dark:text-red-400 text-2xl"></i></div></div> <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Authentication Required</h2> <p class="text-gray-600 dark:text-gray-400 mb-6">You need to be logged in to access this page.</p> <a href="/login" class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded">Go to Login</a></div></div></div>`;
  }
  $$payload.out += `<!--]-->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _layout as default
};
