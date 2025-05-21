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
                rehypeKatex, // Render math with KaTeX
            ],
            // Optional: Define global layouts for MDX files
            // layout: {
            //    // Default layout for all MDX files
            //    // _: './src/lib/components/layouts/MdxPageLayout.svelte', 
            //    // Layout for specific MDX files based on frontmatter (e.g., type: 'lesson')
            //    // lesson: './src/lib/components/layouts/LessonLayout.svelte',
            // },
        })
    ],

    kit: {
        adapter: adapter(),
        // If you had other kit options, keep them
        // vite: { ... }
    }
};

export default config;
