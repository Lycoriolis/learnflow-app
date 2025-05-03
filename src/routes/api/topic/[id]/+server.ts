import { deleteTopic } from '$lib/server/database';

export async function DELETE({ params }: { params: Record<string, string> }) {
    const topicId = params?.id;
    if (!topicId) {
        return new Response('Missing topicId', { status: 400 });
    }
    await deleteTopic(topicId!);
    return new Response('Topic deleted', { status: 200 });
}