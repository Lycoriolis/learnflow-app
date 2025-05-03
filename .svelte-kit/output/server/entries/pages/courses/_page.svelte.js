import { f as escape_html, e as ensure_array_like, d as attr_class, g as bind_props, a as pop, p as push, j as stringify, c as store_get, b as attr, u as unsubscribe_stores } from "../../../chunks/index3.js";
import { w as writable } from "../../../chunks/index2.js";
import "firebase/firestore";
import "firebase/auth";
import { C as CourseCard } from "../../../chunks/CourseCard.js";
import { y as fallback } from "../../../chunks/utils.js";
import { M as MarkdownRenderer } from "../../../chunks/MarkdownRenderer.js";
import { E as ExerciseMarkdown, a as ExerciseRating } from "../../../chunks/ExerciseRating.js";
import { I as Icon } from "../../../chunks/Icon.js";
import "../../../chunks/client.js";
const courseItems = writable([]);
const courseCategories = writable([]);
const selectedCourse = writable(null);
const isLoading = writable(false);
const error = writable(null);
function ContentViewer($$payload, $$props) {
  push();
  let sections, hasSolution, showSolution;
  let item = fallback($$props["item"], null);
  let type = fallback($$props["type"], "exercise");
  let onBack = fallback($$props["onBack"], () => {
  });
  let checkedHints = [];
  let hintsArray = [];
  function extractContentSections(content) {
    const result = { main: content };
    const sectionMatches = content.matchAll(/^##\s+([A-Za-z\s]+)\s*$([\s\S]*?)(?=^##\s+[A-Za-z\s]+\s*$|$)/gm);
    for (const match of sectionMatches) {
      if (match[1] && match[2]) {
        const sectionName = match[1].trim().toLowerCase();
        const sectionContent = match[2].trim();
        result[sectionName] = sectionContent;
      }
    }
    const hintsSection = result.hints || "";
    if (hintsSection) {
      const hints = hintsSection.split(/\n?(?:^###\s+Hint \d+\s*$|^\*\s+)/gm).map((h) => h.trim()).filter(Boolean);
      if (hints.length > 0) {
        hintsArray = hints;
      }
    }
    if (type === "exercise") {
      if (Object.keys(result).length > 1) {
        delete result.main;
      }
      if (result.problem) {
        result.content = result.problem;
        delete result.problem;
      }
    }
    return result;
  }
  sections = item ? extractContentSections(item.content || "") : {};
  hasSolution = !!sections.solution;
  !!sections.content || !!sections.main;
  showSolution = false;
  $$payload.out += `<div class="content-viewer bg-surface dark:bg-surface-dark text-text dark:text-text-light p-4 sm:p-6 lg:p-8 rounded-squircle shadow-card flex flex-col h-full overflow-hidden">`;
  if (item) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="flex-shrink-0 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700"><div class="flex items-center justify-between"><h2 class="text-xl sm:text-2xl font-jakarta font-semibold text-text dark:text-text-light truncate pr-4">${escape_html(item.title)}</h2> <div class="flex items-center space-x-2"><button class="text-cherry-600 hover:text-cherry-700 dark:hover:text-cherry-400 transition-colors p-1 rounded-full" aria-label="View full details">`;
    Icon($$payload, { icon: "mdi:open-in-new", class: "w-5 h-5" });
    $$payload.out += `<!----></button> <button class="text-gray-400 hover:text-cherry-600 dark:hover:text-cherry-400 transition-colors p-1 rounded-full -mr-1" aria-label="Close viewer">`;
    Icon($$payload, { icon: "mdi:close", class: "w-6 h-6" });
    $$payload.out += `<!----></button></div></div> `;
    if (item.category) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<span class="text-sm font-medium text-cherry-700 dark:text-cherry-500 bg-cherry-100 dark:bg-cherry-900/30 px-2.5 py-0.5 rounded-full mt-2 inline-block">${escape_html(item.category)}</span>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> `;
    if (item.tags && item.tags.length > 0) {
      $$payload.out += "<!--[-->";
      const each_array = ensure_array_like(item.tags);
      $$payload.out += `<div class="mt-3 flex flex-wrap gap-2"><!--[-->`;
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let tag = each_array[$$index];
        $$payload.out += `<span class="text-xs font-medium text-secondary-700 dark:text-secondary-300 bg-secondary-100 dark:bg-secondary-900/30 px-2 py-0.5 rounded-full">${escape_html(tag)}</span>`;
      }
      $$payload.out += `<!--]--></div>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></div> <div class="flex-grow overflow-y-auto prose dark:prose-invert prose-cherry lg:prose-lg scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent pr-2 -mr-2">`;
    if (type === "exercise") {
      $$payload.out += "<!--[-->";
      ExerciseMarkdown($$payload, { markdown: sections.content || sections.main });
      $$payload.out += `<!----> `;
      if (hintsArray && hintsArray.length > 0) {
        $$payload.out += "<!--[-->";
        const each_array_1 = ensure_array_like(hintsArray);
        $$payload.out += `<div class="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4"><h3 class="text-lg font-semibold mb-3">Hints</h3> <div class="space-y-3"><!--[-->`;
        for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
          let hint = each_array_1[i];
          $$payload.out += `<div class="hint-container"><button class="flex items-center justify-between w-full p-3 text-left border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"><span class="font-medium">Hint ${escape_html(i + 1)}</span> `;
          Icon($$payload, {
            icon: checkedHints.includes(`hint-${i}`) ? "mdi:chevron-up" : "mdi:chevron-down",
            class: "w-5 h-5"
          });
          $$payload.out += `<!----></button> `;
          if (checkedHints.includes(`hint-${i}`)) {
            $$payload.out += "<!--[-->";
            $$payload.out += `<div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-md mt-1">`;
            MarkdownRenderer($$payload, { content: hint });
            $$payload.out += `<!----></div>`;
          } else {
            $$payload.out += "<!--[!-->";
          }
          $$payload.out += `<!--]--></div>`;
        }
        $$payload.out += `<!--]--></div></div>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--> `;
      if (hasSolution) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<div class="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4"><div class="flex justify-between items-center mb-3"><h3 class="text-lg font-semibold">Solution</h3> <button class="px-3 py-1.5 text-sm font-medium rounded-md bg-cherry-100 dark:bg-cherry-900/30 text-cherry-700 dark:text-cherry-400 hover:bg-cherry-200 dark:hover:bg-cherry-800/50 transition-colors">${escape_html(showSolution ? "Hide Solution" : "Show Solution")}</button></div> `;
        {
          $$payload.out += "<!--[!-->";
        }
        $$payload.out += `<!--]--> `;
        if (showSolution) {
          $$payload.out += "<!--[-->";
          $$payload.out += `<div>`;
          MarkdownRenderer($$payload, { content: sections.solution });
          $$payload.out += `<!----></div>`;
        } else {
          $$payload.out += "<!--[!-->";
        }
        $$payload.out += `<!--]--></div>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]-->`;
    } else if (type === "course") {
      $$payload.out += "<!--[1-->";
      MarkdownRenderer($$payload, { content: sections.content || sections.main });
    } else {
      $$payload.out += "<!--[!-->";
      MarkdownRenderer($$payload, { content: sections.content || sections.main });
    }
    $$payload.out += `<!--]--></div> <div class="flex-shrink-0 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"><div class="flex justify-between items-center mb-2"><button class="flex items-center text-sm font-medium text-cherry-600 dark:text-cherry-400 hover:text-cherry-700 dark:hover:text-cherry-300">`;
    Icon($$payload, {
      icon: "mdi:note-text-outline",
      class: "w-5 h-5 mr-1"
    });
    $$payload.out += `<!----> ${escape_html("Show Notes")}</button> <div class="flex items-center space-x-2"><button${attr_class(`px-3 py-1.5 text-sm font-medium rounded-md ${stringify("bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300")} hover:opacity-90 transition-colors`)}>${escape_html("Mark Complete")}</button> `;
    {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> `;
    {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></div></div> `;
    {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></div> `;
    if (type === "exercise") {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div class="flex-shrink-0 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">`;
      ExerciseRating($$payload, { exerciseId: item.id });
      $$payload.out += `<!----></div>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]-->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div class="flex flex-col items-center justify-center h-full text-center text-text-secondary dark:text-text-secondary-light">`;
    Icon($$payload, {
      icon: "mdi:information-outline",
      class: "w-12 h-12 mb-4 text-gray-400 dark:text-gray-500"
    });
    $$payload.out += `<!----> <p class="text-lg font-medium">Select an item</p> <p class="text-sm">Choose an exercise or course from the list to view its details here.</p></div>`;
  }
  $$payload.out += `<!--]--></div>`;
  bind_props($$props, { item, type, onBack });
  pop();
}
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let selectedCategoryId = "all";
  let searchQuery = "";
  let filteredCourses = [];
  function handleResetSelection() {
    selectedCourse.set(null);
  }
  {
    filteredCourses = store_get($$store_subs ??= {}, "$courseItems", courseItems).filter((course) => {
      const matchesCategory = selectedCategoryId === "all";
      const matchesSearch = true;
      return matchesCategory && matchesSearch;
    });
  }
  const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$courseCategories", courseCategories));
  $$payload.out += `<div class="container mx-auto px-4 py-8"><div class="flex items-center justify-between mb-6"><h1 class="text-2xl font-bold text-gray-900 dark:text-white">Courses</h1> <div class="flex space-x-2"><div class="relative"><input type="text"${attr("value", searchQuery)} placeholder="Search courses..." class="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-cherry-500 focus:border-cherry-500 dark:focus:ring-cherry-400 dark:focus:border-cherry-400"> `;
  Icon($$payload, {
    icon: "mdi:magnify",
    class: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
  });
  $$payload.out += `<!----></div> <select class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-cherry-500 focus:border-cherry-500 dark:focus:ring-cherry-400 dark:focus:border-cherry-400"><option value="all">All Categories</option><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let category = each_array[$$index];
    $$payload.out += `<option${attr("value", category.id)}>${escape_html(category.name)}</option>`;
  }
  $$payload.out += `<!--]--></select></div></div> `;
  if (store_get($$store_subs ??= {}, "$isLoading", isLoading)) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="flex justify-center items-center py-12"><div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cherry-500"></div></div>`;
  } else if (store_get($$store_subs ??= {}, "$error", error)) {
    $$payload.out += "<!--[1-->";
    $$payload.out += `<div class="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-md"><p>${escape_html(store_get($$store_subs ??= {}, "$error", error))}</p></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div class="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4"><div class="md:col-span-2 lg:col-span-3">`;
    if (filteredCourses.length === 0) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div class="flex flex-col items-center justify-center py-12 text-center">`;
      Icon($$payload, {
        icon: "mdi:book-open-page-variant",
        class: "w-16 h-16 text-gray-400 mb-4"
      });
      $$payload.out += `<!----> <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No courses found</h3> <p class="text-gray-600 dark:text-gray-400">Try adjusting your filters or search query.</p></div>`;
    } else {
      $$payload.out += "<!--[!-->";
      const each_array_1 = ensure_array_like(filteredCourses);
      $$payload.out += `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"><!--[-->`;
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let course = each_array_1[$$index_1];
        CourseCard($$payload, {
          course,
          isSelected: store_get($$store_subs ??= {}, "$selectedCourse", selectedCourse)?.id === course.id
        });
      }
      $$payload.out += `<!--]--></div>`;
    }
    $$payload.out += `<!--]--></div> <div class="md:col-span-1 sticky top-4">`;
    ContentViewer($$payload, {
      item: store_get($$store_subs ??= {}, "$selectedCourse", selectedCourse),
      type: "course",
      onBack: handleResetSelection
    });
    $$payload.out += `<!----></div></div>`;
  }
  $$payload.out += `<!--]--></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
//# sourceMappingURL=_page.svelte.js.map
