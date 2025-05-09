/// <reference types="@sveltejs/kit" />

import type { DecodedIdToken } from 'firebase-admin/auth'; // Server-side Firebase Admin user

declare global {
    namespace App {
        interface Locals {
            user: DecodedIdToken | null; // Updated to DecodedIdToken
            isAuthenticated: boolean;
            csrfToken?: string; // csrfToken is optional
        }
    }

    // Add Splide and marked to the Window interface
    interface Window {
        Splide: any; // Use 'any' for simplicity, or install @splidejs/splide types
        marked: any; // For the dynamically loaded marked library
    }
}

export {};
