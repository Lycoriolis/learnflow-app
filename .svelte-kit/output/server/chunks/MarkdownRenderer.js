import { f as escape_html, g as bind_props, a as pop, p as push } from "./index3.js";
import { y as fallback } from "./utils.js";
import { marked } from "marked";
import DOMPurify from "dompurify";
/* empty css            */
/* empty css                                               */
import { h as html } from "./html.js";
function MarkdownRenderer($$payload, $$props) {
  push();
  let content = fallback($$props["content"], "");
  let htmlContent = "";
  let isLoading = false;
  let hasError = false;
  let errorMessage = "";
  function processMarkdown(markdownContent) {
    if (!markdownContent) return "";
    try {
      return DOMPurify.sanitize(marked.parse(markdownContent, { breaks: true, gfm: true }));
    } catch (err) {
      console.error("Error processing markdown:", err);
      hasError = true;
      errorMessage = err instanceof Error ? err.message : "Unknown error processing markdown";
      return "";
    }
  }
  {
    if (content) {
      if (typeof content === "string") {
        htmlContent = processMarkdown(content);
      } else {
        isLoading = true;
        hasError = false;
        content.then((result) => {
          htmlContent = processMarkdown(result);
        }).catch((err) => {
          console.error("Error resolving content:", err);
          hasError = true;
          errorMessage = err instanceof Error ? err.message : "Failed to load content";
        }).finally(() => {
          isLoading = false;
        });
      }
    } else {
      htmlContent = "";
    }
  }
  $$payload.out += `<div class="markdown-content svelte-1bth7ib">`;
  if (isLoading) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="loading-indicator svelte-1bth7ib"><div class="spinner svelte-1bth7ib"></div> <p class="svelte-1bth7ib">Loading content...</p></div>`;
  } else if (hasError) {
    $$payload.out += "<!--[1-->";
    $$payload.out += `<div class="error-message svelte-1bth7ib"><p class="svelte-1bth7ib">Error: ${escape_html(errorMessage)}</p></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `${html(htmlContent)}`;
  }
  $$payload.out += `<!--]--></div>`;
  bind_props($$props, { content });
  pop();
}
export {
  MarkdownRenderer as M
};
//# sourceMappingURL=MarkdownRenderer.js.map
