import { a as getCategories, g as getTopic } from "../../../../../../../chunks/forumService.js";
const load = async ({ params }) => {
  const categories = await getCategories();
  const topic = await getTopic(params.id);
  return { topic, categories };
};
export {
  load
};
//# sourceMappingURL=_page.server.ts.js.map
