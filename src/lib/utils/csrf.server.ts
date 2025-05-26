/**
 * Server-side CSRF protection utilities
 * This file should never be imported on the client
 */
import { CSRF_COOKIE } from './csrf.types.js';
import { env } from '$env/dynamic/private';
import type { Cookies } from '@sveltejs/kit';
import crypto from 'crypto';

// Make sure this file only runs on the server
if (typeof window !== 'undefined') {
  throw new Error('csrf.server.ts should only be imported on the server!');
}

// Secret used for CSRF token validation
const CSRF_SECRET = env.VITE_CSRF_SECRET || 'default-csrf-secret-key-should-be-changed-in-production';

/**
 * Generate a cryptographically secure random token
 */
export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Set up CSRF protection by generating and storing a token in cookies
 */
export function setupCsrfToken(cookies: Cookies): string {
  const token = generateToken();
  
  cookies.set(CSRF_COOKIE, token, {
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 // 24 hours
  });

  return token;
}

/**
 * Hash a token for secure comparison
 */
function hashToken(token: string): string {
  return crypto
    .createHmac('sha256', CSRF_SECRET)
    .update(token)
    .digest('hex');
}

/**
 * Validate a CSRF token against the cookie using constant-time comparison
 */
export function validateCsrfToken(cookies: Cookies, headerToken: string | null): boolean {
  if (!headerToken) return false;

  const cookieToken = cookies.get(CSRF_COOKIE);
  if (!cookieToken) return false;

  try {
    // Use constant-time comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(hashToken(headerToken)),
      Buffer.from(hashToken(cookieToken))
    );
  } catch (error) {
    console.error('CSRF validation error:', error);
    return false;
  }
}