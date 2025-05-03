import { u as updateTopic, d as deleteTopic } from "../../../../../../chunks/forumService.js";
import { g as getTopic, c as createPost } from "../../../../../../chunks/topicService.js";
const PUT = async ({ request, params }) => {
  const topicId = params.id;
  const data = await request.json();
  try {
    const updatedTopic = await updateTopic(topicId, {
      title: data.title,
      content: data.content,
      category_id: data.category_id,
      is_pinned: data.is_pinned,
      is_locked: data.is_locked
    });
    if (updatedTopic === null) {
      return new Response(JSON.stringify({ message: "Topic not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify(updatedTopic), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error updating topic:", error);
    return new Response(JSON.stringify({ message: "Failed to update topic" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const DELETE = async ({ params }) => {
  const topicId = params.id;
  try {
    const success = await deleteTopic(topicId);
    if (success === false) {
      return new Response(JSON.stringify({ message: "Topic not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ message: "Topic deleted successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error deleting topic:", error);
    return new Response(JSON.stringify({ message: "Failed to delete topic" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
async function GET({ params }) {
  const topic = await getTopic(params.id);
  return new Response(JSON.stringify(topic));
}
async function POST({ params, request }) {
  const data = await request.json();
  const newPost = await createPost(params.id, data);
  return new Response(JSON.stringify(newPost));
}
export {
  DELETE,
  GET,
  POST,
  PUT
};
//# sourceMappingURL=_server.ts.js.map
