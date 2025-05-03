import { listContent } from '$lib/services/contentService';

export async function GET({ params }: { params: Record<string, string> }) {
    const categoryIdentifier = params?.categoryId;
    if (!categoryIdentifier) {
        return new Response('Missing category identifier', { status: 400 });
    }
    const contentList = await listContent('course', categoryIdentifier);
    return new Response(JSON.stringify(contentList), { status: 200 });
}