import pkg from 'pg';
const { Pool } = pkg;
import { env } from '$env/dynamic/private';

export const pool = new Pool({
  connectionString: env.DATABASE_URL
});

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  createdAt: number;
  preferences?: Record<string, any>;
}

const ADMIN_EMAILS = (env.VITE_ADMIN_EMAILS || '').split(',').map(email => email.trim());

/**
 * Verifies if a user has admin privileges based on their email
 */
export async function verifyUserIsAdmin(email: string | null | undefined): Promise<boolean> {
    if (!email) return false;
    return ADMIN_EMAILS.includes(email);
}

/**
 * Fetches all user profiles from the database (admin only)
 */
export async function getAllUsers(): Promise<UserProfile[]> {
    try {
        const result = await pool.query('SELECT * FROM users');
        return result.rows;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}
