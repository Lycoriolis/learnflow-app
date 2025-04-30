import { C as store_get, F as escape_html, I as attr, K as unsubscribe_stores, B as pop, z as push, O as head } from "../../../chunks/index.js";
import "firebase/auth";
import { a as authError, l as loading } from "../../../chunks/authStore.js";
function ResetPassword($$payload, $$props) {
  push();
  var $$store_subs;
  let email = "";
  $$payload.out += `<div class="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md"><h2 class="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Reset Password</h2> `;
  if (store_get($$store_subs ??= {}, "$authError", authError)) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert"><span class="block sm:inline">${escape_html(store_get($$store_subs ??= {}, "$authError", authError))}</span></div>`;
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
  $$payload.out += `<!--]--> <form class="space-y-4"><div><label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label> <input type="email" id="email"${attr("value", email)} class="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required> <p class="text-xs text-gray-500 mt-1">We'll send you a link to reset your password</p></div> <div><button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"${attr("disabled", store_get($$store_subs ??= {}, "$loading", loading), true)}>`;
  if (store_get($$store_subs ??= {}, "$loading", loading)) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<span class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> Send Reset Link</button></div></form> <div class="mt-4 text-center"><a href="/login" class="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">Back to login</a></div></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
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
    ResetPassword($$payload);
  }
  $$payload.out += `<!--]--></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
}
export {
  _page as default
};
