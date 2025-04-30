import { N as fallback, C as store_get, F as escape_html, I as attr, G as attr_class, K as unsubscribe_stores, M as bind_props, B as pop, z as push, J as stringify, O as head } from "../../../chunks/index.js";
import "firebase/auth";
import { a as authError, l as loading, i as isAuthenticated } from "../../../chunks/authStore.js";
import { g as goto } from "../../../chunks/client.js";
import { p as page } from "../../../chunks/stores.js";
function Login($$payload, $$props) {
  push();
  var $$store_subs;
  let redirectTo = fallback($$props["redirectTo"], "/");
  let email = "";
  let password = "";
  let validationErrors = {};
  let isSubmitting = false;
  $$payload.out += `<div class="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md"><h2 class="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Log In</h2> `;
  if (redirectTo && redirectTo !== "/") {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-4" role="alert"><span class="block sm:inline">You'll be redirected to the requested page after login.</span></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
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
  $$payload.out += `<!--]--> <form class="space-y-4" autocomplete="off"><div><label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label> <input type="email" id="email"${attr("value", email)}${attr_class(`mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${stringify(validationErrors.email ? "border-red-500" : "")}`)} required autocomplete="username"> `;
  if (validationErrors.email) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<p class="mt-1 text-sm text-red-600">${escape_html(validationErrors.email)}</p>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div> <div><label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label> <input type="password" id="password"${attr("value", password)}${attr_class(`mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${stringify(validationErrors.password ? "border-red-500" : "")}`)} required autocomplete="current-password"> `;
  if (validationErrors.password) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<p class="mt-1 text-sm text-red-600">${escape_html(validationErrors.password)}</p>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div> <div><button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"${attr("disabled", store_get($$store_subs ??= {}, "$loading", loading) || isSubmitting, true)}>`;
  if (store_get($$store_subs ??= {}, "$loading", loading) || isSubmitting) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<span class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> Log In</button></div></form> <div class="mt-4"><button class="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"${attr("disabled", store_get($$store_subs ??= {}, "$loading", loading) || isSubmitting, true)}><svg class="h-5 w-5 mr-2" viewBox="0 0 24 24"><path d="M12.545,12.151L12.545,12.151c0,1.054,0.855,1.909,1.909,1.909h3.536c-0.607,1.972-2.101,3.467-4.26,3.866c-3.431,0.589-6.663-1.727-7.253-5.157c-0.589-3.431,1.727-6.663,5.157-7.253c2.136-0.367,4.296,0.317,5.743,1.878l2.72-2.72c-2.099-2.099-5.271-2.853-8.135-1.879C8.234,3.708,4.766,6.152,3.032,9.686c-2.734,5.63,0.01,12.44,5.639,15.174c5.63,2.734,12.44-0.01,15.174-5.639c1.06-2.17,1.369-4.652,0.845-7.036h-9.687C13.25,12.151,12.545,12.151,12.545,12.151z" fill="#F44336"></path><path d="M12.545,12.151v-3.89h9.687c0.521,2.169,0.246,4.432-0.769,6.406c-0.217,0.436-0.453,0.853-0.725,1.241h-6.284C13.4,15.909,12.545,14.055,12.545,12.151z" fill="#2196F3"></path></svg> Sign in with Google</button></div> <div class="mt-4 text-center"><a href="/reset-password" class="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">Forgot password?</a></div> <div class="mt-4 text-center"><p class="text-sm text-gray-600 dark:text-gray-400">Don't have an account? <a href="/register" class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">Sign up</a></p></div></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { redirectTo });
  pop();
}
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let redirectTo;
  redirectTo = store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("redirect") || "/";
  if (!store_get($$store_subs ??= {}, "$loading", loading) && store_get($$store_subs ??= {}, "$isAuthenticated", isAuthenticated)) {
    goto();
  }
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Login - LearnFlow</title>`;
  });
  $$payload.out += `<div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">`;
  if (store_get($$store_subs ??= {}, "$loading", loading)) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="flex flex-col items-center justify-center"><div class="w-16 h-16 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div> <p class="mt-4 text-gray-600 dark:text-gray-400">Loading...</p></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    Login($$payload, { redirectTo });
  }
  $$payload.out += `<!--]--></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
