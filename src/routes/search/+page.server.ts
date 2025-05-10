// src/routes/search/+page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
  // We can do server-side optimizations here if needed
  // For now, we'll handle everything client-side
  return {
    // Initial search parameters if needed
    initialQuery: url.searchParams.get('q') || ''
  };
};
