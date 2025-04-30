/**
 * Get all groups with member status for a given user
 */
export declare function getAllGroups(userId?: string | null): Promise<any[]>;
/**
 * Get a specific group by ID with its members
 */
export declare function getGroupById(groupId: string): Promise<{
    group: any;
    members: any[];
} | null>;
/**
 * Create a new group
 */
export declare function createGroup(data: {
    name: string;
    description: string;
    topic: string;
    image?: string;
    is_public?: boolean;
    created_by: string;
}): Promise<any>;
/**
 * Join a group
 */
export declare function joinGroup(groupId: string, userId: string): Promise<boolean>;
/**
 * Leave a group
 */
export declare function leaveGroup(groupId: string, userId: string): Promise<boolean>;
