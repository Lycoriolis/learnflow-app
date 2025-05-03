import { d as attr_class, f as escape_html, e as ensure_array_like, g as bind_props, a as pop, p as push, j as stringify, h as head, b as attr } from "../../../../chunks/index3.js";
import "dompurify";
/* empty css                             */
import { E as ExerciseMarkdown, a as ExerciseRating } from "../../../../chunks/ExerciseRating.js";
/* empty css                                                            */
import { y as fallback } from "../../../../chunks/utils.js";
import "katex";
function ExerciseCard($$payload, $$props) {
  push();
  let isCompleted, isInProgress;
  let title = $$props["title"];
  let description = fallback($$props["description"], "");
  let difficulty = fallback($$props["difficulty"], null);
  let estimatedTime = fallback($$props["estimatedTime"], "");
  let tags = fallback($$props["tags"], () => [], true);
  let id = fallback($$props["id"], "");
  let type = fallback($$props["type"], "exercise");
  let onClick = fallback($$props["onClick"], () => {
  });
  let progressStatus = fallback($$props["progressStatus"], "notStarted");
  function getDifficultyColor(diff) {
    switch (diff) {
      case "beginner":
        return "bg-green-500";
      case "intermediate":
        return "bg-yellow-500";
      case "advanced":
        return "bg-red-500";
      default:
        return "bg-blue-500";
    }
  }
  function getDifficultyLabel(diff) {
    if (!diff) return "";
    return diff.charAt(0).toUpperCase() + diff.slice(1);
  }
  isCompleted = progressStatus === "completed";
  isInProgress = progressStatus === "inProgress";
  if (type === "exercise") {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div role="button" tabindex="0"${attr_class(`exercise-card ${stringify(isCompleted ? "completed" : isInProgress ? "in-progress" : "")} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 dark:focus:ring-red-500`, "svelte-10xk08b")}><div class="completion-indicator svelte-10xk08b"><div${attr_class(`indicator-dot ${stringify(isCompleted ? "completed" : isInProgress ? "in-progress" : "not-started")}`, "svelte-10xk08b")}><i${attr_class(`fas ${stringify(isCompleted ? "fa-check" : isInProgress ? "fa-spinner" : "")}`)}></i></div></div> <div class="card-content svelte-10xk08b"><h3 class="exercise-title svelte-10xk08b">${escape_html(title)}</h3> `;
    if (description) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<p class="exercise-description svelte-10xk08b">${escape_html(description)}</p>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> <div class="exercise-meta svelte-10xk08b">`;
    if (difficulty) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div${attr_class(`difficulty-badge ${stringify(difficulty)}`, "svelte-10xk08b")}><span${attr_class(`difficulty-dot ${stringify(getDifficultyColor(difficulty))}`, "svelte-10xk08b")}></span> <span>${escape_html(getDifficultyLabel(difficulty))}</span></div>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> `;
    if (estimatedTime) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div class="time-badge svelte-10xk08b"><i class="fas fa-clock"></i> <span>${escape_html(estimatedTime)}</span></div>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></div> `;
    if (tags && tags.length > 0) {
      $$payload.out += "<!--[-->";
      const each_array = ensure_array_like(tags.slice(0, 3));
      $$payload.out += `<div class="tags-container svelte-10xk08b"><!--[-->`;
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let tag = each_array[$$index];
        $$payload.out += `<span class="tag svelte-10xk08b">${escape_html(tag)}</span>`;
      }
      $$payload.out += `<!--]--> `;
      if (tags.length > 3) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<span class="tag-more svelte-10xk08b">+${escape_html(tags.length - 3)}</span>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--></div>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></div> `;
    if (difficulty) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div${attr_class(`difficulty-stripe ${stringify(difficulty)}`, "svelte-10xk08b")}></div>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> <div class="card-overlay svelte-10xk08b"></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div role="button" tabindex="0" class="course-card focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 svelte-10xk08b"><h3 class="course-title svelte-10xk08b">${escape_html(title)}</h3> `;
    if (description) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<p class="course-description svelte-10xk08b">${escape_html(description)}</p>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> <div class="card-meta svelte-10xk08b">`;
    if (difficulty) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<span class="card-badge difficulty svelte-10xk08b">${escape_html(getDifficultyLabel(difficulty))}</span>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> `;
    if (estimatedTime) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<span class="card-badge time svelte-10xk08b"><i class="fas fa-clock"></i> ${escape_html(estimatedTime)}</span>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></div> `;
    if (tags && tags.length > 0) {
      $$payload.out += "<!--[-->";
      const each_array_1 = ensure_array_like(tags.slice(0, 3));
      $$payload.out += `<div class="tags-row svelte-10xk08b"><!--[-->`;
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let tag = each_array_1[$$index_1];
        $$payload.out += `<span class="tag-pill svelte-10xk08b">${escape_html(tag)}</span>`;
      }
      $$payload.out += `<!--]--> `;
      if (tags.length > 3) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<span class="tag-pill more svelte-10xk08b">+${escape_html(tags.length - 3)}</span>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--></div>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> <div class="card-arrow svelte-10xk08b"><i class="fas fa-arrow-right"></i></div></div>`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, {
    title,
    description,
    difficulty,
    estimatedTime,
    tags,
    id,
    type,
    onClick,
    progressStatus
  });
  pop();
}
function _page($$payload, $$props) {
  push();
  let data = $$props["data"];
  const { isCategory } = data;
  head($$payload, ($$payload2) => {
    if (isCategory) {
      $$payload2.out += "<!--[-->";
      $$payload2.title = `<title>${escape_html(data.category.title)} | LearnFlow Exercises</title>`;
      $$payload2.out += `<meta name="description"${attr("content", data.category.description || `Browse exercises in the ${data.category.title} category`)}>`;
    } else {
      $$payload2.out += "<!--[!-->";
      $$payload2.title = `<title>${escape_html(data.exercise?.title || "Exercise")} | LearnFlow</title>`;
      $$payload2.out += `<meta name="description"${attr("content", data.exercise?.description || "Practice with this exercise on LearnFlow")}>`;
    }
    $$payload2.out += `<!--]-->`;
  });
  $$payload.out += `<div class="min-h-screen p-6 bg-gray-900 text-gray-100">`;
  if (isCategory) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div><a href="/exercises" class="text-sm text-red-300 hover:text-red-200 mb-4 inline-block">← All Exercises</a> <h1 class="text-3xl font-bold mb-2">${escape_html(data.category.title)}</h1> `;
    if (data.category.description) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<p class="text-gray-300 mb-6">${escape_html(data.category.description)}</p>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> `;
    if (data.category.exercises && data.category.exercises.length > 0) {
      $$payload.out += "<!--[-->";
      const each_array = ensure_array_like(data.category.exercises);
      $$payload.out += `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"><!--[-->`;
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let exercise = each_array[$$index];
        ExerciseCard($$payload, {
          exercise,
          href: `/exercises/${data.category.id}/${exercise.id}`
        });
      }
      $$payload.out += `<!--]--></div>`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<p>No exercises found in this category.</p>`;
    }
    $$payload.out += `<!--]--></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div><a href="/exercises" class="text-sm text-red-300 hover:text-red-200 mb-4 inline-block">← All Exercises</a> `;
    if (data.exercise) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div class="bg-gray-800 rounded-lg p-6 shadow-lg"><h1 class="text-3xl font-bold mb-2">${escape_html(data.exercise.title)}</h1> <div class="flex flex-wrap gap-2 mb-4">`;
      if (data.exercise.difficulty) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<span${attr_class("px-2 py-1 text-xs rounded-full bg-opacity-20", void 0, {
          "bg-green-600": data.exercise.difficulty === "beginner",
          "bg-yellow-600": data.exercise.difficulty === "intermediate",
          "bg-red-600": data.exercise.difficulty === "advanced"
        })}>${escape_html(data.exercise.difficulty.charAt(0).toUpperCase() + data.exercise.difficulty.slice(1))}</span>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--> `;
      if (data.exercise.estimatedTime) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<span class="px-2 py-1 text-xs rounded-full bg-blue-600 bg-opacity-20"><i class="fas fa-clock mr-1"></i> ${escape_html(data.exercise.estimatedTime)}</span>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--> `;
      if (data.exercise.tags && data.exercise.tags.length > 0) {
        $$payload.out += "<!--[-->";
        const each_array_1 = ensure_array_like(data.exercise.tags);
        $$payload.out += `<!--[-->`;
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let tag = each_array_1[$$index_1];
          $$payload.out += `<span class="px-2 py-1 text-xs rounded-full bg-purple-600 bg-opacity-20">${escape_html(tag)}</span>`;
        }
        $$payload.out += `<!--]-->`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--></div> `;
      if (data.exercise.description) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<p class="text-gray-300 mb-6">${escape_html(data.exercise.description)}</p>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--> <div class="mt-6">`;
      if (data.content) {
        $$payload.out += "<!--[-->";
        ExerciseMarkdown($$payload, { content: data.content });
      } else {
        $$payload.out += "<!--[!-->";
        $$payload.out += `<p>No content available for this exercise.</p>`;
      }
      $$payload.out += `<!--]--></div> <div class="mt-8 pt-6 border-t border-gray-700">`;
      ExerciseRating($$payload, { exerciseId: data.exercise.id });
      $$payload.out += `<!----></div></div>`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<div class="bg-red-900 bg-opacity-20 p-4 rounded-lg"><p>Exercise not found or failed to load.</p></div>`;
    }
    $$payload.out += `<!--]--></div>`;
  }
  $$payload.out += `<!--]--></div>`;
  bind_props($$props, { data });
  pop();
}
export {
  _page as default
};
//# sourceMappingURL=_page.svelte.js.map
