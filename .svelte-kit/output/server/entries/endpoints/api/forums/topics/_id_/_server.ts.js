import { j as json } from "../../../../../../chunks/index.js";
import { g as getTopic, u as updateTopic, d as deleteTopic } from "../../../../../../chunks/forumService.js";
const GET = async ({ params }) => {
  const topicId = params.id;
  if (!topicId) {
    return json({ error: "Topic ID is required" }, { status: 400 });
  }
  const topic = await getTopic(topicId);
  if (!topic) {
    return json({ error: "Topic not found" }, { status: 404 });
  }
  return json(topic);
};
const PUT = async ({ params, request }) => {
  const topicId = params.id;
  if (!topicId) {
    return json({ error: "Topic ID is required" }, { status: 400 });
  }
  const data = await request.json();
  try {
    await updateTopic(topicId, data);
    return json({ success: true });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
};
const DELETE = async ({ params }) => {
  const topicId = params.id;
  if (!topicId) {
    return json({ error: "Topic ID is required" }, { status: 400 });
  }
  try {
    await deleteTopic(topicId);
    return json({ success: true });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
};
export {
  DELETE,
  GET,
  PUT
};
//# sourceMappingURL=_server.ts.js.map
