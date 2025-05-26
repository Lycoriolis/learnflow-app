import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url }) => {
  // Get the current tab from the URL query parameter
  const tab = url.searchParams.get('tab') || 'overview';
  return { tab };
};
