import { persistentStore } from './persistentStore.js';

// Store list of subscribed topic IDs
export const subscribedTopics = persistentStore<string[]>('learnflow-subscribed-topics', []);