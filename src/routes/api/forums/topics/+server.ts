import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// TODO: Replace with actual database fetching logic
const dummyTopics = [
  { id: '1', title: 'Welcome to the Forums!', author: 'Admin', createdAt: new Date().toISOString(), postCount: 2 },
  { id: '2', title: 'SvelteKit Discussion', author: 'User123', createdAt: new Date(Date.now() - 86400000).toISOString(), postCount: 5 }, // 1 day ago
  { id: '3', title: 'Need help with Tailwind CSS', author: 'NewDev', createdAt: new Date(Date.now() - 172800000).toISOString(), postCount: 3 }, // 2 days ago
];

export const GET: RequestHandler = async () => {
  // In a real application, you would fetch this data from your database
  // const topics = await db.select(...);
  try {
    // Simulate fetching data
    const topics = dummyTopics;
    return json(topics);
  } catch (error) {
    console.error('Error fetching forum topics:', error);
    return json({ error: 'Failed to fetch topics' }, { status: 500 });
  }
};

// Handle POST requests to create a new topic
export const POST: RequestHandler = async ({ request }) => {
  try {
    const newTopicData = await request.json();

    // Basic validation (can be more robust)
    if (!newTopicData.title || !newTopicData.content) {
      return json({ error: 'Title and content are required' }, { status: 400 });
    }

    // TODO: Replace with actual database insertion logic
    // const createdTopic = await db.insert(...);

    // Simulate database insertion and adding an ID
    const createdTopic = {
      ...newTopicData,
      id: Math.random().toString(36).substring(2, 9), // Generate a simple unique ID
      postCount: 1, // Initial post count
      createdAt: new Date().toISOString() // Ensure server sets the creation time
    };

    // Add to our dummy list (for simulation purposes)
    dummyTopics.unshift(createdTopic);

    console.log('New topic created (simulated):', createdTopic);

    return json(createdTopic, { status: 201 }); // Return the created topic

  } catch (error) {
    console.error('Error creating forum topic:', error);
    if (error instanceof SyntaxError) {
      return json({ error: 'Invalid JSON payload' }, { status: 400 });
    }
    return json({ error: 'Failed to create topic' }, { status: 500 });
  }
};