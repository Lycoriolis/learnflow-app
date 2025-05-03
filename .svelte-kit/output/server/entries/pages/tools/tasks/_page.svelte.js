import { c as store_get, e as ensure_array_like, h as head, d as attr_class, b as attr, m as attr_style, f as escape_html, j as stringify, u as unsubscribe_stores, a as pop, p as push } from "../../../../chunks/index3.js";
import { t as todos } from "../../../../chunks/pipStores.js";
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let allTodos, selectedTask, filteredTodos, uniqueTags, completedCount, totalCount, progressPercentage;
  let selectedId = null;
  let searchTerm = "";
  let draggingId = null;
  let dragOverId = null;
  function getEmergencyColor(level) {
    switch (Number(level)) {
      case 1:
        return "bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-300 border-green-200 dark:border-green-800";
      case 2:
        return "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      case 3:
        return "bg-yellow-50 dark:bg-yellow-950 text-yellow-600 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
      case 4:
        return "bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-300 border-orange-200 dark:border-orange-800";
      case 5:
        return "bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-300 border-red-200 dark:border-red-800";
      default:
        return "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700";
    }
  }
  function getEmergencyLabel(level) {
    switch (Number(level)) {
      case 1:
        return "Low";
      case 2:
        return "Medium-Low";
      case 3:
        return "Medium";
      case 4:
        return "High";
      case 5:
        return "Critical";
      default:
        return "None";
    }
  }
  function getTaskStatusClass(task) {
    if (task.completed) {
      return "opacity-75";
    }
    if (task.deadline) {
      const deadlineDate = new Date(task.deadline);
      const today = /* @__PURE__ */ new Date();
      const timeDiff = deadlineDate.getTime() - today.getTime();
      const daysDiff = Math.ceil(timeDiff / (1e3 * 3600 * 24));
      if (daysDiff < 0) {
        return "overdue";
      } else if (daysDiff <= 1) {
        return "due-soon";
      }
    }
    return "";
  }
  function formatDate(dateStr) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    }).format(date);
  }
  function formatRelativeDate(dateStr) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = /* @__PURE__ */ new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? "s" : ""} overdue`;
    } else if (diffDays === 0) {
      return "Due today";
    } else if (diffDays === 1) {
      return "Due tomorrow";
    } else if (diffDays < 7) {
      return `Due in ${diffDays} days`;
    } else {
      return formatDate(dateStr);
    }
  }
  allTodos = store_get($$store_subs ??= {}, "$todos", todos);
  selectedTask = allTodos.find((t) => t.id === selectedId) || null;
  filteredTodos = allTodos.filter((task) => {
    return true;
  }).sort((a, b) => {
    let aVal = a.createdAt;
    let bVal = b.createdAt;
    return bVal - aVal;
  });
  uniqueTags = [
    ...new Set(allTodos.map((t) => t.tag).filter(Boolean))
  ];
  completedCount = allTodos.filter((t) => t.completed).length;
  totalCount = allTodos.length;
  progressPercentage = totalCount > 0 ? Math.round(completedCount / totalCount * 100) : 0;
  const each_array = ensure_array_like(uniqueTags);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Tasks | LearnFlow</title>`;
  });
  $$payload.out += `<div class="flex flex-col md:flex-row h-[85vh] max-w-7xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden mt-6 border border-gray-200 dark:border-gray-800"><div${attr_class(`w-full md:w-2/5 lg:w-1/3 border-r border-gray-200 dark:border-gray-800 bg-gradient-to-br from-indigo-50/80 via-purple-50/50 dark:from-indigo-950/30 dark:via-purple-950/20 to-white dark:to-gray-900 overflow-y-auto relative ${stringify("")}`)}><div class="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 p-5 space-y-5"><div class="flex items-center justify-between"><h2 class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 flex items-center"><i class="fas fa-tasks mr-3"></i> My Tasks</h2> <button class="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50"${attr("aria-label", "Open add task panel")}><i${attr_class(`fas ${stringify("fa-plus")}`)}></i></button></div> <div class="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"><div class="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full relative overflow-hidden"${attr_style(`width: ${stringify(progressPercentage)}%`)}><div class="absolute inset-0 opacity-30 bg-striped svelte-1s0w1ig"></div></div></div> <div class="text-xs text-gray-500 dark:text-gray-400 flex justify-between"><span>${escape_html(completedCount)} of ${escape_html(totalCount)} tasks completed</span> <span class="font-semibold">${escape_html(progressPercentage)}%</span></div> <div class="space-y-3"><div class="relative"><i class="fas fa-search absolute left-3.5 top-3 text-gray-400 dark:text-gray-500"></i> <input class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition text-sm" placeholder="Search tasks..."${attr("value", searchTerm)}></div> <div class="flex flex-wrap gap-2"><select class="text-xs px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 cursor-pointer"><option value="all">All Priorities</option><option value="1">Low</option><option value="2">Medium-Low</option><option value="3">Medium</option><option value="4">High</option><option value="5">Critical</option></select> <select class="text-xs px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 cursor-pointer"><option value="">All Tags</option><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let tag = each_array[$$index];
    $$payload.out += `<option${attr("value", tag)}>${escape_html(tag)}</option>`;
  }
  $$payload.out += `<!--]--></select> <div class="ml-auto flex text-xs gap-1 items-center"><select class="px-2 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 cursor-pointer"><option value="createdAt">Created</option><option value="deadline">Deadline</option><option value="emergency">Priority</option></select> <button class="h-7 w-7 flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md"${attr("title", "Sort Descending")}><i${attr_class(`fas fa-sort-${stringify("down")} text-gray-500`)}></i></button></div></div></div></div> <div class="p-4 space-y-1.5">`;
  if (filteredTodos.length === 0) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="text-center py-10 text-gray-500 dark:text-gray-400 italic">${escape_html("No tasks yet. Create one!")}</div>`;
  } else {
    $$payload.out += "<!--[!-->";
    const each_array_1 = ensure_array_like(filteredTodos);
    $$payload.out += `<!--[-->`;
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let task = each_array_1[$$index_1];
      $$payload.out += `<div role="button" tabindex="0"${attr_class(`bg-white dark:bg-gray-800/90 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-700/50 transition-all cursor-pointer relative overflow-hidden ${stringify(selectedId === task.id ? "border-l-4 border-l-indigo-500 dark:border-l-indigo-400" : "")} ${stringify(getTaskStatusClass(task))} focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-600`, "svelte-1s0w1ig")} draggable="true">`;
      if (draggingId === task.id) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<div class="absolute inset-0 bg-indigo-100 dark:bg-indigo-900/30 z-0"></div>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--> `;
      if (dragOverId === task.id) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<div class="absolute inset-0 border-2 border-dashed border-indigo-300 dark:border-indigo-700 rounded-xl z-0"></div>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--> <div class="p-3 z-10 relative flex items-start gap-3"><div><button${attr_class(`h-5 w-5 rounded-full flex items-center justify-center border ${stringify(task.completed ? "bg-green-100 dark:bg-green-900/30 border-green-400 dark:border-green-600 text-green-600 dark:text-green-400" : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800")}`)}>`;
      if (task.completed) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<i class="fas fa-check text-xs"></i>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--></button></div> <div class="flex-1 min-w-0"><div class="flex justify-between items-start"><h3${attr_class(`font-medium truncate text-sm ${stringify(task.completed ? "line-through text-gray-500 dark:text-gray-400" : "text-gray-900 dark:text-white")}`)}>${escape_html(task.text)}</h3> <span${attr_class(`ml-2 text-xs px-2 py-0.5 rounded-full border ${stringify(getEmergencyColor(task.emergency))} whitespace-nowrap flex-shrink-0`, "svelte-1s0w1ig")}>${escape_html(getEmergencyLabel(task.emergency))}</span></div> <div class="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">`;
      if (task.deadline) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<span${attr_class(`${stringify(task.deadline && new Date(task.deadline) < /* @__PURE__ */ new Date() ? "text-red-500 dark:text-red-400" : "text-gray-500 dark:text-gray-400")} flex items-center`)}><i class="fas fa-calendar-alt mr-1.5"></i> ${escape_html(formatRelativeDate(task.deadline))}</span>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--> `;
      if (task.tag) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<span class="text-gray-500 dark:text-gray-400 flex items-center"><i class="fas fa-tag mr-1.5"></i> ${escape_html(task.tag)}</span>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--></div></div></div> `;
      if (task.deadline && new Date(task.deadline) < /* @__PURE__ */ new Date() && !task.completed) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<div class="absolute top-0 right-0 w-0 h-0 border-solid border-t-[20px] border-t-red-500 border-l-transparent border-l-[20px]"></div>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--></div>`;
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!--]--> `;
  if (completedCount > 0) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="flex justify-center pt-3"><button class="text-xs px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition rounded-md"><i class="fas fa-trash-alt mr-1.5"></i> Clear completed (${escape_html(completedCount)})</button></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div></div> <div class="flex-1 bg-white dark:bg-gray-900 overflow-y-auto">`;
  if (selectedTask) {
    $$payload.out += "<!--[1-->";
    $$payload.out += `<div class="h-full flex flex-col p-6"><div class="flex justify-between items-center mb-6"><div class="flex items-center gap-3"><button class="h-8 w-8 md:hidden flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"><i class="fas fa-arrow-left"></i></button> <h2 class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Task Details</h2></div> <div class="flex gap-2"><button class="h-9 w-9 flex items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-800/30 transition" title="Edit task"><i class="fas fa-edit"></i></button> <button class="h-9 w-9 flex items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-800/30 transition" title="Delete task"><i class="fas fa-trash-alt"></i></button></div></div> `;
    {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<div class="space-y-6 flex-1"><div class="flex items-start gap-4"><button${attr_class(`mt-1 h-6 w-6 rounded-full flex items-center justify-center border ${stringify(selectedTask.completed ? "bg-green-100 dark:bg-green-900/30 border-green-400 dark:border-green-600 text-green-600 dark:text-green-400" : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800")}`)}>`;
      if (selectedTask.completed) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<i class="fas fa-check text-xs"></i>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--></button> <div class="flex-1"><h3${attr_class(`text-xl font-semibold ${stringify(selectedTask.completed ? "line-through text-gray-500 dark:text-gray-400" : "text-gray-900 dark:text-white")}`)}>${escape_html(selectedTask.text)}</h3></div></div> <div class="flex flex-wrap gap-3 pt-2"><span${attr_class(`text-sm px-3 py-1 rounded-lg ${stringify(getEmergencyColor(selectedTask.emergency))}`, "svelte-1s0w1ig")}><i class="fas fa-flag mr-1.5"></i> ${escape_html(getEmergencyLabel(selectedTask.emergency))}</span> `;
      if (selectedTask.deadline) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<span${attr_class(`text-sm px-3 py-1 rounded-lg ${stringify(new Date(selectedTask.deadline) < /* @__PURE__ */ new Date() && !selectedTask.completed ? "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700")}`)}><i class="fas fa-calendar-alt mr-1.5"></i> ${escape_html(formatRelativeDate(selectedTask.deadline))}</span>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--> `;
      if (selectedTask.tag) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<span class="text-sm px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"><i class="fas fa-tag mr-1.5"></i> ${escape_html(selectedTask.tag)}</span>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--> <span class="text-sm px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"><i class="fas fa-clock mr-1.5"></i> Created ${escape_html(new Date(selectedTask.createdAt).toLocaleDateString())}</span></div> <div class="pt-6"><h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</h4> <div class="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/80 min-h-[200px] text-gray-700 dark:text-gray-300 whitespace-pre-line">${escape_html(selectedTask.description || "No description provided.")}</div></div></div>`;
    }
    $$payload.out += `<!--]--></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div class="h-full flex flex-col items-center justify-center p-6 text-center"><img src="https://illustrations.popsy.co/gray/task-list.svg" alt="No task selected" class="w-64 h-64 mb-6 opacity-70"> <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Task Selected</h3> <p class="text-gray-500 dark:text-gray-400 max-w-md mb-6">Select a task from the list to view details or click the + button to create a new task.</p> <button class="py-2.5 px-5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-md transition transform hover:translate-y-[-1px]"><i class="fas fa-plus mr-2"></i> Create New Task</button></div>`;
  }
  $$payload.out += `<!--]--></div></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
//# sourceMappingURL=_page.svelte.js.map
