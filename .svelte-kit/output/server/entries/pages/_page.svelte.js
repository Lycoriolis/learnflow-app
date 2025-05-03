import { f as escape_html, g as bind_props, e as ensure_array_like, d as attr_class, j as stringify, b as attr, m as attr_style, a as pop, p as push, h as head, c as store_get, u as unsubscribe_stores } from "../../chunks/index3.js";
import { o as onDestroy } from "../../chunks/index-server.js";
import { y as fallback } from "../../chunks/utils.js";
import { C as CourseCard } from "../../chunks/CourseCard.js";
import { I as Icon } from "../../chunks/Icon.js";
/* empty css                                                      */
import "firebase/firestore";
import "firebase/auth";
import "clsx";
import { l as loading, i as isAuthenticated, u as user } from "../../chunks/authStore.js";
import { u as userProfileLoading, a as userProfile } from "../../chunks/userProfileStore.js";
import { f as focusSessions } from "../../chunks/pipStores.js";
import { F as FocusTimeChart } from "../../chunks/FocusTimeChart.js";
function WelcomeBanner($$payload, $$props) {
  let username = fallback($$props["username"], "Hakim");
  $$payload.out += `<div class="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl p-6 mb-8 text-white squircle"><div class="flex flex-col md:flex-row justify-between items-start md:items-center"><div><h2 class="text-2xl font-bold mb-2">Welcome back, ${escape_html(username)}!</h2> <p class="opacity-90 mb-4 md:mb-0">Continue your learning journey with these recommended courses</p></div> <a href="/courses" class="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-lg font-medium hover:bg-indigo-200 transition">Explore Courses</a></div></div>`;
  bind_props($$props, { username });
}
function ProgressMetrics($$payload, $$props) {
  let metrics = fallback(
    $$props["metrics"],
    () => [
      {
        title: "Courses in Progress",
        value: "3",
        icon: "fa-book",
        color: "indigo"
      },
      {
        title: "Exercises Completed",
        value: "24",
        icon: "fa-check-circle",
        color: "green"
      },
      {
        title: "Learning Streak",
        value: "7 days",
        icon: "fa-fire",
        color: "yellow"
      }
    ],
    true
  );
  const each_array = ensure_array_like(metrics);
  $$payload.out += `<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let metric = each_array[$$index];
    $$payload.out += `<div class="bg-gray-700 border border-orange-500 p-6 rounded-2xl shadow-sm squircle-sm card-hover"><div class="flex justify-between items-start"><div><h3 class="text-gray-400 text-sm font-medium">${escape_html(metric.title)}</h3> <p class="text-2xl font-bold text-gray-100 mt-1">${escape_html(metric.value)}</p></div> <div class="w-12 h-12 bg-indigo-900 rounded-full flex items-center justify-center"><i${attr_class(`fas ${stringify(metric.icon)} text-indigo-300`)}></i></div></div></div>`;
  }
  $$payload.out += `<!--]--></div>`;
  bind_props($$props, { metrics });
}
function CourseCarousel($$payload, $$props) {
  push();
  let courses = fallback($$props["courses"], () => [], true);
  let title = fallback($$props["title"], "Featured Courses");
  let selectedIndex = 0;
  const each_array = ensure_array_like(courses);
  $$payload.out += `<div class="course-carousel"><div class="flex justify-between items-center mb-4"><h2 class="text-xl font-bold text-gray-900 dark:text-white">${escape_html(title)}</h2> <div class="flex space-x-2"><button class="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"${attr("disabled", selectedIndex === 0, true)}>`;
  Icon($$payload, { icon: "mdi:chevron-left", class: "w-5 h-5" });
  $$payload.out += `<!----></button> <button class="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"${attr("disabled", selectedIndex === courses.length - 1, true)}>`;
  Icon($$payload, { icon: "mdi:chevron-right", class: "w-5 h-5" });
  $$payload.out += `<!----></button></div></div> <div class="carousel-container overflow-hidden"><div class="carousel-track flex transition-transform duration-300"${attr_style(`transform: translateX(-${stringify(selectedIndex * 100)}%)`)}><!--[-->`;
  for (let i = 0, $$length = each_array.length; i < $$length; i++) {
    let course = each_array[i];
    $$payload.out += `<div class="carousel-item w-full flex-shrink-0 p-2">`;
    CourseCard($$payload, { course, isSelected: i === selectedIndex });
    $$payload.out += `<!----></div>`;
  }
  $$payload.out += `<!--]--></div></div></div>`;
  bind_props($$props, { courses, title });
  pop();
}
function ExercisesSection($$payload, $$props) {
  push();
  let categoryId = fallback($$props["categoryId"], null);
  let limit = fallback($$props["limit"], null);
  let title = fallback($$props["title"], "Exercises");
  let onExerciseClick = fallback($$props["onExerciseClick"], (exercise) => {
    console.log("Exercise clicked:", exercise.id);
  });
  let exercises = [];
  let searchQuery = "";
  let selectedTags = [];
  let showFilters = false;
  function applyFilters() {
    let result = exercises;
    if (selectedTags.length > 0) {
      result = result.filter((ex) => selectedTags.every((tag) => ex.tags?.includes(tag)));
    }
    if (limit !== null) {
      result = result.slice(0, limit);
    }
  }
  applyFilters();
  $$payload.out += `<section class="exercises-section svelte-468fi1"><div class="section-header svelte-468fi1"><h2 class="section-title svelte-468fi1">${escape_html(title)}</h2> <button${attr("aria-expanded", showFilters)} class="filter-toggle svelte-468fi1"><i class="fas fa-filter"></i> Filters `;
  if (selectedTags.length || searchQuery) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<span class="filter-badge svelte-468fi1">${escape_html(selectedTags.length + 0 + 0)}</span>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></button></div> `;
  {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="loading-state svelte-468fi1">Loading exercises...</div>`;
  }
  $$payload.out += `<!--]--></section>`;
  bind_props($$props, { categoryId, limit, title, onExerciseClick });
  pop();
}
function RecentActivity($$payload, $$props) {
  push();
  let activities = [];
  const each_array = ensure_array_like(activities);
  $$payload.out += `<div><h2 class="text-lg font-semibold text-gray-100 mb-4">Recent Activity</h2> <div class="bg-gray-700 border border-orange-500 p-6 rounded-2xl shadow-sm squircle-sm"><div class="space-y-4"><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let activity = each_array[$$index];
    $$payload.out += `<div class="flex items-start"><div${attr_class(`w-10 h-10 bg-${activity.color}-900 rounded-full flex items-center justify-center mr-3 flex-shrink-0`)}><i${attr_class(`fas ${activity.icon} text-${activity.color}-300`)}></i></div> <div><h3 class="font-medium text-gray-100">${escape_html(activity.title)}</h3> <p class="text-gray-300 text-sm">${escape_html(activity.content)}</p> <p class="text-gray-400 text-xs mt-1">${escape_html(activity.timeAgo)}</p></div></div>`;
  }
  $$payload.out += `<!--]--> `;
  if (activities.length === 0) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<p class="text-gray-400 text-sm">No recent activity.</p>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div></div></div>`;
  pop();
}
function GeneralWelcome($$payload) {
  $$payload.out += `<div class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-lg shadow-xl p-8 my-6"><h1 class="text-4xl font-bold mb-4">Welcome to LearnFlow!</h1> <p class="text-xl mb-6">Your personalized journey to knowledge starts here. Log in or sign up to track your progress, access exclusive content, and connect with fellow learners.</p> <p class="text-lg">Discover courses, tackle exercises, and watch your skills grow.</p></div> <div class="grid md:grid-cols-3 gap-6 my-8"><div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow"><h2 class="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Explore Courses</h2> <p class="text-gray-600 dark:text-gray-300">Browse our extensive library of courses across various domains.</p></div> <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow"><h2 class="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Practice Exercises</h2> <p class="text-gray-600 dark:text-gray-300">Sharpen your skills with interactive exercises and real-time feedback.</p></div> <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow"><h2 class="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">Track Progress</h2> <p class="text-gray-600 dark:text-gray-300">Log in to monitor your learning journey and achievements.</p></div></div>`;
}
function RecommendationsSection($$payload, $$props) {
  push();
  let limit = fallback($$props["limit"], 5);
  $$payload.out += `<div class="mb-8"><h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Recommended for You</h2> `;
  {
    $$payload.out += "<!--[-->";
    $$payload.out += `<p class="text-gray-600">Loading recommendations...</p>`;
  }
  $$payload.out += `<!--]--></div>`;
  bind_props($$props, { limit });
  pop();
}
function ScoreCard($$payload, $$props) {
  push();
  $$payload.out += `<div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow mb-8"><h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Score Utilisateur</h2> `;
  {
    $$payload.out += "<!--[-->";
    $$payload.out += `<p class="text-gray-600">Loading...</p>`;
  }
  $$payload.out += `<!--]--></div>`;
  pop();
}
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let suggestedCourses;
  let data = $$props["data"];
  let metrics = [];
  onDestroy(() => {
  });
  suggestedCourses = data.suggestedCourses || [];
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>LearnFlow | Your Dashboard</title>`;
    $$payload2.out += `<meta name="description" content="Your personalized learning dashboard on LearnFlow.">`;
  });
  $$payload.out += `<div class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">`;
  if (store_get($$store_subs ??= {}, "$authLoading", loading) || store_get($$store_subs ??= {}, "$userProfileLoading", userProfileLoading)) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="flex justify-center items-center min-h-[60vh]"><i class="fas fa-spinner fa-spin text-4xl text-indigo-500"></i></div>`;
  } else if (store_get($$store_subs ??= {}, "$isAuthenticated", isAuthenticated) && store_get($$store_subs ??= {}, "$userProfile", userProfile)) {
    $$payload.out += "<!--[1-->";
    WelcomeBanner($$payload, {
      username: store_get($$store_subs ??= {}, "$user", user) ? store_get($$store_subs ??= {}, "$user", user).displayName ?? store_get($$store_subs ??= {}, "$user", user).email ?? "" : ""
    });
    $$payload.out += `<!----> `;
    ProgressMetrics($$payload, { metrics });
    $$payload.out += `<!----> <div class="mb-8"><h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Focus Time Log</h2> `;
    FocusTimeChart($$payload, {
      sessions: store_get($$store_subs ??= {}, "$focusSessions", focusSessions),
      timeUnit: "day"
    });
    $$payload.out += `<!----></div> <div class="mb-8"><h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2> <div class="flex flex-col gap-4 w-full">`;
    CourseCarousel($$payload, {
      title: "Suggested Courses",
      items: suggestedCourses
    });
    $$payload.out += `<!----> `;
    ExercisesSection($$payload, { limit: 5 });
    $$payload.out += `<!----> <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow min-h-[140px] flex flex-col items-center justify-center text-center transition hover:shadow-xl hover:ring-2 hover:ring-indigo-300 w-full"><h3 class="text-lg font-semibold mb-2">Your Tasks</h3> <p class="text-gray-600 dark:text-gray-300">Manage your study tasks.</p></div> <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow min-h-[140px] flex flex-col items-center justify-center text-center transition hover:shadow-xl hover:ring-2 hover:ring-indigo-300 w-full"><h3 class="text-lg font-semibold mb-2">Your Notes</h3> <p class="text-gray-600 dark:text-gray-300">Jot down quick thoughts.</p></div></div></div> `;
    ScoreCard($$payload);
    $$payload.out += `<!----> `;
    RecommendationsSection($$payload, { limit: 5 });
    $$payload.out += `<!----> `;
    RecentActivity($$payload);
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    GeneralWelcome($$payload);
  }
  $$payload.out += `<!--]--></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { data });
  pop();
}
export {
  _page as default
};
//# sourceMappingURL=_page.svelte.js.map
