import { a as adminDb } from "../../../../../chunks/firebaseAdmin.js";
async function deleteTopic(topicId) {
  await adminDb.collection("topics").doc(topicId).delete();
}
async function DELETE({ params }) {
  const topicId = params?.id;
  if (!topicId) {
    return new Response("Missing topicId", { status: 400 });
  }
  await deleteTopic(topicId);
  return new Response("Topic deleted", { status: 200 });
}
export {
  DELETE
};
//# sourceMappingURL=_server.ts.js.map
