import { g as bind_props, e as ensure_array_like, b as attr, f as escape_html, a as pop, p as push } from "./index3.js";
import { M as MarkdownRenderer } from "./MarkdownRenderer.js";
import { y as fallback } from "./utils.js";
import "firebase/auth";
import "firebase/firestore";
import { I as Icon } from "./Icon.js";
function ExerciseMarkdown($$payload, $$props) {
  let markdown = fallback($$props["markdown"], "");
  let processedMarkdown = markdown;
  function processMathAndCode(text) {
    let processed = text.replace(/\$\$(.*?)\$\$/g, (match, p1) => {
      return `<div class="math-block">${p1}</div>`;
    });
    processed = processed.replace(/\$(.*?)\$/g, (match, p1) => {
      return `<span class="math-inline">${p1}</span>`;
    });
    processed = processed.replace(/```exercise([\s\S]*?)```/g, (match, p1) => {
      return `<div class="code-exercise-container">
\`\`\`${p1}\`\`\`
</div>`;
    });
    return processed;
  }
  processedMarkdown = processMathAndCode(markdown);
  $$payload.out += `<div class="exercise-markdown svelte-1y8xbh2">`;
  MarkdownRenderer($$payload, { content: processedMarkdown });
  $$payload.out += `<!----></div>`;
  bind_props($$props, { markdown });
}
function ExerciseRating($$payload, $$props) {
  push();
  let exerciseId = $$props["exerciseId"];
  let userRating = null;
  let isSubmitted = false;
  $$payload.out += `<div class="exercise-rating"><h3 class="text-lg font-semibold mb-2">Rate this exercise</h3> `;
  {
    $$payload.out += "<!--[-->";
    const each_array = ensure_array_like(Array(5));
    $$payload.out += `<div class="flex flex-col space-y-4"><div class="flex items-center space-x-1"><!--[-->`;
    for (let i = 0, $$length = each_array.length; i < $$length; i++) {
      each_array[i];
      $$payload.out += `<button class="text-2xl focus:outline-none"${attr("disabled", isSubmitted, true)}>`;
      Icon($$payload, {
        icon: "mdi:star-outline",
        class: "text-gray-400 hover:text-yellow-400",
        width: "28",
        height: "28"
      });
      $$payload.out += `<!----></button>`;
    }
    $$payload.out += `<!--]--></div> <div><button class="text-sm text-cherry-600 dark:text-cherry-400 hover:underline">${escape_html("Add feedback (optional)")}</button> `;
    {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></div> <div><button${attr("disabled", userRating === null, true)} class="px-4 py-2 text-sm font-medium rounded-md bg-cherry-600 text-white hover:bg-cherry-700 dark:bg-cherry-500 dark:hover:bg-cherry-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Submit Rating</button></div></div>`;
  }
  $$payload.out += `<!--]--></div>`;
  bind_props($$props, { exerciseId });
  pop();
}
export {
  ExerciseMarkdown as E,
  ExerciseRating as a
};
//# sourceMappingURL=ExerciseRating.js.map
