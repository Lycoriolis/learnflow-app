import { f as getPostsByTopicId, h as createPost, i as updatePost, j as deletePost } from "../../../../../chunks/forumService.js";
const GET = async ({ url }) => {
  const topicId = url.searchParams.get("topic_id");
  if (!topicId) {
    return new Response("Topic ID is required", { status: 400 });
  }
  try {
    const posts = await getPostsByTopicId(topicId);
    return new Response(JSON.stringify(posts), { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return new Response("Failed to fetch posts", { status: 500 });
  }
};
const POST = async ({ request }) => {
  const { topic_id, author_id, content } = await request.json();
  if (!topic_id || !author_id || !content) {
    return new Response("Missing required fields", { status: 400 });
  }
  try {
    const post = await createPost({ topic_id, author_id, content });
    return new Response(JSON.stringify(post), { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return new Response("Failed to create post", { status: 500 });
  }
};
const PUT = async ({ request }) => {
  const { id, content } = await request.json();
  if (!id || !content) {
    return new Response("Missing required fields", { status: 400 });
  }
  try {
    const post = await updatePost(id, content);
    if (post === null) {
      return new Response("Post not found", { status: 404 });
    }
    return new Response(JSON.stringify(post), { status: 200 });
  } catch (error) {
    console.error("Error updating post:", error);
    return new Response("Failed to update post", { status: 500 });
  }
};
const DELETE = async ({ url }) => {
  const id = url.searchParams.get("id");
  if (!id) {
    return new Response("Post ID is required", { status: 400 });
  }
  try {
    const result = await deletePost(id);
    if (result === false) {
      return new Response("Post not found", { status: 404 });
    }
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error deleting post:", error);
    return new Response("Failed to delete post", { status: 500 });
  }
};
export {
  DELETE,
  GET,
  POST,
  PUT
};
//# sourceMappingURL=_server.ts.js.map
