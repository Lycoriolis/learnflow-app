export interface ForumTopic {
    id: string;
    title: string;
    content: string;
    author_id: string;
    author_name?: string;
    category_id: string;
    created_at: string | Date;
    updated_at: string | Date;
    views: number;
    post_count: number;
    is_pinned?: boolean;
    replyCount?: number;
    createdAt?: string;
    viewCount?: number;
    authorAvatar?: string;
    tags?: string[];
}

export interface ForumPost {
    id: string;
    topic_id: string;
    content: string;
    author_id: string;
    author_name: string;
    created_at: string | Date;
    updated_at: string | Date;
    authorAvatar?: string;
}

export interface ForumCategory {
    id: string;
    name: string;
    description: string;
    topic_count: number;
}

export interface ServiceResponse<T> {
    success: boolean;
    data?: T;
    error?: Error;
}
