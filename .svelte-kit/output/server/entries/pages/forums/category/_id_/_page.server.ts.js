import { a as getCategories, k as getTopics } from "../../../../../chunks/forumService.js";
import { e as error } from "../../../../../chunks/index.js";
const load = async ({ params }) => {
  const categories = await getCategories();
  const allTopics = await getTopics();
  const topics = allTopics.filter((t) => t.category_id === params.id);
  if (!categories.find((c) => c.id === params.id)) {
    throw error(404, "Category not found");
  }
  return { topics, categories, selectedCategory: params.id };
};
export {
  load
};
//# sourceMappingURL=_page.server.ts.js.map
