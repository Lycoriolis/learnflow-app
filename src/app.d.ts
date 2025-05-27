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
        katex?: any; // You can replace 'any' with more specific KaTeX types if you have them installed
        renderMathInElement?: (
            element: HTMLElement,
            options?: {
                delimiters?: { left: string; right: string; display: boolean }[];
                ignoredTags?: string[];
                ignoredClasses?: string[];
                errorColor?: string;
                throwOnError?: boolean;
                macros?: object;
                trust?: boolean | ((context: { command: string; url: string; protocol: string }) => boolean);
                strict?: boolean | string | ((errorCode: string, errorMsg: string, token: any) => string);
                // Add other KaTeX auto-render options if you use them
            }
        ) => void;
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

// To make this file a module, you can add an empty export.
// This is often needed if your tsconfig.json has "isolatedModules": true or similar.
export {};
