import { b as attr, f as escape_html, g as bind_props, a as pop, p as push } from "../../../../../../../chunks/index3.js";
import { m as getCategory } from "../../../../../../../chunks/forumService.js";
function _page($$payload, $$props) {
  push();
  let category = { name: "", description: "" };
  let params = $$props["params"];
  async function loadCategory(id) {
    category = await getCategory(id) || { name: "", description: "" };
  }
  loadCategory(params.id);
  $$payload.out += `<form><input${attr("value", category.name)} placeholder="Category Name"> <textarea placeholder="Description">`;
  const $$body = escape_html(category.description);
  if ($$body) {
    $$payload.out += `${$$body}`;
  }
  $$payload.out += `</textarea> <button type="submit">Save</button></form>`;
  bind_props($$props, { params });
  pop();
}
export {
  _page as default
};
//# sourceMappingURL=_page.svelte.js.map
