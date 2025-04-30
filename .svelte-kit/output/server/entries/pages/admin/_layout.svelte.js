import { P as slot, M as bind_props } from "../../../chunks/index.js";
function _layout($$payload, $$props) {
  let data = $$props["data"];
  $$payload.out += `<div class="min-h-screen bg-gray-50 dark:bg-gray-900"><!---->`;
  slot($$payload, $$props, "default", {});
  $$payload.out += `<!----></div>`;
  bind_props($$props, { data });
}
export {
  _layout as default
};
