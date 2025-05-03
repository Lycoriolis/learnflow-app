import { filterTopicsByCategory, validateTopicData } from '../../src/utils/forumUtils';

describe('filterTopicsByCategory', () => {
    it('filters topics by categoryId', () => {
        const topics = [
            { id: '1', title: 'A', content: '', categoryId: 'cat1', createdAt: '' },
            { id: '2', title: 'B', content: '', categoryId: 'cat2', createdAt: '' }
        ];
        expect(filterTopicsByCategory(topics, 'cat1')).toHaveLength(1);
    });
});

describe('validateTopicData', () => {
    it('returns true for valid topic', () => {
        const topic = { id: '1', title: 'A', content: '', categoryId: 'cat1', createdAt: '' };
        expect(validateTopicData(topic)).toBe(true);
    });
    it('returns false for missing fields', () => {
        const topic = { id: '1', title: 'A', content: '', categoryId: 'cat1' };
        expect(validateTopicData(topic)).toBe(false);
    });
});
