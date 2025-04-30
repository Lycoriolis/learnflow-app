import { g as getAllCategories, n as getTopic } from "../../../../../../../chunks/forumService.js";
const load = async ({ params }) => {
  const categories = await getAllCategories();
  const topic = await getTopic(params.id);
  return { topic, categories };
};
export {
  load
};
