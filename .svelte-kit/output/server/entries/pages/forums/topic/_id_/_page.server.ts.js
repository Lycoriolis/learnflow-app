import { e as error } from "../../../../../chunks/index.js";
import { g as getTopic, f as getPostsByTopicId } from "../../../../../chunks/forumService.js";
const load = async ({ params }) => {
  const topic = await getTopic(params.id);
  if (!topic) {
    throw error(404, "Topic not found");
  }
  const posts = await getPostsByTopicId(params.id);
  return { topic, posts };
};
export {
  load
};
//# sourceMappingURL=_page.server.ts.js.map
