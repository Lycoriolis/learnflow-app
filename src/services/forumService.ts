import axios from 'axios';
import { API_URL } from '$env/dynamic/public';
import { Topic, Category } from '../types/forum';

export async function getTopics() {
    const response = await axios.get(`${API_URL}/topics`);
    return response.data;
}

export async function getTopicById(topicId: string) {
    const response = await axios.get(`${API_URL}/topics/${topicId}`);
    return response.data;
}

export async function createTopic(topicData: Topic) {
    const response = await axios.post(`${API_URL}/topics`, topicData);
    return response.data;
}

export async function updateTopic(topicId: string, topicData: Topic) {
    const response = await axios.put(`${API_URL}/topics/${topicId}`, topicData);
    return response.data;
}

export async function deleteTopic(topicId: string) {
    const response = await axios.delete(`${API_URL}/topics/${topicId}`);
    return response.data;
}

export async function getCategories() {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
}

export async function createCategory(/* params */) {
    console.warn('createCategory not implemented');
    throw new Error('createCategory not implemented');
}

export async function updateCategory(/* params */) {
    console.warn('updateCategory not implemented');
    throw new Error('updateCategory not implemented');
}

export async function getPostsByTopicId(topicId: string) {
    console.warn('getPostsByTopicId called with', topicId);
    throw new Error('getPostsByTopicId not implemented');
}

// Note: re-export if needed
export type { Topic, Category };