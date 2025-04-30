import { C as store_get, E as ensure_array_like, O as head, I as attr, G as attr_class, F as escape_html, J as stringify, K as unsubscribe_stores, B as pop, z as push } from "../../../../chunks/index.js";
import { a as todos } from "../../../../chunks/pipStores.js";
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let allTodos, selectedTask, filteredTodos;
  let selectedId = null;
  let newTask = {
    text: ""
  };
  let filterTag = "";
  let draggingId = null;
  let dragOverId = null;
  allTodos = store_get($$store_subs ??= {}, "$todos", todos);
  selectedTask = allTodos.find((t) => t.id === selectedId) || null;
  filteredTodos = allTodos.filter((task) => {
    return true;
  });
  const each_array = ensure_array_like(filteredTodos);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Tasks | LearnFlow</title>`;
  });
  $$payload.out += `<div class="flex flex-col md:flex-row h-[70vh] max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden mt-10 border border-gray-200 dark:border-gray-800"><div class="w-full md:w-1/3 border-r border-gray-100 dark:border-gray-800 bg-gradient-to-b from-indigo-50/80 dark:from-indigo-900/40 to-white dark:to-gray-900 p-6 overflow-y-auto relative"><h2 class="text-xl font-bold mb-4 text-indigo-700 dark:text-indigo-200 flex items-center"><i class="fas fa-list-check mr-2"></i> Tasks</h2> <div class="mb-4 flex flex-col gap-2"><input class="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-2 mb-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition" placeholder="Task name..."${attr("value", newTask.text)}> <button class="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow transition mb-2"><i class="fas fa-plus mr-1"></i> Add Task</button> <div class="flex gap-2 mt-2"><input class="flex-1 rounded border border-gray-300 dark:border-gray-600 p-1 text-xs bg-white dark:bg-gray-800" placeholder="Filter by tag..."${attr("value", filterTag)}> <select class="rounded border border-gray-300 dark:border-gray-600 p-1 text-xs bg-white dark:bg-gray-800"><option value="all">All</option><option value="1">Low</option><option value="2">Medium-Low</option><option value="3">Medium</option><option value="4">High</option><option value="5">Critical</option></select></div></div> <ul class="space-y-1"><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let task = each_array[$$index];
    $$payload.out += `<li${attr_class("mb-1", void 0, {
      "opacity-50": draggingId === task.id,
      "ring-2": dragOverId === task.id && draggingId !== task.id,
      "ring-indigo-400": dragOverId === task.id && draggingId !== task.id
    })} draggable=""><button${attr_class(`w-full text-left px-3 py-2 rounded-lg transition font-medium flex items-center justify-between group shadow-sm ${stringify(selectedId === task.id ? "bg-indigo-100 dark:bg-indigo-700 text-indigo-800 dark:text-indigo-100 ring-2 ring-indigo-400" : "hover:bg-indigo-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200")}`)}><span class="truncate flex-1">${escape_html(task.text)}</span> `;
    if (task.completed) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<i class="fas fa-check-circle text-green-500 ml-2"></i>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> `;
    if (task.emergency && task.emergency >= 4) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<span class="ml-2 px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 animate-pulse">!</span>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></button></li>`;
  }
  $$payload.out += `<!--]--></ul> `;
  if (filteredTodos.length === 0) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="flex flex-col items-center mt-16 text-indigo-300 dark:text-indigo-700 animate-fade-in svelte-174qopp"><i class="fas fa-inbox text-4xl mb-2"></i> <p class="text-base font-medium">No tasks match your filter.</p></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <button class="md:hidden fixed bottom-8 right-8 z-40 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg p-4 transition" aria-label="Add Task"><i class="fas fa-plus text-xl"></i></button></div> <div class="flex-1 p-8 flex flex-col justify-center bg-gradient-to-b from-white dark:from-gray-900 to-indigo-50/60 dark:to-indigo-950">`;
  if (selectedTask) {
    $$payload.out += "<!--[-->";
    {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<div><div class="flex items-center justify-between mb-2"><h3 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center">${escape_html(selectedTask.text)} `;
      if (selectedTask.tag) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<span class="ml-3 px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-700">${escape_html(selectedTask.tag)}</span>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--></h3> <div class="flex space-x-2"><button class="px-3 py-1 bg-yellow-400 text-white rounded-lg font-semibold hover:bg-yellow-500 transition shadow"><i class="fas fa-edit"></i></button> <button class="px-3 py-1 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition shadow"><i class="fas fa-trash"></i></button></div></div> <div class="mb-4 text-gray-700 dark:text-gray-200"><div class="mb-2 flex items-center"><span class="font-semibold mr-2">Description:</span> `;
      if (selectedTask.description) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<span>${escape_html(selectedTask.description)}</span>`;
      } else {
        $$payload.out += "<!--[!-->";
        $$payload.out += `<span class="italic text-gray-400">No description</span>`;
      }
      $$payload.out += `<!--]--></div> <div class="mb-2 flex items-center"><span class="font-semibold mr-2">Deadline:</span> `;
      if (selectedTask.deadline) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<span class="inline-flex items-center px-2 py-0.5 rounded bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-200 font-semibold text-xs border border-pink-200 dark:border-pink-800"><i class="fas fa-calendar-day mr-1"></i> ${escape_html(new Date(selectedTask.deadline).toLocaleDateString())}</span>`;
      } else {
        $$payload.out += "<!--[!-->";
        $$payload.out += `<span class="italic text-gray-400">No deadline</span>`;
      }
      $$payload.out += `<!--]--></div> <div class="mb-2 flex items-center"><span class="font-semibold mr-2">Emergency:</span> <span class="inline-flex items-center px-2 py-0.5 rounded bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 font-bold text-xs border border-red-200 dark:border-red-800">${escape_html(selectedTask.emergency || 3)} / 5</span></div></div> <div class="flex items-center space-x-2 mt-4"><span class="text-sm text-gray-500">Created: ${escape_html(new Date(selectedTask.createdAt).toLocaleString())}</span> `;
      if (selectedTask.completed) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<span class="ml-2 px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Completed</span>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--></div></div>`;
    }
    $$payload.out += `<!--]-->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div class="flex flex-col items-center justify-center h-full text-indigo-200 dark:text-indigo-800 animate-fade-in svelte-174qopp"><i class="fas fa-tasks text-5xl mb-4"></i> <div class="text-lg font-semibold">Select a task to see details</div></div>`;
  }
  $$payload.out += `<!--]--></div></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
