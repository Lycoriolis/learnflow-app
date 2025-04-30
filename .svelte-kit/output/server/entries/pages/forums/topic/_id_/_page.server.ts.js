import { e as error } from "../../../../../chunks/index2.js";
import { o as getTopicById, a as getPostsByTopicId } from "../../../../../chunks/forumService.js";
const load = async ({ params }) => {
  const topic = await getTopicById(params.id);
  if (!topic) {
    throw error(404, "Topic not found");
  }
  const posts = await getPostsByTopicId(params.id);
  return { topic, posts };
};
export {
  load
};
