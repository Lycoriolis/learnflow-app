import type { Topic } from '../types/forum';

export function filterTopicsByCategory(topics: Topic[], categoryId: string) {
    return topics.filter((topic) => topic.categoryId === categoryId);
}

export function validateTopicData(topic: Partial<Topic>): topic is Topic {
    // Ensure all required fields are present
    return !!(
        topic.id &&
        topic.title &&
        topic.content !== undefined &&
        topic.categoryId &&
        topic.createdAt !== undefined // Changed to check for undefined
        // ...other required fields...
    );
}
