import { e as error } from "../../../../../chunks/index2.js";
import { g as getAllCategories, h as getAllTopics } from "../../../../../chunks/forumService.js";
const load = async ({ params }) => {
  const categories = await getAllCategories();
  const allTopics = await getAllTopics();
  const topics = allTopics.filter((t) => t.tags?.includes(params.tag));
  if (!topics) {
    throw error(404, "Tag not found or no topics");
  }
  return { topics, categories, selectedTag: params.tag };
};
export {
  load
};
