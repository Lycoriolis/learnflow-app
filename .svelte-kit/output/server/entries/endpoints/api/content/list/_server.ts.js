async function listContent(type, categoryIdentifier) {
  return [];
}
async function GET({ params }) {
  const categoryIdentifier = params?.categoryId;
  if (!categoryIdentifier) {
    return new Response("Missing category identifier", { status: 400 });
  }
  const contentList = await listContent();
  return new Response(JSON.stringify(contentList), { status: 200 });
}
export {
  GET
};
//# sourceMappingURL=_server.ts.js.map
