import { c as store_get, u as unsubscribe_stores, a as pop, p as push } from "../../../chunks/index3.js";
import { g as goto } from "../../../chunks/client.js";
import { p as page } from "../../../chunks/stores.js";
import { l as loading, i as isAuthenticated, a as authError } from "../../../chunks/authStore.js";
import { o as onDestroy } from "../../../chunks/index-server.js";
import "firebase/auth";
import "clsx";
function _layout($$payload, $$props) {
  push();
  var $$store_subs;
  let checked = false;
  function redirectToLogin() {
    goto("/login?redirect=" + encodeURIComponent(store_get($$store_subs ??= {}, "$page", page).url.pathname));
  }
  onDestroy(() => {
  });
  if (!store_get($$store_subs ??= {}, "$loading", loading) && !checked) {
    checked = true;
    console.log("Auth check in protected layout:", {
      isAuthenticated: store_get($$store_subs ??= {}, "$isAuthenticated", isAuthenticated),
      loading: store_get($$store_subs ??= {}, "$loading", loading)
    });
    if (!store_get($$store_subs ??= {}, "$isAuthenticated", isAuthenticated)) {
      console.warn("User not authenticated, redirecting to login");
      redirectToLogin();
    }
  }
  if (store_get($$store_subs ??= {}, "$authError", authError)) {
    store_get($$store_subs ??= {}, "$authError", authError);
  }
  if (store_get($$store_subs ??= {}, "$loading", loading) || true) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex justify-center items-center"><div class="flex flex-col items-center"><div class="w-16 h-16 border-4 border-t-indigo-500 border-indigo-200 rounded-full animate-spin"></div> <p class="mt-4 text-gray-600 dark:text-gray-400">Verifying authentication...</p></div></div>`;
  }
  $$payload.out += `<!--]-->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _layout as default
};
//# sourceMappingURL=_layout.svelte.js.map
