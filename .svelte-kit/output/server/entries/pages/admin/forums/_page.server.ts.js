import { k as getTopics, a as getCategories } from "../../../../chunks/forumService.js";
const load = async () => {
  const topics = await getTopics();
  const categories = await getCategories();
  return { topics, categories };
};
export {
  load
};
//# sourceMappingURL=_page.server.ts.js.map
