import { m as getCategory } from "../../../../../../../chunks/forumService.js";
const load = async ({ params }) => {
  const category = await getCategory(params.id);
  return { category };
};
export {
  load
};
//# sourceMappingURL=_page.server.ts.js.map
