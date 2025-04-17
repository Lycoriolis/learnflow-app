import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// In-memory store for dummy topics (replace with database logic)
let dummyTopics = [
  { id: '1', title: 'Welcome to the Forums!', author: 'Admin', createdAt: new Date().toISOString(), postCount: 2 },
  { id: '2', title: 'SvelteKit Discussion', author: 'User123', createdAt: new Date(Date.now() - 86400000).toISOString(), postCount: 5 }, // 1 day ago
  { id: '3', title: 'Need help with Tailwind CSS', author: 'NewDev', createdAt: new Date(Date.now() - 172800000).toISOString(), postCount: 3 }, // 2 days ago
];

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { title, author } = await request.json();

    if (!title || !author) {
      return json({ error: 'Title and author are required' }, { status: 400 });
    }

    // Simulate adding to database
    const newTopic = {
      id: String(dummyTopics.length + 1),
      title,
      author, // In a real app, get the logged-in user
      createdAt: new Date().toISOString(),
      postCount: 0, // New topics start with 0 posts
    };
    dummyTopics.push(newTopic);

    console.log('New topic created:', newTopic);
    // In a real app, you would insert this into your database
    // const createdTopic = await db.insert(...);

    return json(newTopic, { status: 201 }); // Return the created topic
  } catch (error) {
    console.error('Error creating forum topic:', error);
    return json({ error: 'Failed to create topic' }, { status: 500 });
  }
};

// Optional: GET handler to return the current list (useful for debugging or if needed elsewhere)
export const GET: RequestHandler = async () => {
  try {
    return json(dummyTopics);
  } catch (error) {
    console.error('Error fetching forum topics:', error);
    return json({ error: 'Failed to fetch topics' }, { status: 500 });
  }
};