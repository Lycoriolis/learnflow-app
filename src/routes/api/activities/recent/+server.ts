import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { getRecentActivities } from '$lib/services/activityService.js';

function getUserId(event: RequestEvent): string | null {
  return event.locals?.user?.uid || null;
}

export const GET = async (event: RequestEvent) => {
  const userId = getUserId(event);
  if (!userId) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const limit = Number(event.url.searchParams.get('limit')) || 10;
    const activities = await getRecentActivities(userId, limit);
    return json(activities);
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    return json({ error: 'Failed to fetch activities' }, { status: 500 });
  }
};