import { h as head, f as escape_html, g as bind_props, a as pop, p as push } from "../../chunks/index3.js";
function _error($$payload, $$props) {
  push();
  let error = $$props["error"], status = $$props["status"];
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>${escape_html(status)} - Something went wrong</title>`;
  });
  $$payload.out += `<div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 p-4"><h1 class="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">${escape_html(status)}</h1> <p class="text-lg text-gray-600 dark:text-gray-300 mb-6">${escape_html(error?.message ?? "An unknown error occurred")}</p> <a href="/" class="btn btn-primary">Go Home</a></div>`;
  bind_props($$props, { error, status });
  pop();
}
export {
  _error as default
};
//# sourceMappingURL=_error.svelte.js.map
