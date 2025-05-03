import { e as ensure_array_like, b as attr, c as store_get, d as attr_class, f as escape_html, u as unsubscribe_stores, a as pop, p as push, g as bind_props, h as head, i as slot } from "../../chunks/index3.js";
import { w as writable } from "../../chunks/index2.js";
import { o as onDestroy } from "../../chunks/index-server.js";
import "../../chunks/client.js";
import { i as isAuthenticated, l as loading, u as user } from "../../chunks/authStore.js";
import { p as pipVisible } from "../../chunks/pipStores.js";
import "firebase/auth";
import { y as fallback } from "../../chunks/utils.js";
import "clsx";
import "marked";
import { h as html } from "../../chunks/html.js";
const sidebarCollapsed = writable(false);
function Sidebar($$payload, $$props) {
  push();
  var $$store_subs;
  const navigation = [
    {
      title: "Main",
      items: [
        {
          name: "Dashboard",
          href: "/",
          icon: "fa-home",
          authRequired: false
        },
        {
          name: "Courses",
          href: "/courses",
          icon: "fa-book",
          authRequired: false
        },
        {
          name: "Exercises",
          href: "/exercises",
          icon: "fa-pencil-alt",
          authRequired: false
        },
        {
          name: "My Learning",
          href: "/my-learning",
          icon: "fa-graduation-cap",
          authRequired: true
        },
        {
          name: "Statistics",
          href: "/statistics",
          icon: "fa-chart-line",
          authRequired: true
        },
        {
          name: "Calendar",
          href: "/calendar",
          icon: "fa-calendar",
          authRequired: true
        }
      ]
    },
    {
      title: "Community",
      items: [
        {
          name: "Discussion Forums",
          href: "/forums",
          icon: "fa-comments",
          authRequired: false
        },
        {
          name: "User Groups",
          href: "/groups",
          icon: "fa-users",
          authRequired: true
        },
        {
          name: "Events",
          href: "/events",
          icon: "fa-calendar-alt",
          authRequired: false
        }
      ]
    },
    {
      title: "Resources",
      items: [
        {
          name: "Help Center",
          href: "/help",
          icon: "fa-question-circle",
          authRequired: false
        },
        {
          name: "Contact Support",
          href: "/support",
          icon: "fa-headset",
          authRequired: false
        }
      ]
    },
    {
      title: "Tools",
      items: [
        {
          name: "Workspace",
          href: "/tools/workspace",
          icon: "fa-tools",
          authRequired: false
        },
        {
          name: "Notepad",
          href: "/tools/notepad",
          icon: "fa-sticky-note",
          authRequired: false
        },
        {
          name: "Tasks",
          href: "/tools/tasks",
          icon: "fa-list-check",
          authRequired: false
        },
        {
          name: "AI Study Chat",
          href: "/tools/chat",
          icon: "fa-robot",
          authRequired: false
        }
      ]
    }
  ];
  let mobileMenuOpen = false;
  let path = "";
  let expanded = {};
  onDestroy(() => {
  });
  function isActive(href) {
    return path === href || path.startsWith(href + "/");
  }
  const each_array = ensure_array_like(navigation);
  $$payload.out += `<div class="lg:hidden fixed top-4 left-4 z-50"><button class="p-2 rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-200 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" aria-label="Toggle menu"${attr("aria-expanded", mobileMenuOpen)}><i class="fas fa-bars"></i></button></div> `;
  if (store_get($$store_subs ??= {}, "$sidebarCollapsed", sidebarCollapsed)) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="fixed top-4 left-4 z-50 hidden lg:block"><button class="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 shadow focus:outline-none focus:ring" aria-label="Expand sidebar"><i class="fas fa-angle-right"></i></button></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <nav id="sidebar"${attr_class("sidebar w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 fixed h-full z-30 flex flex-col transform transition-transform duration-300 ease-in-out -translate-x-full", void 0, {
    "translate-x-0": mobileMenuOpen,
    "lg:translate-x-0": !store_get($$store_subs ??= {}, "$sidebarCollapsed", sidebarCollapsed),
    "lg:-translate-x-full": store_get($$store_subs ??= {}, "$sidebarCollapsed", sidebarCollapsed)
  })} aria-label="Main navigation"><button class="absolute top-4 right-4 hidden lg:block p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring"${attr("aria-label", store_get($$store_subs ??= {}, "$sidebarCollapsed", sidebarCollapsed) ? "Expand sidebar" : "Collapse sidebar")}><i${attr_class(`fas ${store_get($$store_subs ??= {}, "$sidebarCollapsed", sidebarCollapsed) ? "fa-angle-right" : "fa-angle-left"}`, "svelte-1ksxz3v")}></i></button> <div class="p-4 flex items-center"><div class="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center mr-3"><i class="fas fa-graduation-cap text-white"></i></div> <h1 class="text-xl font-bold text-gray-800 dark:text-indigo-300">LearnFlow</h1></div> <div class="flex-1 overflow-y-auto px-2"><!--[-->`;
  for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
    let category = each_array[$$index_1];
    $$payload.out += `<div class="mb-4"><button class="w-full flex justify-between items-center px-3 py-2 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-md"${attr("aria-expanded", expanded[category.title] || false)}${attr("aria-controls", `category-${category.title.toLowerCase().replace(/\s+/g, "-")}`)}><span>${escape_html(category.title)}</span> <i${attr_class(`fas ${expanded[category.title] ? "fa-chevron-down text-gray-400" : "fa-chevron-right text-gray-600"}`, "svelte-1ksxz3v")}></i></button> `;
    if (expanded[category.title]) {
      $$payload.out += "<!--[-->";
      const each_array_1 = ensure_array_like(category.items);
      $$payload.out += `<ul${attr("id", `category-${category.title.toLowerCase().replace(/\s+/g, "-")}`)} class="mt-2 space-y-1" role="menu"><!--[-->`;
      for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
        let item = each_array_1[$$index];
        if (!item.authRequired || store_get($$store_subs ??= {}, "$isAuthenticated", isAuthenticated)) {
          $$payload.out += "<!--[-->";
          $$payload.out += `<li role="none"><a${attr("href", item.href)} data-sveltekit-preload-data="hover"${attr("aria-current", isActive(item.href) ? "page" : void 0)}${attr_class(`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out ${isActive(item.href) ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-700 dark:text-indigo-100" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"}`, "svelte-1ksxz3v")} role="menuitem"><i${attr_class(`fas ${item.icon} mr-3 w-5 text-center`, "svelte-1ksxz3v")} aria-hidden="true"></i> <span>${escape_html(item.name)}</span></a></li>`;
        } else {
          $$payload.out += "<!--[!-->";
        }
        $$payload.out += `<!--]-->`;
      }
      $$payload.out += `<!--]--></ul>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></div>`;
  }
  $$payload.out += `<!--]--></div> <div class="p-4 border-t border-gray-200 dark:border-gray-700">`;
  {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center"><p class="text-sm text-gray-600 dark:text-gray-300 mb-3">Log in to track your progress and access personalized features.</p> <button class="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-700 rounded-md text-sm font-medium text-white transition duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" aria-label="Log in or sign up">Log In / Sign Up</button></div>`;
  }
  $$payload.out += `<!--]--></div></nav>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function Header($$payload, $$props) {
  push();
  var $$store_subs;
  let onTogglePip = fallback($$props["onTogglePip"], () => pipVisible.update((v) => !v));
  let searchQuery = "";
  $$payload.out += `<header class="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40"><div class="max-w-full mx-auto px-4 py-3 sm:px-6 lg:px-8 flex justify-between items-center"><div class="flex items-center"><a href="/" class="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400"><i class="fas fa-graduation-cap text-2xl"></i> <span class="font-bold text-xl hidden sm:inline">LearnFlow</span></a> <nav class="ml-6 hidden md:flex space-x-4"><a href="/courses" class="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Courses</a> <a href="/exercises" class="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Exercises</a> <a href="/forums" class="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Forums</a> `;
  if (store_get($$store_subs ??= {}, "$isAuthenticated", isAuthenticated)) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<a href="/my-learning" class="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">My Learning</a>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></nav></div> <div class="flex-1 relative max-w-lg mx-auto px-4"><form class="relative"><div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><i class="fas fa-search text-gray-400"></i></div> <input type="text"${attr("value", searchQuery)} class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Search courses, exercises..."> <button type="submit" class="absolute inset-y-0 right-0 pr-3 flex items-center" aria-label="Search"><i class="fas fa-arrow-right text-gray-400 hover:text-indigo-500"></i></button></form></div> <div class="ml-4 flex items-center space-x-3"><button class="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" aria-label="Show notifications"><i class="fas fa-bell"></i></button> <button id="pipToggle" class="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" aria-label="Toggle learning tools widget"><i class="fas fa-puzzle-piece"></i></button> `;
  if (store_get($$store_subs ??= {}, "$loading", loading)) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>`;
  } else if (store_get($$store_subs ??= {}, "$isAuthenticated", isAuthenticated) && store_get($$store_subs ??= {}, "$user", user)) {
    $$payload.out += "<!--[1-->";
    $$payload.out += `<div class="flex items-center space-x-3"><div class="relative group"><button class="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-medium hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">${escape_html(store_get($$store_subs ??= {}, "$user", user).displayName?.charAt(0).toUpperCase() ?? store_get($$store_subs ??= {}, "$user", user).email?.charAt(0).toUpperCase() ?? "U")}</button> <div class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 hidden group-hover:block"><a href="/settings" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Profile Settings</a> <a href="/my-learning" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">My Learning</a> <button class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Log out</button></div></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<button class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">Log in</button>`;
  }
  $$payload.out += `<!--]--></div></div></header>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { onTogglePip });
  pop();
}
function PipWidget($$payload, $$props) {
  push();
  onDestroy(() => {
    return;
  });
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  pop();
}
const courseModalOpen = writable(false);
const currentCourse = writable(null);
function CourseModal($$payload, $$props) {
  push();
  var $$store_subs;
  let markdownContent = fallback(
    $$props["markdownContent"],
    () => `
# JavaScript Closures

A closure is a combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment).

## Understanding Closures

In JavaScript, closures are created every time a function is created, at function creation time.

\`\`\`javascript
function outer() {
  const outerVar = 'I am outside!';
  
  function inner() {
    console.log(outerVar); // Accesses outerVar from the outer function's scope
  }
  
  return inner;
}

const myInner = outer();
myInner(); // Logs: "I am outside!"
\`\`\`

## Practical Uses of Closures

### Data Privacy
Closures can be used to create private variables.

\`\`\`javascript
function createCounter() {
  let count = 0;
  
  return {
    increment: function() { count++; },
    getCount: function() { return count; }
  };
}

const counter = createCounter();
counter.increment();
console.log(counter.getCount()); // 1
console.log(counter.count); // undefined (private)
\`\`\`

### Function Factories
Create specialized functions based on parameters.

\`\`\`javascript
function multiplyBy(factor) {
  return function(number) {
    return number * factor;
  };
}

const double = multiplyBy(2);
console.log(double(5)); // 10
\`\`\`

## Exercise

Create a closure that implements a simple bank account with:
- \`deposit(amount)\` method
- \`withdraw(amount)\` method
- \`getBalance()\` method

The balance should be private and only accessible through these methods.
`,
    true
  );
  let renderedContent = "";
  if (store_get($$store_subs ??= {}, "$courseModalOpen", courseModalOpen)) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true"><div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"><div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div> <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span> <div class="inline-block align-bottom bg-gray-800 text-gray-100 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full squircle border border-orange-500"><div class="bg-gray-800 px-6 py-4"><div class="flex justify-between items-center border-b border-gray-700 pb-4"><h3 class="text-lg font-medium text-gray-100">${escape_html(store_get($$store_subs ??= {}, "$currentCourse", currentCourse)?.title || "Course Content")}</h3> <button class="text-gray-400 hover:text-gray-200" aria-label="Close modal"><i class="fas fa-times"></i></button></div> <div class="markdown-content py-4">${html(renderedContent)}</div> <div class="border-t border-gray-700 pt-4 flex justify-between"><button class="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600">Previous</button> <button class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Next Lesson</button></div></div></div></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { markdownContent });
  pop();
}
function Footer($$payload, $$props) {
  push();
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  $$payload.out += `<footer class="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-inner py-4 mt-12"><div class="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">© ${escape_html(currentYear)} LearnFlow. All rights reserved.</div></footer>`;
  pop();
}
function _layout($$payload, $$props) {
  push();
  let collapsed = false;
  sidebarCollapsed.subscribe((v) => collapsed = v);
  let data = $$props["data"];
  function togglePip() {
    pipVisible.update((v) => !v);
  }
  head($$payload, ($$payload2) => {
    $$payload2.out += `<meta name="csrf-token"${attr("content", data.csrfToken)}> <link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/webfonts/fa-solid-900.woff2" as="font" type="font/woff2" crossorigin="anonymous"> <link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/webfonts/fa-regular-400.woff2" as="font" type="font/woff2" crossorigin="anonymous"> <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer"> <link rel="preconnect" href="https://fonts.googleapis.com"> <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous"> <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet">`;
  });
  $$payload.out += `<div class="min-h-screen flex">`;
  Sidebar($$payload);
  $$payload.out += `<!----> <div${attr_class(`flex-1 transition-all duration-300 ${collapsed ? "lg:ml-0" : "lg:ml-64"}`)}>`;
  Header($$payload, { onTogglePip: togglePip });
  $$payload.out += `<!----> <main><!---->`;
  slot($$payload, $$props, "default", {});
  $$payload.out += `<!----></main> `;
  Footer($$payload);
  $$payload.out += `<!----></div> `;
  PipWidget($$payload);
  $$payload.out += `<!----> `;
  CourseModal($$payload, {});
  $$payload.out += `<!----></div>`;
  bind_props($$props, { data });
  pop();
}
export {
  _layout as default
};
//# sourceMappingURL=_layout.svelte.js.map
