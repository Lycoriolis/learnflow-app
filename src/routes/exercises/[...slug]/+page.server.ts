import { error } from '@sveltejs/kit';
import { getExerciseBySlug } from '$lib/server/contentService'; // Changed import

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  const slug = params.slug;
  console.log(`[exercises/...slug/+page.server.ts] Loading exercise for slug: ${slug}`);

  try {
    const exercise = await getExerciseBySlug(slug); // Changed to call the imported function directly

    if (!exercise) {
      console.warn(`[exercises/...slug/+page.server.ts] Exercise not found for slug: ${slug}`);
      throw error(404, {
        message: `Exercise not found. Could not find content for slug: ${slug}`
      });
    }

    console.log(`[exercises/...slug/+page.server.ts] Exercise data loaded for slug: ${slug}`, JSON.stringify(exercise, null, 2));
    return {
      exercise,
      slug,
      seo: {
        title: exercise.frontmatter?.title || exercise.title || 'Exercise', // Added exercise.title as a fallback
        description: exercise.frontmatter?.description || exercise.description || 'Interactive exercise to practice your skills.', // Added exercise.description
      }
    };
  } catch (e) {
    console.error(`[exercises/...slug/+page.server.ts] Error loading exercise for slug ${slug}:`, e);
    let message = 'Failed to load exercise.';
    let statusCode = 500;

    if (e instanceof Error) {
        message = e.message;
    }

    // If the error object (e) is an HttpError from SvelteKit, it might have a status and body.
    // @ts-ignore
    if (e && typeof e.status === 'number' && e.body && typeof e.body.message === 'string') {
        // @ts-ignore
        statusCode = e.status;
        // @ts-ignore
        message = e.body.message;
    } 
    // @ts-ignore
    else if (e && typeof e.status === 'number') { // For errors thrown with status but not standard body
        // @ts-ignore
        statusCode = e.status;
    }

    throw error(statusCode, {
        message: message
    });
  }
}
