import { b as attr, f as escape_html, d as attr_class, e as ensure_array_like, g as bind_props, a as pop, p as push, h as head, j as stringify } from "../../../chunks/index3.js";
import { y as fallback } from "../../../chunks/utils.js";
import "firebase/auth";
import "firebase/firestore";
function ExerciseCard($$payload, $$props) {
  push();
  let id = $$props["id"];
  let title = $$props["title"];
  let description = fallback($$props["description"], null);
  let difficulty = fallback($$props["difficulty"], null);
  let category = fallback($$props["category"], null);
  let tags = fallback($$props["tags"], () => [], true);
  let estimatedTime = fallback($$props["estimatedTime"], null);
  let points = fallback($$props["points"], 0);
  let href = fallback($$props["href"], void 0);
  let onClick = fallback($$props["onClick"], void 0);
  let progressStatus = fallback($$props["progressStatus"], void 0);
  let isCompleted = progressStatus === "completed";
  let isInProgress = progressStatus === "inProgress";
  function getDifficultyColor() {
    if (!difficulty) return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "intermediate":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "advanced":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  }
  if (href) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<a${attr("href", href)} class="exercise-card relative bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col h-full svelte-1x1nmz0" tabindex="0"${attr("aria-label", `Exercise: ${title}`)}><div class="card-content">`;
    if (isCompleted) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div class="absolute top-3 right-3 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center" aria-label="Completed"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg></div>`;
    } else if (isInProgress) {
      $$payload.out += "<!--[1-->";
      $$payload.out += `<div class="absolute top-3 right-3 w-6 h-6 rounded-full border-2 border-blue-500 border-dashed animate-spin-slow" aria-label="In progress"></div>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> <div class="p-5 flex-grow"><h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2 pr-6">${escape_html(title)}</h3> `;
    if (description) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<p class="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 svelte-1x1nmz0">${escape_html(description)}</p>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> <div class="flex flex-wrap gap-2 mb-3">`;
    if (difficulty) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<span${attr_class(`text-xs font-medium px-2.5 py-0.5 rounded-full ${getDifficultyColor()}`, "svelte-1x1nmz0")}>${escape_html(difficulty.charAt(0).toUpperCase() + difficulty.slice(1))}</span>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> `;
    if (category) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<span class="text-xs font-medium bg-cherry-100 text-cherry-800 dark:bg-cherry-900/30 dark:text-cherry-300 px-2.5 py-0.5 rounded-full">${escape_html(category)}</span>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></div> `;
    if (tags.length > 0) {
      $$payload.out += "<!--[-->";
      const each_array = ensure_array_like(tags.slice(0, 3));
      $$payload.out += `<div class="flex flex-wrap gap-1 mb-3"><!--[-->`;
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let tag = each_array[$$index];
        $$payload.out += `<span class="text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">${escape_html(tag)}</span>`;
      }
      $$payload.out += `<!--]--> `;
      if (tags.length > 3) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<span class="text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">+${escape_html(tags.length - 3)} more</span>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--></div>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></div> <div class="border-t border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center bg-gray-50 dark:bg-gray-900/30">`;
    if (estimatedTime) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div class="flex items-center text-xs text-gray-500 dark:text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> ${escape_html(estimatedTime)}</div>`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<div></div>`;
    }
    $$payload.out += `<!--]--> `;
    if (points > 0) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div class="flex items-center text-xs font-medium text-amber-600 dark:text-amber-400"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> ${escape_html(points)} pts</div>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></div></div></a>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<article class="exercise-card relative bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col h-full svelte-1x1nmz0" tabindex="0" role="button"${attr("aria-label", `Exercise: ${title}`)} aria-pressed="false"><div class="card-content">`;
    if (isCompleted) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div class="absolute top-3 right-3 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center" aria-label="Completed"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg></div>`;
    } else if (isInProgress) {
      $$payload.out += "<!--[1-->";
      $$payload.out += `<div class="absolute top-3 right-3 w-6 h-6 rounded-full border-2 border-blue-500 border-dashed animate-spin-slow" aria-label="In progress"></div>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> <div class="p-5 flex-grow"><h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2 pr-6">${escape_html(title)}</h3> `;
    if (description) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<p class="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 svelte-1x1nmz0">${escape_html(description)}</p>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> <div class="flex flex-wrap gap-2 mb-3">`;
    if (difficulty) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<span${attr_class(`text-xs font-medium px-2.5 py-0.5 rounded-full ${getDifficultyColor()}`, "svelte-1x1nmz0")}>${escape_html(difficulty.charAt(0).toUpperCase() + difficulty.slice(1))}</span>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> `;
    if (category) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<span class="text-xs font-medium bg-cherry-100 text-cherry-800 dark:bg-cherry-900/30 dark:text-cherry-300 px-2.5 py-0.5 rounded-full">${escape_html(category)}</span>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></div> `;
    if (tags.length > 0) {
      $$payload.out += "<!--[-->";
      const each_array_1 = ensure_array_like(tags.slice(0, 3));
      $$payload.out += `<div class="flex flex-wrap gap-1 mb-3"><!--[-->`;
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let tag = each_array_1[$$index_1];
        $$payload.out += `<span class="text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">${escape_html(tag)}</span>`;
      }
      $$payload.out += `<!--]--> `;
      if (tags.length > 3) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<span class="text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">+${escape_html(tags.length - 3)} more</span>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--></div>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></div> <div class="border-t border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center bg-gray-50 dark:bg-gray-900/30">`;
    if (estimatedTime) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div class="flex items-center text-xs text-gray-500 dark:text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> ${escape_html(estimatedTime)}</div>`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<div></div>`;
    }
    $$payload.out += `<!--]--> `;
    if (points > 0) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div class="flex items-center text-xs font-medium text-amber-600 dark:text-amber-400"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> ${escape_html(points)} pts</div>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></div></div></article>`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, {
    id,
    title,
    description,
    difficulty,
    category,
    tags,
    estimatedTime,
    points,
    href,
    onClick,
    progressStatus
  });
  pop();
}
function _page($$payload, $$props) {
  let exercisesByDifficulty;
  let data = $$props["data"];
  const { categories, latestExercises, allExercises } = data;
  exercisesByDifficulty = {
    beginner: allExercises.filter((ex) => ex.difficulty === "beginner"),
    intermediate: allExercises.filter((ex) => ex.difficulty === "intermediate"),
    advanced: allExercises.filter((ex) => ex.difficulty === "advanced")
  };
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Exercises | LearnFlow</title>`;
    $$payload2.out += `<meta name="description" content="Browse all exercises, categories, and practice your skills on LearnFlow.">`;
  });
  $$payload.out += `<div class="min-h-screen p-6 bg-gray-900 text-gray-100"><h1 class="text-4xl font-bold mb-8">Exercises</h1> `;
  if (categories.length > 0) {
    $$payload.out += "<!--[-->";
    const each_array = ensure_array_like(categories);
    $$payload.out += `<section class="mb-12"><h2 class="text-2xl font-semibold mb-4">Categories</h2> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`;
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let category = each_array[$$index];
      $$payload.out += `<a${attr("href", `/exercises/${category.slug}`)} class="block p-6 rounded-lg bg-gradient-to-br from-blue-800 to-blue-700 hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg"><div class="flex items-center mb-3"><i${attr_class(`fas ${stringify(category.icon)} text-blue-300 mr-3 text-xl`)}></i> <h3 class="text-xl font-semibold">${escape_html(category.title)}</h3></div> <p class="text-blue-100">${escape_html(category.description)}</p></a>`;
    }
    $$payload.out += `<!--]--></div></section>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  if (latestExercises.length > 0) {
    $$payload.out += "<!--[-->";
    const each_array_1 = ensure_array_like(latestExercises);
    $$payload.out += `<section class="mb-12"><h2 class="text-2xl font-semibold mb-4">Latest Exercises</h2> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`;
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let exercise = each_array_1[$$index_1];
      ExerciseCard($$payload, { exercise, href: `/exercises/${exercise.id}` });
    }
    $$payload.out += `<!--]--></div></section>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  if (exercisesByDifficulty.beginner.length > 0) {
    $$payload.out += "<!--[-->";
    const each_array_2 = ensure_array_like(exercisesByDifficulty.beginner.slice(0, 6));
    $$payload.out += `<section class="mb-12"><h2 class="text-2xl font-semibold mb-4">Beginner Exercises</h2> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`;
    for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
      let exercise = each_array_2[$$index_2];
      ExerciseCard($$payload, { exercise, href: `/exercises/${exercise.id}` });
    }
    $$payload.out += `<!--]--></div></section>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  if (exercisesByDifficulty.intermediate.length > 0) {
    $$payload.out += "<!--[-->";
    const each_array_3 = ensure_array_like(exercisesByDifficulty.intermediate.slice(0, 6));
    $$payload.out += `<section class="mb-12"><h2 class="text-2xl font-semibold mb-4">Intermediate Exercises</h2> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`;
    for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
      let exercise = each_array_3[$$index_3];
      ExerciseCard($$payload, { exercise, href: `/exercises/${exercise.id}` });
    }
    $$payload.out += `<!--]--></div></section>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  if (exercisesByDifficulty.advanced.length > 0) {
    $$payload.out += "<!--[-->";
    const each_array_4 = ensure_array_like(exercisesByDifficulty.advanced.slice(0, 6));
    $$payload.out += `<section class="mb-12"><h2 class="text-2xl font-semibold mb-4">Advanced Exercises</h2> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`;
    for (let $$index_4 = 0, $$length = each_array_4.length; $$index_4 < $$length; $$index_4++) {
      let exercise = each_array_4[$$index_4];
      ExerciseCard($$payload, { exercise, href: `/exercises/${exercise.id}` });
    }
    $$payload.out += `<!--]--></div></section>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  if (allExercises.length > 0) {
    $$payload.out += "<!--[-->";
    const each_array_5 = ensure_array_like(allExercises);
    $$payload.out += `<section><h2 class="text-2xl font-semibold mb-4">All Exercises</h2> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><!--[-->`;
    for (let $$index_5 = 0, $$length = each_array_5.length; $$index_5 < $$length; $$index_5++) {
      let exercise = each_array_5[$$index_5];
      ExerciseCard($$payload, { exercise, href: `/exercises/${exercise.id}` });
    }
    $$payload.out += `<!--]--></div></section>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div>`;
  bind_props($$props, { data });
}
export {
  _page as default
};
//# sourceMappingURL=_page.svelte.js.map
