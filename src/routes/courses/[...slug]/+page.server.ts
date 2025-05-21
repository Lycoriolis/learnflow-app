import type { PageServerLoad } from './$types';
import { getContentByResolvedPath } from '$lib/server/contentService';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
    // params.slug will be the path segments, e.g., "maths/mpsi-maths/raisonnement-et-vocabulaire-ensembliste"
    const fullSlug = `courses/${params.slug}`; // Prepend "courses/" to match structure in static/content
    
    console.log(`[courses/...slug page.server.ts] Loading content for slug: ${params.slug}, resolved to: ${fullSlug}`);
    const content = await getContentByResolvedPath(fullSlug);

    if (content) {
        return {
            contentItem: content,
            pageType: content.type || 'lesson' // or derive from frontmatter
        };
    }

    throw error(404, `Content not found for path: ${params.slug}`);
};
