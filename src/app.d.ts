/// <reference types="@sveltejs/kit" />
/// <reference types="svelte" />

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

// Fix issue with Svelte's import
declare module 'svelte' {
    export { SvelteComponent } from 'svelte/internal';
    export { onMount, createEventDispatcher } from 'svelte/internal';
}

// Custom type declarations for modules without @types packages
declare module 'markdown-it-katex' {
    import type MarkdownIt from 'markdown-it';
    const plugin: (md: MarkdownIt, options?: any) => void;
    export default plugin;
}

export {};
