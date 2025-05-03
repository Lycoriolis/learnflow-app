import { h as head, c as store_get, f as escape_html, e as ensure_array_like, b as attr, d as attr_class, m as attr_style, j as stringify, u as unsubscribe_stores, g as bind_props, a as pop, p as push } from "../../../chunks/index3.js";
import { l as loading, i as isAuthenticated } from "../../../chunks/authStore.js";
import "../../../chunks/client.js";
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let enrolledCourses, myCourses, allCourses, suggestion;
  let data = $$props["data"];
  enrolledCourses = data.enrolledCourses || [];
  myCourses = enrolledCourses.filter((c) => c.enrollment.progress > 0 && c.enrollment.progress < 100);
  enrolledCourses.filter((c) => c.enrollment.progress === 100);
  allCourses = enrolledCourses;
  suggestion = allCourses.find((c) => c.enrollment.progress > 0 && c.enrollment.progress < 100);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>My Learning | LearnFlow</title>`;
  });
  if (store_get($$store_subs ??= {}, "$authLoading", loading)) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="flex items-center justify-center min-h-[60vh]"><i class="fas fa-spinner fa-spin text-4xl text-indigo-500"></i></div>`;
  } else if (!store_get($$store_subs ??= {}, "$isAuthenticated", isAuthenticated)) {
    $$payload.out += "<!--[1-->";
    $$payload.out += `<div class="flex flex-col items-center justify-center min-h-[60vh]"><p class="text-xl text-gray-600 dark:text-gray-300 mb-4">Please log in to view your learning progress.</p> <button class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md">Log In</button></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div class="max-w-7xl mx-auto px-4 py-6"><h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">My Learning</h1> `;
    if (data.error) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div class="text-red-500 mb-4">${escape_html(data.error)}</div>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> `;
    if (allCourses.length === 0) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div class="text-center text-gray-600 dark:text-gray-400 py-20"><p>You are not enrolled in any courses yet.</p> <a href="/courses" class="mt-4 inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md">Browse Courses</a></div>`;
    } else {
      $$payload.out += "<!--[!-->";
      const each_array = ensure_array_like(myCourses);
      if (suggestion) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6"><h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Continue Learning</h2> <p class="text-gray-700 dark:text-gray-300">Next: ${escape_html(suggestion.meta.title)}</p> <a${attr("href", suggestion.meta.path ? `/courses?path=${suggestion.meta.path}` : `/courses/${suggestion.meta.id}`)} class="mt-4 inline-block text-indigo-600 hover:underline">Go to Course</a></div>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--> <div class="mb-4 border-b border-gray-200 dark:border-gray-700"><button${attr_class(`py-2 px-4 ${"border-b-2 border-indigo-500 text-indigo-600"}`)}>In Progress</button> <button${attr_class(`py-2 px-4 ${""}`)}>Completed</button> <button${attr_class(`py-2 px-4 ${""}`)}>All</button></div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`;
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let item = each_array[$$index];
        $$payload.out += `<div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex flex-col"><h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">${escape_html(item.meta.title)}</h3> <div class="flex items-center mb-2"><div class="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden"><div class="h-2 bg-indigo-600 dark:bg-indigo-500"${attr_style(`width:${stringify(item.enrollment.progress)}%`)}></div></div> <span class="ml-2 text-sm">${escape_html(item.enrollment.progress)}%</span></div> <a${attr("href", item.meta.path ? `/courses?path=${item.meta.path}` : `/courses/${item.meta.id}`)} class="mt-auto text-indigo-600 hover:underline">View Course</a></div>`;
      }
      $$payload.out += `<!--]--></div>`;
    }
    $$payload.out += `<!--]--></div>`;
  }
  $$payload.out += `<!--]-->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { data });
  pop();
}
export {
  _page as default
};
//# sourceMappingURL=_page.svelte.js.map
