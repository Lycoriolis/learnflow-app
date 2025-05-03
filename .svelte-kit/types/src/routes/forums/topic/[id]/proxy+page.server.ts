// @ts-nocheck
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getTopic, getPostsByTopicId } from '$lib/services/forums/forumService';

export const load = async ({ params }: Parameters<PageServerLoad>[0]) => {
  const topic = await getTopic(params.id);
  if (!topic) {
    throw error(404, 'Topic not found');
  }
  const posts = await getPostsByTopicId(params.id);
  return { topic, posts };
};