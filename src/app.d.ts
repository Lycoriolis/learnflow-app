/// <reference types="@sveltejs/kit" />

import type { User } from 'firebase/auth';

declare global {
    namespace App {
        interface Locals {
            user: User | null;
            isAuthenticated: boolean;
            [key: string]: User | null | boolean | undefined;
        }
    }

    // Add Splide to the Window interface
    interface Window {
        Splide: any; // Use 'any' for simplicity, or install @splidejs/splide types
    }
}

// Custom type declarations for modules without @types packages
declare module 'markdown-it-katex' {
    import type MarkdownIt from 'markdown-it';
    const plugin: (md: MarkdownIt, options?: any) => void;
    export default plugin;
}

export {};
