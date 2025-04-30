// @ts-nocheck
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getTopicById, getPostsByTopicId } from '$lib/services/forumService';

export const load = async ({ params }: Parameters<PageServerLoad>[0]) => {
  const topic = await getTopicById(params.id);
  if (!topic) {
    throw error(404, 'Topic not found');
  }
  const posts = await getPostsByTopicId(params.id);
  return { topic, posts };
};