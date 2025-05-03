import { e as error } from "../../../../../chunks/index.js";
import { a as getCategories, k as getTopics } from "../../../../../chunks/forumService.js";
const load = async ({ params }) => {
  const categories = await getCategories();
  const allTopics = await getTopics();
  const topics = allTopics.filter((topic) => topic.tags?.includes(params.tag));
  if (!topics || topics.length === 0) {
    throw error(404, "Tag not found or no topics");
  }
  return { topics, categories, selectedTag: params.tag };
};
export {
  load
};
//# sourceMappingURL=_page.server.ts.js.map
