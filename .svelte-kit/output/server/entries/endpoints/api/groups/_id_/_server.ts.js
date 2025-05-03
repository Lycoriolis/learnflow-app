import { a as getGroupById } from "../../../../../chunks/groupService.js";
const GET = async ({ params }) => {
  const groupId = params.id;
  if (!groupId) {
    return new Response(JSON.stringify({ error: "Missing group id" }), { status: 400 });
  }
  try {
    const result = await getGroupById(groupId);
    if (!result) {
      return new Response(JSON.stringify({ error: "Group not found" }), { status: 404 });
    }
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: "Failed to fetch group" }), { status: 500 });
  }
};
export {
  GET
};
//# sourceMappingURL=_server.ts.js.map
