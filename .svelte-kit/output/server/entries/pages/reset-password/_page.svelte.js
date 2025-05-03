import { c as store_get, f as escape_html, b as attr, d as attr_class, u as unsubscribe_stores, g as bind_props, a as pop, p as push, j as stringify, h as head } from "../../../chunks/index3.js";
import "firebase/auth";
import { a as authError, l as loading } from "../../../chunks/authStore.js";
import { y as fallback } from "../../../chunks/utils.js";
import "../../../chunks/client.js";
function ResetPassword($$payload, $$props) {
  push();
  var $$store_subs;
  let redirectTo = fallback($$props["redirectTo"], "/login");
  let email = "";
  let isSubmitting = false;
  let validationErrors = {};
  $$payload.out += `<div class="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md"><h2 class="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Reset Password</h2> `;
  if (store_get($$store_subs ??= {}, "$authError", authError)) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4" role="alert"><span class="block sm:inline">${escape_html(store_get($$store_subs ??= {}, "$authError", authError))}</span></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  {
    $$payload.out += "<!--[-->";
    $$payload.out += `<form class="space-y-4"><div><label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label> <input type="email" id="email"${attr("value", email)}${attr_class(`mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${stringify(validationErrors.email ? "border-red-500" : "")}`)} required autocomplete="email"${attr("aria-invalid", validationErrors.email ? "true" : "false")}${attr("aria-describedby", validationErrors.email ? "email-error" : "email-help")}> <p id="email-help" class="text-xs text-gray-500 dark:text-gray-400 mt-1">We'll send you a link to reset your password</p> `;
    if (validationErrors.email) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<p id="email-error" class="mt-1 text-sm text-red-600 dark:text-red-400">${escape_html(validationErrors.email)}</p>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></div> <div><button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"${attr("disabled", store_get($$store_subs ??= {}, "$loading", loading) || isSubmitting, true)}${attr("aria-busy", store_get($$store_subs ??= {}, "$loading", loading) || isSubmitting)}>`;
    if (store_get($$store_subs ??= {}, "$loading", loading) || isSubmitting) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<span class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" aria-hidden="true"></span> <span>Sending...</span>`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `Send Reset Link`;
    }
    $$payload.out += `<!--]--></button></div></form>`;
  }
  $$payload.out += `<!--]--> <div class="mt-6 text-center"><p class="text-sm text-gray-600 dark:text-gray-400">Remember your password? <a href="/login" class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">Log in</a></p></div> <div class="mt-4 text-center"><p class="text-sm text-gray-600 dark:text-gray-400">Don't have an account? <a href="/register" class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">Sign up</a></p></div></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { redirectTo });
  pop();
}
function _page($$payload) {
  var $$store_subs;
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Reset Password - LearnFlow</title>`;
  });
  $$payload.out += `<div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">`;
  if (store_get($$store_subs ??= {}, "$loading", loading)) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="flex flex-col items-center justify-center"><div class="w-16 h-16 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div> <p class="mt-4 text-gray-600 dark:text-gray-400">Loading...</p></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    ResetPassword($$payload, {});
  }
  $$payload.out += `<!--]--></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
}
export {
  _page as default
};
//# sourceMappingURL=_page.svelte.js.map
