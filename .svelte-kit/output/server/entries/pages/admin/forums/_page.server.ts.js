import { h as getAllTopics, g as getAllCategories } from "../../../../chunks/forumService.js";
const load = async () => {
  const topics = await getAllTopics();
  const categories = await getAllCategories();
  return { topics, categories };
};
export {
  load
};
