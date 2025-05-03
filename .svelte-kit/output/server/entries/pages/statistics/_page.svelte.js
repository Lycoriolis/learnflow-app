import { f as escape_html, d as attr_class, j as stringify, g as bind_props, c as store_get, h as head, u as unsubscribe_stores, a as pop, p as push } from "../../../chunks/index3.js";
import { i as isAuthenticated, l as loading } from "../../../chunks/authStore.js";
import { u as userProfileLoading, a as userProfile } from "../../../chunks/userProfileStore.js";
import { f as focusSessions, t as todos, e as exerciseSessions } from "../../../chunks/pipStores.js";
import "../../../chunks/client.js";
import { y as fallback } from "../../../chunks/utils.js";
import { F as FocusTimeChart } from "../../../chunks/FocusTimeChart.js";
function StatCard($$payload, $$props) {
  let colorStyle;
  let title = $$props["title"];
  let value = $$props["value"];
  let icon = fallback($$props["icon"], "fa-chart-line");
  let color = fallback($$props["color"], "blue");
  const colorClasses = {
    blue: {
      bg: "bg-blue-100 dark:bg-blue-900",
      text: "text-blue-600 dark:text-blue-300"
    },
    green: {
      bg: "bg-green-100 dark:bg-green-900",
      text: "text-green-600 dark:text-green-300"
    },
    red: {
      bg: "bg-red-100 dark:bg-red-900",
      text: "text-red-600 dark:text-red-300"
    },
    yellow: {
      bg: "bg-yellow-100 dark:bg-yellow-900",
      text: "text-yellow-600 dark:text-yellow-300"
    },
    indigo: {
      bg: "bg-indigo-100 dark:bg-indigo-900",
      text: "text-indigo-600 dark:text-indigo-300"
    },
    purple: {
      bg: "bg-purple-100 dark:bg-purple-900",
      text: "text-purple-600 dark:text-purple-300"
    },
    gray: {
      bg: "bg-gray-100 dark:bg-gray-800",
      text: "text-gray-600 dark:text-gray-300"
    }
  };
  colorStyle = colorClasses[color];
  $$payload.out += `<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"><div class="flex items-center justify-between"><div><p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">${escape_html(title)}</p> <p class="text-2xl font-bold text-gray-900 dark:text-white">${escape_html(value)}</p></div> <div${attr_class(`h-12 w-12 ${stringify(colorStyle.bg)} rounded-full flex items-center justify-center ${stringify(colorStyle.text)}`)}><i${attr_class(`fas ${stringify(icon)} text-xl`)}></i></div></div></div>`;
  bind_props($$props, { title, value, icon, color });
}
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let unit = "week";
  let totalFocus = 0;
  let sessionCount = 0;
  let avgSession = 0;
  let longestSession = 0;
  let tasksDone = 0;
  let exercisesCompleted = 0;
  let enrollmentsCount = 0;
  if (store_get($$store_subs ??= {}, "$isAuthenticated", isAuthenticated) && !store_get($$store_subs ??= {}, "$authLoading", loading) && !store_get($$store_subs ??= {}, "$userProfileLoading", userProfileLoading) && store_get($$store_subs ??= {}, "$userProfile", userProfile)) {
    const sessions = store_get($$store_subs ??= {}, "$focusSessions", focusSessions);
    sessionCount = sessions.length;
    totalFocus = sessions.reduce((sum, s) => sum + s.duration / 60, 0);
    avgSession = sessionCount ? totalFocus / sessionCount : 0;
    longestSession = sessions.reduce((max, s) => Math.max(max, s.duration / 60), 0);
    tasksDone = store_get($$store_subs ??= {}, "$todos", todos).filter((t) => t.completed).length;
    exercisesCompleted = store_get($$store_subs ??= {}, "$exerciseSessions", exerciseSessions).filter((es) => es.completed).length;
    const preferences = store_get($$store_subs ??= {}, "$userProfile", userProfile).preferences || {};
    const enrollments = preferences.enrollments || [];
    enrollmentsCount = enrollments.filter((e) => e.progress > 0 && e.progress < 100).length;
  }
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Statistics | LearnFlow</title>`;
  });
  if (store_get($$store_subs ??= {}, "$authLoading", loading)) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="flex items-center justify-center min-h-[60vh]"><i class="fas fa-spinner fa-spin text-4xl text-indigo-500"></i></div>`;
  } else if (!store_get($$store_subs ??= {}, "$isAuthenticated", isAuthenticated)) {
    $$payload.out += "<!--[1-->";
    $$payload.out += `<div class="flex flex-col items-center justify-center min-h-[60vh]"><p class="text-lg text-gray-600 dark:text-gray-300 mb-4">Log in to view your statistics.</p> <button class="px-6 py-2 bg-indigo-600 text-white rounded">Log In</button></div>`;
  } else if (store_get($$store_subs ??= {}, "$userProfileLoading", userProfileLoading)) {
    $$payload.out += "<!--[2-->";
    $$payload.out += `<div class="flex items-center justify-center min-h-[60vh]"><i class="fas fa-spinner fa-spin text-4xl text-indigo-500"></i></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div class="max-w-5xl mx-auto px-4 py-6 space-y-8"><h1 class="text-3xl font-bold text-gray-900 dark:text-white">Your Statistics</h1> <div class="grid grid-cols-2 md:grid-cols-4 gap-6">`;
    StatCard($$payload, {
      title: "Focus Sessions",
      value: String(sessionCount),
      icon: "fa-stopwatch",
      color: "yellow"
    });
    $$payload.out += `<!----> `;
    StatCard($$payload, {
      title: "Total Focus (min)",
      value: String(Math.round(totalFocus)),
      icon: "fa-clock",
      color: "purple"
    });
    $$payload.out += `<!----> `;
    StatCard($$payload, {
      title: "Avg Session (min)",
      value: avgSession.toFixed(1),
      icon: "fa-chart-line",
      color: "blue"
    });
    $$payload.out += `<!----> `;
    StatCard($$payload, {
      title: "Longest Session",
      value: longestSession.toFixed(1),
      icon: "fa-mountain",
      color: "indigo"
    });
    $$payload.out += `<!----> `;
    StatCard($$payload, {
      title: "Tasks Completed",
      value: String(tasksDone),
      icon: "fa-list-check",
      color: "green"
    });
    $$payload.out += `<!----> `;
    StatCard($$payload, {
      title: "Exercises Completed",
      value: String(exercisesCompleted),
      icon: "fa-pencil-alt",
      color: "gray"
    });
    $$payload.out += `<!----> `;
    StatCard($$payload, {
      title: "Courses In Progress",
      value: String(enrollmentsCount),
      icon: "fa-book-open",
      color: "red"
    });
    $$payload.out += `<!----></div> <div class="space-y-4"><div class="flex items-center space-x-4"><label class="font-medium">View by:</label> <select class="rounded border-gray-300 p-2 bg-white dark:bg-gray-800"><option value="day">Daily</option><option value="week">Weekly</option><option value="month">Monthly</option></select></div> <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4" style="height: 300px;">`;
    FocusTimeChart($$payload, {
      sessions: store_get($$store_subs ??= {}, "$focusSessions", focusSessions),
      timeUnit: unit
    });
    $$payload.out += `<!----></div></div></div>`;
  }
  $$payload.out += `<!--]-->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
//# sourceMappingURL=_page.svelte.js.map
