import { vi, describe, it, expect, beforeEach, SpyInstance } from 'vitest';
import { 
  createCategory, 
  updateCategory, 
  createTopic, 
  updateTopic, 
  createPost, 
  updatePost, 
  toggleLike 
} from '../forumService'; // Adjust path as needed
import { serverTimestamp as mockServerTimestamp } from 'firebase/firestore';

// Mock Firestore functions
vi.mock('firebase/firestore', async (importOriginal) => {
  const original = await importOriginal<typeof import('firebase/firestore')>();
  return {
    ...original,
    addDoc: vi.fn(),
    updateDoc: vi.fn(),
    setDoc: vi.fn(),
    deleteDoc: vi.fn(),
    getDoc: vi.fn(),
    getDocs: vi.fn(),
    doc: vi.fn(),
    collection: vi.fn(),
    serverTimestamp: vi.fn(() => 'MOCK_SERVER_TIMESTAMP'), // Mock serverTimestamp to return a specific value
    increment: vi.fn(val => `MOCK_INCREMENT_${val}`),
  };
});

// Helper to get the mocked functions with correct types
const mockAddDoc = vi.mocked(await import('firebase/firestore').then(mod => mod.addDoc));
const mockUpdateDoc = vi.mocked(await import('firebase/firestore').then(mod => mod.updateDoc));
const mockSetDoc = vi.mocked(await import('firebase/firestore').then(mod => mod.setDoc));
const mockGetDoc = vi.mocked(await import('firebase/firestore').then(mod => mod.getDoc));
const mockDeleteDoc = vi.mocked(await import('firebase/firestore').then(mod => mod.deleteDoc));

describe('forumService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Setup default mock implementations if needed, e.g., for doc() or collection()
    vi.mocked(await import('firebase/firestore').then(mod => mod.doc)).mockReturnValue({ id: 'mockDocRef' } as any);
    vi.mocked(await import('firebase/firestore').then(mod => mod.collection)).mockReturnValue({ id: 'mockCollectionRef' } as any);

  });

  describe('Timestamp Standardization', () => {
    it('createCategory should use serverTimestamp for createdAt and updatedAt', async () => {
      mockAddDoc.mockResolvedValueOnce({ id: 'newCategoryId' } as any);
      const categoryData = { name: 'Test Category', description: 'Test Desc' };
      await createCategory(categoryData);

      expect(mockAddDoc).toHaveBeenCalledTimes(1);
      const calledWith = mockAddDoc.mock.calls[0][1]; // Second argument to addDoc
      expect(calledWith).toMatchObject({
        ...categoryData,
        topicCount: 0,
        createdAt: 'MOCK_SERVER_TIMESTAMP',
        updatedAt: 'MOCK_SERVER_TIMESTAMP',
      });
    });

    it('updateCategory should use serverTimestamp for updatedAt', async () => {
      mockUpdateDoc.mockResolvedValueOnce(undefined);
      const categoryUpdateData = { description: 'Updated Desc' };
      await updateCategory('categoryId1', categoryUpdateData);

      expect(mockUpdateDoc).toHaveBeenCalledTimes(1);
      const calledWith = mockUpdateDoc.mock.calls[0][1]; // Second argument to updateDoc
      expect(calledWith).toMatchObject({
        ...categoryUpdateData,
        updatedAt: 'MOCK_SERVER_TIMESTAMP',
      });
    });

    it('createTopic should use serverTimestamp for lastPostAt, createdAt, and updatedAt', async () => {
      mockAddDoc.mockResolvedValueOnce({ id: 'newTopicId' } as any);
      const topicData = { categoryId: 'cat1', title: 'Test Topic', authorId: 'user1' };
      await createTopic(topicData);

      expect(mockAddDoc).toHaveBeenCalledTimes(1);
      const calledWith = mockAddDoc.mock.calls[0][1];
      expect(calledWith).toMatchObject({
        ...topicData,
        postCount: 0,
        viewCount: 0,
        lastPostAt: 'MOCK_SERVER_TIMESTAMP',
        createdAt: 'MOCK_SERVER_TIMESTAMP',
        updatedAt: 'MOCK_SERVER_TIMESTAMP',
      });
    });

    it('updateTopic should use serverTimestamp for updatedAt', async () => {
      mockUpdateDoc.mockResolvedValueOnce(undefined);
      const topicUpdateData = { title: 'Updated Topic Title' };
      await updateTopic('topicId1', topicUpdateData);

      expect(mockUpdateDoc).toHaveBeenCalledTimes(1);
      const calledWith = mockUpdateDoc.mock.calls[0][1];
      expect(calledWith).toMatchObject({
        ...topicUpdateData,
        updatedAt: 'MOCK_SERVER_TIMESTAMP',
      });
    });

    it('createPost should use serverTimestamp for created_at, updated_at, and update topic lastPostAt', async () => {
      mockAddDoc.mockResolvedValueOnce({ id: 'newPostId' } as any);
      mockUpdateDoc.mockResolvedValueOnce(undefined); // For topic update

      const postData = { topic_id: 'topic1', author_id: 'user1', content: 'Test post content' };
      await createPost(postData);

      expect(mockAddDoc).toHaveBeenCalledTimes(1);
      const postCallData = mockAddDoc.mock.calls[0][1];
      expect(postCallData).toMatchObject({
        ...postData,
        likes: 0,
        created_at: 'MOCK_SERVER_TIMESTAMP',
        updated_at: 'MOCK_SERVER_TIMESTAMP',
      });

      expect(mockUpdateDoc).toHaveBeenCalledTimes(1); // For topic update
      const topicUpdateCallData = mockUpdateDoc.mock.calls[0][1];
      expect(topicUpdateCallData).toEqual({
        lastPostAt: 'MOCK_SERVER_TIMESTAMP',
      });
    });

    it('updatePost should use serverTimestamp for updatedAt and editedAt', async () => {
      mockUpdateDoc.mockResolvedValueOnce(undefined);
      const postUpdateData = { content: 'Updated post content' };
      await updatePost('postId1', postUpdateData);

      expect(mockUpdateDoc).toHaveBeenCalledTimes(1);
      const calledWith = mockUpdateDoc.mock.calls[0][1];
      expect(calledWith).toMatchObject({
        ...postUpdateData,
        updatedAt: 'MOCK_SERVER_TIMESTAMP',
        editedAt: 'MOCK_SERVER_TIMESTAMP',
      });
    });
    
    it('toggleLike (when liking) should use serverTimestamp for createdAt', async () => {
      // Mock getDoc to simulate post not being liked yet
      mockGetDoc.mockResolvedValueOnce({ exists: () => false } as any);
      mockSetDoc.mockResolvedValueOnce(undefined);
      mockUpdateDoc.mockResolvedValueOnce(undefined); // For post likeCount increment

      await toggleLike('postId1', 'userId1');

      expect(mockSetDoc).toHaveBeenCalledTimes(1);
      const likeData = mockSetDoc.mock.calls[0][1]; // Second argument to setDoc
      expect(likeData).toEqual({
        postId: 'postId1',
        userId: 'userId1',
        createdAt: 'MOCK_SERVER_TIMESTAMP',
      });
      expect(mockUpdateDoc).toHaveBeenCalledWith(expect.anything(), { likeCount: 'MOCK_INCREMENT_1' });
    });

    it('toggleLike (when unliking) should not involve serverTimestamp for the like document itself', async () => {
      // Mock getDoc to simulate post being already liked
      mockGetDoc.mockResolvedValueOnce({ exists: () => true } as any);
      mockDeleteDoc.mockResolvedValueOnce(undefined);
      mockUpdateDoc.mockResolvedValueOnce(undefined); // For post likeCount decrement

      await toggleLike('postId1', 'userId1');

      expect(mockDeleteDoc).toHaveBeenCalledTimes(1);
      expect(mockSetDoc).not.toHaveBeenCalled(); // setDoc should not be called for unliking
      expect(mockUpdateDoc).toHaveBeenCalledWith(expect.anything(), { likeCount: 'MOCK_INCREMENT_-1' });
    });
  });
  
  // We could add tests for error handling in forumService if time permits,
  // similar to how they were done for contentService.client.test.ts
  // For brevity, focusing on timestamp standardization as per the task.
});
