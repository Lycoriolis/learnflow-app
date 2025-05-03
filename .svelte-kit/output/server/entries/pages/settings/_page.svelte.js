import { h as head, c as store_get, b as attr, f as escape_html, u as unsubscribe_stores, a as pop, p as push } from "../../../chunks/index3.js";
import { l as loading, i as isAuthenticated, u as user } from "../../../chunks/authStore.js";
import "../../../chunks/client.js";
import { u as userProfileLoading, a as userProfile } from "../../../chunks/userProfileStore.js";
import "firebase/auth";
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let displayName = "";
  let email = "";
  let durations = {
    work: 25,
    shortBreak: 5,
    longBreak: 15,
    interval: 4
  };
  let saving = false;
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Account Settings | LearnFlow</title>`;
  });
  $$payload.out += `<div class="max-w-3xl mx-auto px-4 py-6">`;
  if (store_get($$store_subs ??= {}, "$authLoading", loading) || store_get($$store_subs ??= {}, "$userProfileLoading", userProfileLoading)) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="flex justify-center items-center min-h-[50vh]"><i class="fas fa-spinner fa-spin text-3xl text-indigo-500"></i></div>`;
  } else if (store_get($$store_subs ??= {}, "$isAuthenticated", isAuthenticated) && store_get($$store_subs ??= {}, "$user", user) && store_get($$store_subs ??= {}, "$userProfile", userProfile)) {
    $$payload.out += "<!--[1-->";
    $$payload.out += `<h1 class="text-2xl font-bold mb-4">Account Settings</h1> `;
    {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-6"><div><h2 class="text-lg font-semibold mb-2">Profile</h2> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label for="displayName" class="block text-sm font-medium mb-1">Display Name</label> <input type="text" id="displayName"${attr("value", displayName)} class="w-full rounded border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"></div> <div><label for="email" class="block text-sm font-medium mb-1">Email (cannot change)</label> <input type="email" id="email"${attr("value", email)} readonly class="w-full rounded border-gray-300 dark:border-gray-600 p-2 bg-gray-100 dark:bg-gray-600 text-gray-500"></div></div></div> <div><h2 class="text-lg font-semibold mb-2">Preferences</h2> <div class="space-y-4"><div><label for="theme" class="block text-sm font-medium mb-1">Theme</label> <select id="theme" class="w-full rounded border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-700"><option value="auto">Auto</option><option value="light">Light</option><option value="dark">Dark</option></select></div> <div><fieldset class="space-y-4"><legend class="text-sm font-medium mb-1">Pomodoro Durations (minutes)</legend> <div class="grid grid-cols-2 gap-4"><div><label for="work-duration" class="block text-sm text-gray-500">Work Duration</label> <input type="number" id="work-duration" min="1"${attr("value", durations.work)} class="w-full rounded border-gray-300 dark:border-gray-600 p-2"></div> <div><label for="short-break" class="block text-sm text-gray-500">Short Break</label> <input type="number" id="short-break" min="1"${attr("value", durations.shortBreak)} class="w-full rounded border-gray-300 dark:border-gray-600 p-2"></div> <div><label for="long-break" class="block text-sm text-gray-500">Long Break</label> <input type="number" id="long-break" min="1"${attr("value", durations.longBreak)} class="w-full rounded border-gray-300 dark:border-gray-600 p-2"></div> <div><label for="interval" class="block text-sm text-gray-500">Sessions Before Long Break</label> <input type="number" id="interval" min="1"${attr("value", durations.interval)} class="w-full rounded border-gray-300 dark:border-gray-600 p-2"></div></div></fieldset></div></div></div> <div class="flex justify-end space-x-2"><button class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Sign Out</button> <button class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"${attr("disabled", saving, true)}>${escape_html("Save Changes")}</button></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div class="text-center py-20"><p class="text-lg text-gray-600 dark:text-gray-300 mb-4">Please log in to manage your settings.</p> <button class="px-6 py-2 bg-indigo-600 text-white rounded">Log In</button></div>`;
  }
  $$payload.out += `<!--]--></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
//# sourceMappingURL=_page.svelte.js.map
