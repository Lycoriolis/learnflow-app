import { g as getAllGroups, c as createGroup } from "../../../../chunks/groupService.js";
function getUserId(event) {
  return event.locals?.user?.uid || null;
}
const GET = async (event) => {
  const userId = getUserId(event);
  try {
    const groups = await getAllGroups(userId);
    return new Response(JSON.stringify(groups), { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response("Failed to fetch groups", { status: 500 });
  }
};
const POST = async (event) => {
  const userId = getUserId(event);
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  try {
    const { name, description, topic, image, is_public } = await event.request.json();
    if (!name || !description || !topic) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }
    const group = await createGroup({
      name,
      description,
      topic,
      image,
      is_public,
      created_by: userId
    });
    return new Response(JSON.stringify(group), { status: 201 });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: "Failed to create group" }), { status: 500 });
  }
};
export {
  GET,
  POST
};
//# sourceMappingURL=_server.ts.js.map
