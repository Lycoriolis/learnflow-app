import axios from 'axios';
import { API_URL } from '../config';
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
    // ...implementation...
}

export async function updateCategory(/* params */) {
    // ...implementation...
}

export async function getPostsByTopicId(topicId: string) {
    // ...implementation...
}

export type { Topic, Category };