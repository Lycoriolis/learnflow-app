import adapter from '@sveltejs/adapter-auto'; // Or your preferred adapter
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    extensions: ['.svelte', '.md', '.svx', '.mdx'], // Add .md, .svx, .mdx

    preprocess: [
        vitePreprocess(),
        mdsvex({
            extensions: ['.md', '.svx', '.mdx'],
            smartypants: true,
            remarkPlugins: [
                remarkMath, // Process math blocks
            ],
            rehypePlugins: [
                [rehypeKatex, {
                    // Add KaTeX options for better rendering
                    throwOnError: false,
                    strict: false,
                    output: 'htmlAndMathml',
                    trust: true,
                    macros: {
                        // Common math macros
                        "\\R": "\\mathbb{R}",
                        "\\N": "\\mathbb{N}",
                        "\\Z": "\\mathbb{Z}",
                        "\\Q": "\\mathbb{Q}",
                        "\\C": "\\mathbb{C}"
                    }
                }], // Enhanced KaTeX configuration
            ],
        })
    ],

    kit: {
        adapter: adapter(),
        // If you had other kit options, keep them
        // vite: { ... }
    }
};

export default config;
