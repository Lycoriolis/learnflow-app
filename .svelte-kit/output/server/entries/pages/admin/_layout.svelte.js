import { c as store_get, e as ensure_array_like, b as attr, d as attr_class, f as escape_html, j as stringify, i as slot, u as unsubscribe_stores, a as pop, p as push } from "../../../chunks/index3.js";
import { p as page } from "../../../chunks/stores.js";
import { u as user, b as isAdmin } from "../../../chunks/authStore.js";
function _layout($$payload, $$props) {
  push();
  var $$store_subs;
  let currentPath;
  const adminNavItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: "fa-tachometer-alt"
    },
    {
      name: "Courses",
      href: "/admin/courses",
      icon: "fa-book"
    },
    {
      name: "Forums",
      href: "/admin/forums",
      icon: "fa-comments"
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: "fa-users"
    }
  ];
  if (store_get($$store_subs ??= {}, "$user", user) && !store_get($$store_subs ??= {}, "$isAdmin", isAdmin)) {
    window.location.href = "/";
  }
  currentPath = store_get($$store_subs ??= {}, "$page", page).url.pathname;
  currentPath.split("/")[2] || "dashboard";
  const each_array = ensure_array_like(adminNavItems);
  $$payload.out += `<div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex"><div class="w-64 bg-white dark:bg-gray-800 shadow-md"><div class="p-4 border-b border-gray-200 dark:border-gray-700"><h1 class="text-xl font-semibold text-gray-800 dark:text-white">Admin Portal</h1></div> <nav class="mt-4"><ul><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let item = each_array[$$index];
    $$payload.out += `<li class="mb-1"><a${attr("href", item.href)}${attr_class(`flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${stringify(currentPath === item.href || item.href !== "/admin" && currentPath.startsWith(item.href) ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 border-r-4 border-indigo-500" : "")}`)}><i${attr_class(`fas ${stringify(item.icon)} w-5 mr-3`)}></i> ${escape_html(item.name)}</a></li>`;
  }
  $$payload.out += `<!--]--></ul></nav> <div class="p-4 border-t border-gray-200 dark:border-gray-700 mt-auto"><a href="/" class="flex items-center text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"><i class="fas fa-arrow-left mr-2"></i> Return to Site</a></div></div> <div class="flex-1 overflow-auto"><!---->`;
  slot($$payload, $$props, "default", {});
  $$payload.out += `<!----></div></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _layout as default
};
//# sourceMappingURL=_layout.svelte.js.map
