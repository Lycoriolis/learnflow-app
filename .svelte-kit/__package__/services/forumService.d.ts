/**
 * Fetches a topic by its ID from the database.
 * @param {string} topicId The ID of the topic to fetch.
 * @returns {Promise<object|null>} The topic data or null if not found.
 */
export declare function getTopicById(topicId: string): Promise<any>;
/**
 * Get a specific topic by ID - alias for getTopicById for consistent API
 */
export declare function getTopic(id: string): Promise<any>;
/**
 * Updates a forum topic
 */
export declare function updateTopic(id: string, data: {
    title?: string;
    content?: string;
    category_id?: string;
    is_pinned?: boolean;
    is_locked?: boolean;
}): Promise<any>;
/**
 * Deletes a forum topic and all its posts
 */
export declare function deleteTopic(id: string): Promise<boolean>;
/**
 * Fetches a list of all topics from the database.
 * @returns {Promise<object[]>} A list of topics.
 */
export declare function getAllTopics(): Promise<any[]>;
/**
 * Fetches a list of all forum categories from the database.
 * @returns {Promise<object[]>} A list of categories.
 */
export declare function getAllCategories(): Promise<any[]>;
/**
 * Fetches all posts for a given forum topic from the database.
 * @param {string} topicId The ID of the topic to fetch posts for.
 * @returns {Promise<object[]>} A list of posts.
 */
export declare function getPostsByTopicId(topicId: string): Promise<any[]>;
/**
 * Updates a forum category
 */
export declare function updateCategory(id: string, data: {
    name?: string;
    description?: string;
    icon?: string;
    color?: string;
}): Promise<any>;
/**
 * Creates a new forum category
 */
export declare function createCategory(data: {
    name: string;
    description: string;
    icon: string;
    color: string;
}): Promise<any>;
/**
 * Deletes a forum category
 * Note: This will fail if there are topics in this category
 */
export declare function deleteCategory(id: string): Promise<boolean>;
/**
 * Get a specific category by ID
 */
export declare function getCategory(id: string): Promise<any>;
/**
 * Creates a new forum post
 */
export declare function createPost(data: {
    topic_id: string;
    author_id: string;
    content: string;
}): Promise<any>;
/**
 * Updates a forum post
 */
export declare function updatePost(id: string, content: string): Promise<any>;
/**
 * Deletes a forum post
 */
export declare function deletePost(id: string): Promise<boolean>;
/**
 * Creates a new forum topic with an initial post
 */
export declare function createTopic(data: {
    title: string;
    content: string;
    category_id: string;
    author_id: string;
}): Promise<any>;
/**
 * Handles voting on a forum topic
 */
export declare function handleTopicVote(topicId: string, userId: string, voteType: 1 | -1): Promise<{
    upvotes: number;
    downvotes: number;
    userVote: 1 | -1;
}>;
