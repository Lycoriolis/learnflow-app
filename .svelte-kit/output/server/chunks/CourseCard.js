import { d as attr_class, b as attr, f as escape_html, j as stringify, e as ensure_array_like, m as attr_style, g as bind_props, a as pop, p as push } from "./index3.js";
import { y as fallback } from "./utils.js";
import { I as Icon } from "./Icon.js";
import "./client.js";
function CourseCard($$payload, $$props) {
  push();
  let statusClass, statusText;
  let course = $$props["course"];
  let isSelected = fallback($$props["isSelected"], false);
  let isCompleted = fallback($$props["isCompleted"], false);
  let progress = fallback($$props["progress"], 0);
  statusClass = isCompleted ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : progress > 0 ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400";
  statusText = isCompleted ? "Completed" : progress > 0 ? `In Progress (${Math.round(progress)}%)` : "Not Started";
  $$payload.out += `<div role="button" tabindex="0"${attr_class(`course-card relative p-4 rounded-lg border transition-all duration-200 hover:shadow-md mb-4 cursor-pointer ${stringify(isSelected ? "border-cherry-500 bg-cherry-50 dark:bg-cherry-900/20 shadow-md" : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800")}`)}${attr("aria-pressed", isSelected)}${attr("aria-label", `Course card: ${stringify(course.title)}`)}><div class="flex justify-between items-start"><h3 class="text-lg font-medium text-gray-900 dark:text-white mb-1">${escape_html(course.title)}</h3> `;
  if (course.level) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">${escape_html(course.level)}</span>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div> `;
  if (course.description) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<p class="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">${escape_html(course.description)}</p>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <div class="flex flex-wrap gap-2 mb-3">`;
  if (course.category) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cherry-100 dark:bg-cherry-900/30 text-cherry-800 dark:text-cherry-400">${escape_html(course.category)}</span>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  if (course.tags && course.tags.length > 0) {
    $$payload.out += "<!--[-->";
    const each_array = ensure_array_like(course.tags.slice(0, 3));
    $$payload.out += `<!--[-->`;
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let tag = each_array[$$index];
      $$payload.out += `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">${escape_html(tag)}</span>`;
    }
    $$payload.out += `<!--]--> `;
    if (course.tags.length > 3) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">+${escape_html(course.tags.length - 3)} more</span>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]-->`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div> <div class="flex justify-between items-center"><span${attr_class(`inline-flex items-center text-xs ${stringify(statusClass)} px-2.5 py-0.5 rounded-full`)}>${escape_html(statusText)}</span> `;
  if (progress > 0 && !isCompleted) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2" aria-hidden="true"><div class="bg-amber-500 dark:bg-amber-400 h-2 rounded-full"${attr_style(`width: ${stringify(progress)}%`)} role="progressbar"${attr("aria-valuenow", progress)} aria-valuemin="0" aria-valuemax="100"></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <div class="flex items-center space-x-3"><div class="flex items-center space-x-1 text-gray-500 dark:text-gray-400">`;
  if (course.duration) {
    $$payload.out += "<!--[-->";
    Icon($$payload, {
      icon: "mdi:clock-outline",
      class: "w-4 h-4",
      "aria-hidden": "true"
    });
    $$payload.out += `<!----> <span class="text-xs">${escape_html(course.duration)}</span>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div> <button class="text-cherry-600 dark:text-cherry-400 text-xs font-medium hover:underline" aria-label="View course details">View Details</button></div></div> `;
  if (isSelected) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="absolute top-2 right-2 text-cherry-500 dark:text-cherry-400" aria-hidden="true">`;
    Icon($$payload, { icon: "mdi:check-circle", class: "w-5 h-5" });
    $$payload.out += `<!----></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div>`;
  bind_props($$props, { course, isSelected, isCompleted, progress });
  pop();
}
export {
  CourseCard as C
};
//# sourceMappingURL=CourseCard.js.map
