import type { RequestHandler } from '@sveltejs/kit';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

export const GET: RequestHandler = async () => {
  const exercisesDir = path.join(process.cwd(), 'static', 'content', 'exercises');
  try {
    const files = await fs.readdir(exercisesDir);
    const items = await Promise.all(
      files.filter(f => f.endsWith('.md')).map(async (file) => {
        const id = file.replace(/\.md$/, '');
        const filePath = path.join(exercisesDir, file);
        const raw = await fs.readFile(filePath, 'utf8');
        const parsed = matter(raw);
        const data = parsed.data as Record<string, any>;
        return {
          id,
          slug: id,
          type: 'exercise',
          title: data.title || id,
          description: data.description,
          tags: data.tags || [],
          difficulty: data.difficulty,
          estimatedTime: data.estimatedTime
        };
      })
    );
    return new Response(JSON.stringify(items), { headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('Error listing exercises:', err);
    return new Response(JSON.stringify([]), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};