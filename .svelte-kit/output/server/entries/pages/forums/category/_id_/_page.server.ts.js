import { g as getAllCategories, h as getAllTopics } from "../../../../../chunks/forumService.js";
import { e as error } from "../../../../../chunks/index2.js";
const load = async ({ params }) => {
  const categories = await getAllCategories();
  const allTopics = await getAllTopics();
  const topics = allTopics.filter((t) => t.category === params.id || t.category_id === params.id);
  if (!categories.find((c) => c.id === params.id)) {
    throw error(404, "Category not found");
  }
  return { topics, categories, selectedCategory: params.id };
};
export {
  load
};
