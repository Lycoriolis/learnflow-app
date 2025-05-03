import { adminDb } from '$lib/server/firebaseAdmin';

/**
 * Deletes a topic document from Firestore.
 * @param topicId - The ID of the topic to delete.
 */
export async function deleteTopic(topicId: string): Promise<void> {
  await adminDb.collection('topics').doc(topicId).delete();
}
