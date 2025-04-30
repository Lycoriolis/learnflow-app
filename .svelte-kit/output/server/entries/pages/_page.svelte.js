import { N as fallback, F as escape_html, M as bind_props, E as ensure_array_like, G as attr_class, J as stringify, I as attr, Q as attr_style, B as pop, z as push, O as head, C as store_get, K as unsubscribe_stores } from "../../chunks/index.js";
import { o as onDestroy } from "../../chunks/index-server.js";
import "../../chunks/courseService.js";
import "firebase/firestore";
/* empty css                      */
import { l as loading, i as isAuthenticated, u as user } from "../../chunks/authStore.js";
import "clsx";
import { u as userProfileLoading, a as userProfile } from "../../chunks/userProfileStore.js";
import { f as focusSessions } from "../../chunks/pipStores.js";
import "gray-matter";
import { F as FocusTimeChart } from "../../chunks/FocusTimeChart.js";
import { w as writable } from "../../chunks/index3.js";
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
function CourseCard($$payload, $$props) {
  push();
  let courseGradient;
  let course = fallback(
    $$props["course"],
    () => ({
      id: "",
      title: "",
      description: "",
      progress: 0,
      icon: "fa-book",
      gradient: { from: "blue-500", to: "blue-400" }
    }),
    true
  );
  courseGradient = {
    from: course?.gradient?.from || "blue-500",
    to: course?.gradient?.to || "blue-400"
  };
  $$payload.out += `<a${attr("href", `/courses/${course.id}`)} class="bg-gray-700 border border-orange-500 p-5 rounded-2xl shadow-sm squircle-sm card-hover h-full block focus:outline-none focus:ring-2 focus:ring-indigo-500"><div${attr_class(`h-32 rounded-xl mb-4 flex items-center justify-center bg-gradient-to-r from-${courseGradient.from} to-${courseGradient.to}`)}><i${attr_class(`fas ${course.icon} text-white text-4xl`)}></i></div> <h3 class="font-semibold text-gray-100 mb-2">${escape_html(course.title)}</h3> <p class="text-gray-300 text-sm mb-4 line-clamp-2">${escape_html(course.description)}</p> <div class="flex items-center justify-between"><div class="w-full bg-gray-600 rounded-full h-2"><div class="h-2 rounded-full"${attr_style(`width: ${course.progress}%; background-color: #3B82F6;`)}></div></div> <span class="text-xs text-gray-300 ml-2">${escape_html(course.progress)}%</span></div></a>`;
  bind_props($$props, { course });
  pop();
}
function CourseCarousel($$payload, $$props) {
  push();
  let courses = [];
  onDestroy(() => {
  });
  const each_array = ensure_array_like(courses);
  $$payload.out += `<div class="course-carousel-container mb-8 py-4 svelte-1aw9g38" style="--carousel-bg-rgb: 17, 24, 39;"><div class="container mx-auto px-4"><div class="flex justify-between items-center mb-6"><h2 class="text-xl font-semibold text-gray-100">Continue Learning</h2> <a href="/courses" class="text-sm text-indigo-400 hover:text-indigo-200 font-medium transition-colors duration-200 ease-in-out">View All</a></div> <div class="splide"><div class="splide__track"><ul class="splide__list"><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let course = each_array[$$index];
    $$payload.out += `<li class="splide__slide">`;
    CourseCard($$payload, { course });
    $$payload.out += `<!----></li>`;
  }
  $$payload.out += `<!--]--></ul></div></div></div></div>`;
  pop();
}
function ExercisesSection($$payload, $$props) {
  let exercises = fallback(
    $$props["exercises"],
    () => [
      {
        title: "JavaScript Closure Exercise",
        description: "Practice with closures and scope",
        icon: "fa-code",
        color: "blue",
        category: "JavaScript"
      },
      {
        title: "Matrix Multiplication",
        description: "Practice matrix operations",
        icon: "fa-calculator",
        color: "purple",
        category: "Math"
      },
      {
        title: "Spanish Vocabulary Quiz",
        description: "Test your vocabulary knowledge",
        icon: "fa-language",
        color: "green",
        category: "Language"
      }
    ],
    true
  );
  const each_array = ensure_array_like(exercises);
  $$payload.out += `<div class="mb-8"><div class="flex justify-between items-center mb-4"><h2 class="text-lg font-semibold text-gray-100">Recommended Exercises</h2> <a href="/exercises" class="text-sm text-indigo-300 hover:text-indigo-100 font-medium">View All</a></div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let exercise = each_array[$$index];
    $$payload.out += `<div class="bg-gray-700 border border-orange-500 p-5 rounded-2xl shadow-sm squircle-sm card-hover" role="button" tabindex="0"><div class="flex items-start mb-4"><div class="w-10 h-10 bg-indigo-900 rounded-lg flex items-center justify-center mr-3"><i${attr_class(`fas ${stringify(exercise.icon)} text-indigo-300`)}></i></div> <div><h3 class="font-semibold text-gray-100">${escape_html(exercise.title)}</h3> <p class="text-gray-300 text-sm">${escape_html(exercise.description)}</p></div></div> <div class="flex justify-between items-center"><span class="text-xs px-2 py-1 bg-indigo-800 text-indigo-100 rounded">${escape_html(exercise.category)}</span> <button class="text-sm text-indigo-300 hover:text-indigo-100 font-medium">Start</button></div></div>`;
  }
  $$payload.out += `<!--]--></div></div>`;
  bind_props($$props, { exercises });
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
  let metrics = [];
  let suggestions = writable([]);
  onDestroy(() => {
  });
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
      items: store_get($$store_subs ??= {}, "$suggestions", suggestions)
    });
    $$payload.out += `<!----> `;
    ExercisesSection($$payload, {});
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
  pop();
}
export {
  _page as default
};
