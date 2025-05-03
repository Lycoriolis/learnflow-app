import { k as getTopics, l as createForumTopic, u as updateTopic, d as deleteTopic } from "../../../../../chunks/forumService.js";
const GET = async ({ url }) => {
  const categoryId = url.searchParams.get("categoryId");
  let topics;
  try {
    topics = await getTopics();
    if (categoryId) {
      topics = topics.filter((t) => t.categoryId === categoryId);
    }
    return new Response(JSON.stringify(topics), { status: 200 });
  } catch (error) {
    console.error("Error fetching topics:", error);
    return new Response("Failed to fetch topics", { status: 500 });
  }
};
const POST = async ({ request }) => {
  const { title, categoryId, authorId, content } = await request.json();
  if (!title || !categoryId || !authorId || !content) {
    const missing = [];
    if (!title) missing.push("title");
    if (!categoryId) missing.push("categoryId");
    if (!authorId) missing.push("authorId");
    if (!content) missing.push("content");
    return new Response(`Missing required fields: ${missing.join(", ")}`, { status: 400 });
  }
  try {
    const newTopic = await createForumTopic({ title, categoryId, authorId, content });
    return new Response(JSON.stringify(newTopic), { status: 201 });
  } catch (error) {
    console.error("Error creating topic:", error);
    return new Response("Failed to create topic", { status: 500 });
  }
};
const PUT = async ({ request }) => {
  const { id, ...data } = await request.json();
  if (!id) {
    return new Response("Topic ID is required", { status: 400 });
  }
  try {
    const topic = await updateTopic(id, data);
    if (topic === null) {
      return new Response("Topic not found", { status: 404 });
    }
    return new Response(JSON.stringify(topic), { status: 200 });
  } catch (error) {
    console.error("Error updating topic:", error);
    return new Response("Failed to update topic", { status: 500 });
  }
};
const DELETE = async ({ url }) => {
  const id = url.searchParams.get("id");
  if (!id) {
    return new Response("Topic ID is required", { status: 400 });
  }
  try {
    const result = await deleteTopic(id);
    if (result === false) {
      return new Response("Topic not found", { status: 404 });
    }
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error deleting topic:", error);
    return new Response("Failed to delete topic", { status: 500 });
  }
};
export {
  DELETE,
  GET,
  POST,
  PUT
};
//# sourceMappingURL=_server.ts.js.map
