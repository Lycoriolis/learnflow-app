import { C as store_get, E as ensure_array_like, F as escape_html, G as attr_class, I as attr, J as stringify, K as unsubscribe_stores, B as pop, z as push, M as bind_props, N as fallback, O as head, P as slot } from "../../chunks/index.js";
/* empty css                      */
import { p as page } from "../../chunks/stores.js";
import { i as isAuthenticated, l as loading, u as user } from "../../chunks/authStore.js";
import "firebase/auth";
import "../../chunks/client.js";
import { p as pipVisible, t as timerState, a as todos, n as notes, c as calcDisplay, b as activeTool } from "../../chunks/pipStores.js";
import "clsx";
import { o as onDestroy } from "../../chunks/index-server.js";
import { p as persistentStore } from "../../chunks/persistentStore.js";
import { w as writable } from "../../chunks/index3.js";
import "marked";
import { h as html } from "../../chunks/html.js";
function Sidebar($$payload, $$props) {
  push();
  var $$store_subs;
  let path;
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
  let expanded = {};
  path = store_get($$store_subs ??= {}, "$page", page).url.pathname;
  const each_array = ensure_array_like(navigation);
  $$payload.out += `<div class="lg:hidden fixed top-4 left-4 z-50"><button id="mobileMenuBtn" class="p-2 rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-200 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" aria-label="Toggle mobile menu"><i class="fas fa-bars"></i></button></div> <div id="sidebar" class="sidebar w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-lg fixed h-full z-30 transform -translate-x-full lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col svelte-8ikiii"><div class="p-4"><div class="flex items-center mb-6 pt-2 pb-4 border-b border-gray-200 dark:border-gray-700"><div class="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center mr-3"><i class="fas fa-graduation-cap text-white"></i></div> <h1 class="text-xl font-bold text-gray-800 dark:text-indigo-300">LearnFlow</h1></div></div> <div class="flex-1 overflow-y-auto px-4"><!--[-->`;
  for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
    let category = each_array[$$index_1];
    $$payload.out += `<div class="mb-4"><button class="w-full flex justify-between items-center px-3 py-2 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider focus:outline-none"><span>${escape_html(category.title)}</span> <i${attr_class(`fas fa-chevron-${expanded[category.title] ? "down" : "right"} text-sm transition-transform duration-200`, "svelte-8ikiii")}></i></button> `;
    if (expanded[category.title]) {
      $$payload.out += "<!--[-->";
      const each_array_1 = ensure_array_like(category.items);
      $$payload.out += `<ul class="mt-2 space-y-1"><!--[-->`;
      for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
        let item = each_array_1[$$index];
        if (!item.authRequired || store_get($$store_subs ??= {}, "$isAuthenticated", isAuthenticated)) {
          $$payload.out += "<!--[-->";
          $$payload.out += `<li><a${attr("href", item.href)}${attr_class(`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out ${stringify(path === item.href ? "bg-indigo-100 dark:bg-indigo-700 text-indigo-700 dark:text-indigo-100" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100")}`)}><i${attr_class(`fas ${stringify(item.icon)} mr-3 w-5 text-center`, "svelte-8ikiii")}></i> <span>${escape_html(item.name)}</span></a></li>`;
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
  if (store_get($$store_subs ??= {}, "$loading", loading)) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse"><div class="flex items-center mb-2"><div class="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 mr-2"></div> <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div></div> <div class="h-8 bg-gray-300 dark:bg-gray-600 rounded w-full"></div></div>`;
  } else if (store_get($$store_subs ??= {}, "$isAuthenticated", isAuthenticated) && store_get($$store_subs ??= {}, "$user", user)) {
    $$payload.out += "<!--[1-->";
    $$payload.out += `<div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg"><div class="flex items-center mb-3"><div class="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center mr-2 text-white text-sm font-medium">${escape_html(store_get($$store_subs ??= {}, "$user", user).displayName?.charAt(0).toUpperCase() ?? store_get($$store_subs ??= {}, "$user", user).email?.charAt(0).toUpperCase() ?? "U")}</div> <span class="font-medium text-sm text-gray-800 dark:text-gray-100 truncate">${escape_html(store_get($$store_subs ??= {}, "$user", user).displayName ?? store_get($$store_subs ??= {}, "$user", user).email ?? "User")}</span></div> <a href="/settings" class="w-full py-2 px-3 bg-gray-200 dark:bg-gray-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 block text-center transition duration-150">Account Settings</a></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center"><p class="text-sm text-gray-600 dark:text-gray-300 mb-3">Log in to track your progress and access personalized features.</p> <button class="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-700 rounded-md text-sm font-medium text-white transition duration-150">Log In / Sign Up</button></div>`;
  }
  $$payload.out += `<!--]--></div></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function Header($$payload, $$props) {
  push();
  var $$store_subs;
  let onTogglePip = fallback($$props["onTogglePip"], () => pipVisible.update((v) => !v));
  $$payload.out += `<header class="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40"><div class="max-w-full mx-auto px-4 py-3 sm:px-6 lg:px-8 flex justify-between items-center"><div class="flex-1"><div class="relative max-w-lg"><div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><i class="fas fa-search text-gray-400"></i></div> <input type="text" class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Search courses, exercises..."></div></div> <div class="ml-4 flex items-center space-x-3"><button class="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" aria-label="Show notifications"><i class="fas fa-bell"></i></button> <button id="pipToggle" class="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" aria-label="Toggle learning tools widget"><i class="fas fa-puzzle-piece"></i></button> `;
  if (store_get($$store_subs ??= {}, "$loading", loading)) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>`;
  } else if (store_get($$store_subs ??= {}, "$isAuthenticated", isAuthenticated) && store_get($$store_subs ??= {}, "$user", user)) {
    $$payload.out += "<!--[1-->";
    $$payload.out += `<div class="flex items-center space-x-3"><div class="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-medium">${escape_html(store_get($$store_subs ??= {}, "$user", user).displayName?.charAt(0).toUpperCase() ?? store_get($$store_subs ??= {}, "$user", user).email?.charAt(0).toUpperCase() ?? "U")}</div> <button class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">Log out</button></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<button class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">Log in</button>`;
  }
  $$payload.out += `<!--]--></div></div></header>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { onTogglePip });
  pop();
}
function PipTimer($$payload, $$props) {
  push();
  var $$store_subs;
  let formattedTime;
  function pauseTimer() {
    timerState.update((state) => ({ ...state, isRunning: false }));
  }
  onDestroy(() => {
    pauseTimer();
  });
  formattedTime = (() => {
    const minutes = Math.floor(store_get($$store_subs ??= {}, "$timerState", timerState).timeLeft / 60);
    const seconds = store_get($$store_subs ??= {}, "$timerState", timerState).timeLeft % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  })();
  $$payload.out += `<div class="text-center p-2 bg-gray-700 rounded-lg"><div class="text-xs font-medium text-indigo-300 uppercase mb-1">${escape_html(store_get($$store_subs ??= {}, "$timerState", timerState).mode.replace("B", " B"))}</div> <div class="text-3xl font-bold mb-3 text-gray-100 tracking-wider">${escape_html(formattedTime)}</div> <div class="flex justify-center space-x-2">`;
  if (!store_get($$store_subs ??= {}, "$timerState", timerState).isRunning) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<button class="px-4 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm font-medium transition duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-400">Start</button>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<button class="px-4 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm font-medium transition duration-150 focus:outline-none focus:ring-2 focus:ring-yellow-400">Pause</button>`;
  }
  $$payload.out += `<!--]--> <button class="px-4 py-1 bg-gray-600 text-gray-200 hover:bg-gray-500 rounded text-sm transition duration-150 focus:outline-none focus:ring-2 focus:ring-gray-400">Reset</button></div></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function PipTodo($$payload, $$props) {
  push();
  var $$store_subs;
  let newTodoText = "";
  $$payload.out += `<div class="bg-gray-700 p-2 rounded-lg"><h4 class="text-xs font-medium text-green-300 uppercase mb-2">Todo List</h4> <div class="flex mb-2"><input type="text"${attr("value", newTodoText)} placeholder="Add a new task..." class="flex-1 text-sm bg-gray-600 text-gray-100 border border-gray-500 rounded-l-md p-2 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 placeholder-gray-400"> <button class="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-r-md text-sm font-medium transition duration-150 focus:outline-none focus:ring-2 focus:ring-green-400">Add</button></div> `;
  if (store_get($$store_subs ??= {}, "$todos", todos).length > 0) {
    $$payload.out += "<!--[-->";
    const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$todos", todos).sort((a, b) => a.createdAt - b.createdAt));
    $$payload.out += `<ul class="space-y-1 max-h-40 overflow-y-auto pr-1"><!--[-->`;
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let todo = each_array[$$index];
      $$payload.out += `<li class="flex items-center text-sm p-1.5 bg-gray-600 rounded-md group"><input type="checkbox"${attr("checked", todo.completed, true)} class="mr-2 h-4 w-4 form-checkbox bg-gray-500 border-gray-400 text-green-500 focus:ring-green-400 focus:ring-offset-gray-600 rounded"${attr("aria-labelledby", `todo-text-${stringify(todo.id)}`)}> <span${attr("id", `todo-text-${stringify(todo.id)}`)}${attr_class(`flex-1 ${stringify(todo.completed ? "line-through text-gray-400" : "text-gray-100")}`)}>${escape_html(todo.text)}</span> <button class="ml-2 px-1 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150 focus:outline-none" aria-label="Delete task"><i class="fas fa-trash-alt fa-xs"></i></button></li>`;
    }
    $$payload.out += `<!--]--></ul>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<p class="text-gray-400 text-xs italic text-center py-2">No tasks yet. Add one above!</p>`;
  }
  $$payload.out += `<!--]--></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function PipNotes($$payload, $$props) {
  push();
  var $$store_subs;
  $$payload.out += `<div class="bg-gray-700 p-2 rounded-lg"><div class="flex justify-between items-center mb-2"><h4 class="text-xs font-medium text-blue-300 uppercase">Quick Notes</h4> `;
  {
    $$payload.out += "<!--[-->";
    $$payload.out += `<button class="px-2 py-0.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400">+ New</button>`;
  }
  $$payload.out += `<!--]--></div> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  if (store_get($$store_subs ??= {}, "$notes", notes).length > 0 && true) {
    $$payload.out += "<!--[-->";
    const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$notes", notes).sort((a, b) => b.updatedAt - a.updatedAt));
    $$payload.out += `<ul class="space-y-1 max-h-40 overflow-y-auto pr-1 mt-2"><!--[-->`;
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let note = each_array[$$index];
      $$payload.out += `<li class="group flex justify-between items-center text-sm p-1.5 bg-gray-600 hover:bg-gray-500 transition duration-150 rounded-md cursor-pointer"${attr("title", note.content.substring(0, 100) + (note.content.length > 100 ? "..." : ""))}><span class="text-gray-100 truncate pr-2">${escape_html(note.title)}</span> <button class="ml-2 px-1 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150 focus:outline-none" aria-label="Delete note"><i class="fas fa-trash-alt fa-xs"></i></button></li>`;
    }
    $$payload.out += `<!--]--></ul>`;
  } else {
    $$payload.out += "<!--[1-->";
    $$payload.out += `<p class="text-gray-400 text-xs italic text-center py-2">No notes yet. Click '+ New' to add one.</p>`;
  }
  $$payload.out += `<!--]--></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function PipCalculator($$payload, $$props) {
  push();
  var $$store_subs;
  const each_array = ensure_array_like([
    "AC",
    "+/-",
    "%",
    "/",
    "7",
    "8",
    "9",
    "*",
    "4",
    "5",
    "6",
    "-",
    "1",
    "2",
    "3",
    "+",
    "0",
    ".",
    "="
  ]);
  $$payload.out += `<div class="bg-gray-700 p-2 rounded-lg"><h4 class="text-xs font-medium text-purple-300 uppercase mb-2">Calculator</h4> <input type="text" class="w-full text-right mb-2 px-2 py-1 border-0 focus:ring-0 text-xl font-mono bg-gray-800 text-gray-100 rounded-md"${attr("value", store_get($$store_subs ??= {}, "$calcDisplay", calcDisplay))} readonly> <div class="grid grid-cols-4 gap-1"><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let key = each_array[$$index];
    const isOperator = ["/", "*", "-", "+", "="].includes(key);
    const isZero = key === "0";
    const isClear = key === "AC";
    $$payload.out += `<button${attr_class(`p-2 rounded text-sm font-medium transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-gray-700 ${stringify(isZero ? "col-span-2" : "")} ${stringify(isOperator ? "bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-400" : "")} ${stringify(isClear ? "bg-red-600 hover:bg-red-700 text-white focus:ring-red-400" : "")} ${stringify(!isOperator && !isClear ? "bg-gray-600 hover:bg-gray-500 text-gray-100 focus:ring-gray-400" : "")}`)}>`;
    if (key === "/") {
      $$payload.out += "<!--[-->";
      $$payload.out += `÷`;
    } else if (key === "*") {
      $$payload.out += "<!--[1-->";
      $$payload.out += `<i class="fas fa-times"></i>`;
    } else if (key === "-") {
      $$payload.out += "<!--[2-->";
      $$payload.out += `<i class="fas fa-minus"></i>`;
    } else if (key === "+") {
      $$payload.out += "<!--[3-->";
      $$payload.out += `<i class="fas fa-plus"></i>`;
    } else if (key === "=") {
      $$payload.out += "<!--[4-->";
      $$payload.out += `<i class="fas fa-equals"></i>`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `${escape_html(key)}`;
    }
    $$payload.out += `<!--]--></button>`;
  }
  $$payload.out += `<!--]--></div></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function PipFlashcards($$payload, $$props) {
  push();
  var $$store_subs;
  const flashcards = persistentStore("learnflow-flashcards", []);
  let currentCard = null;
  let newCardFront = "";
  let newCardBack = "";
  function getNextCard() {
    const now = Date.now();
    const cards = store_get($$store_subs ??= {}, "$flashcards", flashcards).filter((card) => !card.nextReview || card.nextReview <= now);
    if (cards.length === 0) return null;
    return cards[Math.floor(Math.random() * cards.length)];
  }
  if (!currentCard) {
    currentCard = getNextCard();
  }
  $$payload.out += `<div class="bg-gray-700 p-2 rounded-lg"><h4 class="text-xs font-medium text-orange-300 uppercase mb-2">Flashcards</h4> `;
  if (store_get($$store_subs ??= {}, "$flashcards", flashcards).length === 0) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="text-center p-4"><p class="text-gray-300 text-sm mb-4">Create your first flashcard:</p> <div class="space-y-2"><input type="text"${attr("value", newCardFront)} placeholder="Front side..." class="w-full p-2 rounded bg-gray-600 text-gray-100 text-sm border border-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"> <textarea placeholder="Back side..." rows="2" class="w-full p-2 rounded bg-gray-600 text-gray-100 text-sm border border-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500">`;
    const $$body = escape_html(newCardBack);
    if ($$body) {
      $$payload.out += `${$$body}`;
    }
    $$payload.out += `</textarea> <button class="w-full py-2 bg-orange-600 text-white rounded font-medium hover:bg-orange-700 transition">Add Card</button></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    if (currentCard) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div class="p-4"><div class="min-h-[120px] p-4 bg-gray-800 rounded-lg shadow-inner flex items-center justify-center cursor-pointer transition-transform hover:scale-[1.02] select-none"><p class="text-gray-100 text-center">${escape_html(currentCard.front)}</p></div> <div class="flex justify-between mt-4"><button class="px-4 py-2 bg-red-600 text-white rounded font-medium hover:bg-red-700 transition">Again</button> <button class="px-4 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700 transition">Good</button></div></div>`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<div class="text-center p-4"><p class="text-gray-300">No cards due for review!</p></div>`;
    }
    $$payload.out += `<!--]--> <div class="mt-2 border-t border-gray-600 pt-2"><details class="text-sm"><summary class="text-gray-300 cursor-pointer hover:text-gray-100">Add New Card</summary> <div class="mt-2 space-y-2"><input type="text"${attr("value", newCardFront)} placeholder="Front side..." class="w-full p-2 rounded bg-gray-600 text-gray-100 text-sm border border-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"> <textarea placeholder="Back side..." rows="2" class="w-full p-2 rounded bg-gray-600 text-gray-100 text-sm border border-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500">`;
    const $$body_1 = escape_html(newCardBack);
    if ($$body_1) {
      $$payload.out += `${$$body_1}`;
    }
    $$payload.out += `</textarea> <button class="w-full py-2 bg-orange-600 text-white rounded font-medium hover:bg-orange-700 transition">Add Card</button></div></details></div>`;
  }
  $$payload.out += `<!--]--></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function PipDictionary($$payload, $$props) {
  push();
  let searchTerm = "";
  $$payload.out += `<div class="bg-gray-700 p-2 rounded-lg"><h4 class="text-xs font-medium text-cyan-300 uppercase mb-2">Dictionary</h4> <form class="mb-3"><div class="flex gap-2"><input type="text"${attr("value", searchTerm)} placeholder="Enter a word..." class="flex-1 px-3 py-1.5 bg-gray-800 text-gray-100 rounded border border-gray-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"> <button type="submit" class="px-3 py-1.5 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition disabled:opacity-50"${attr("disabled", !searchTerm.trim(), true)}>`;
  {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<i class="fas fa-search"></i>`;
  }
  $$payload.out += `<!--]--></button></div></form> `;
  {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div class="text-center p-4 text-gray-400"><i class="fas fa-book mb-2 text-xl"></i> <p class="text-sm">Search for a word to see its definition</p></div>`;
  }
  $$payload.out += `<!--]--></div>`;
  pop();
}
function PipWidget($$payload, $$props) {
  push();
  var $$store_subs;
  const tools = [
    {
      id: "timer",
      name: "Timer",
      icon: "fa-stopwatch",
      bgClass: "bg-indigo-800",
      textClass: "text-indigo-100",
      hoverClass: "hover:bg-indigo-700"
    },
    {
      id: "todo",
      name: "Todo",
      icon: "fa-list-check",
      bgClass: "bg-green-800",
      textClass: "text-green-100",
      hoverClass: "hover:bg-green-700"
    },
    {
      id: "notes",
      name: "Notes",
      icon: "fa-sticky-note",
      bgClass: "bg-yellow-800",
      textClass: "text-yellow-100",
      hoverClass: "hover:bg-yellow-700"
    },
    {
      id: "calculator",
      name: "Calculator",
      icon: "fa-calculator",
      bgClass: "bg-purple-800",
      textClass: "text-purple-100",
      hoverClass: "hover:bg-purple-700"
    },
    {
      id: "flashcards",
      name: "Flashcards",
      icon: "fa-layer-group",
      bgClass: "bg-orange-800",
      textClass: "text-orange-100",
      hoverClass: "hover:bg-orange-700"
    },
    {
      id: "dictionary",
      name: "Dictionary",
      icon: "fa-book",
      bgClass: "bg-cyan-800",
      textClass: "text-cyan-100",
      hoverClass: "hover:bg-cyan-700"
    }
  ];
  if (store_get($$store_subs ??= {}, "$pipVisible", pipVisible)) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div${attr_class(`pip-widget ${stringify("")} bg-gray-800 text-gray-100 rounded-2xl overflow-hidden shadow-lg fixed bottom-4 right-4 z-50 squircle`, "svelte-17rnckn")} style="position: fixed; bottom: 1rem; right: 1rem; cursor: grab;" role="region" aria-label="Quick Tools Widget"><div class="pip-header bg-indigo-600 text-white p-2 flex justify-between items-center cursor-grab" role="button" tabindex="0" aria-label="Drag quick tools widget"><h3 class="font-medium text-sm pl-2">Quick Tools</h3> <div><button class="p-1 text-indigo-100 hover:bg-indigo-500 rounded-full focus:outline-none focus:ring-2 focus:ring-white"${attr("aria-label", "Minimize widget")}><i${attr_class(`fas ${stringify("fa-window-minimize")} w-3 h-3`)}></i></button> <button class="p-1 text-indigo-100 hover:bg-indigo-500 rounded-full ml-1 focus:outline-none focus:ring-2 focus:ring-white" aria-label="Close widget"><i class="fas fa-times w-3 h-3"></i></button></div></div> `;
    {
      $$payload.out += "<!--[-->";
      const each_array = ensure_array_like(tools);
      $$payload.out += `<div class="p-3 border-b border-gray-700"><div class="grid grid-cols-4 gap-2"><!--[-->`;
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let tool = each_array[$$index];
        $$payload.out += `<button${attr_class(`p-2 ${stringify(tool.bgClass)} rounded-lg ${stringify(tool.textClass)} ${stringify(tool.hoverClass)} flex flex-col items-center text-center transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 ${stringify(store_get($$store_subs ??= {}, "$activeTool", activeTool) === tool.id ? "ring-2 ring-white" : "ring-0")}`, "svelte-17rnckn")}><i${attr_class(`fas ${stringify(tool.icon)} text-base mb-1`, "svelte-17rnckn")}></i> <span class="text-xs font-medium svelte-17rnckn">${escape_html(tool.name)}</span></button>`;
      }
      $$payload.out += `<!--]--></div></div> <div class="p-2 tool-content-area svelte-17rnckn">`;
      if (store_get($$store_subs ??= {}, "$activeTool", activeTool) === "timer") {
        $$payload.out += "<!--[-->";
        PipTimer($$payload);
      } else if (store_get($$store_subs ??= {}, "$activeTool", activeTool) === "todo") {
        $$payload.out += "<!--[1-->";
        PipTodo($$payload);
      } else if (store_get($$store_subs ??= {}, "$activeTool", activeTool) === "notes") {
        $$payload.out += "<!--[2-->";
        PipNotes($$payload);
      } else if (store_get($$store_subs ??= {}, "$activeTool", activeTool) === "calculator") {
        $$payload.out += "<!--[3-->";
        PipCalculator($$payload);
      } else if (store_get($$store_subs ??= {}, "$activeTool", activeTool) === "flashcards") {
        $$payload.out += "<!--[4-->";
        PipFlashcards($$payload);
      } else if (store_get($$store_subs ??= {}, "$activeTool", activeTool) === "dictionary") {
        $$payload.out += "<!--[5-->";
        PipDictionary($$payload);
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--></div>`;
    }
    $$payload.out += `<!--]--></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
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
  let data = $$props["data"];
  function togglePip() {
    pipVisible.update((v) => !v);
  }
  head($$payload, ($$payload2) => {
    $$payload2.out += `<meta name="csrf-token"${attr("content", data.csrfToken)}> <link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/webfonts/fa-solid-900.woff2" as="font" type="font/woff2" crossorigin="anonymous"> <link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/webfonts/fa-regular-400.woff2" as="font" type="font/woff2" crossorigin="anonymous"> <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer"> <link rel="preconnect" href="https://fonts.googleapis.com"> <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous"> <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet">`;
  });
  $$payload.out += `<div class="min-h-screen">`;
  Sidebar($$payload);
  $$payload.out += `<!----> <div class="lg:ml-64">`;
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
