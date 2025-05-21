<script lang="ts">
    import { page } from '$app/stores';
    import type { NavItem } from '$lib/contentService';

    // Props for direct links from frontmatter (override internal logic)
    export let prevLink: { path: string, title: string } | null = null;
    export let nextLink: { path: string, title: string } | null = null;

    let derivedPrevLink: { path: string, title: string } | null = null;
    let derivedNextLink: { path: string, title: string } | null = null;

    // Reactive statement to derive links if not provided by props
    $: {
        if (prevLink !== null && nextLink !== null) {
            // If both are provided by props, use them directly
            derivedPrevLink = prevLink;
            derivedNextLink = nextLink;
        } else {
            // Attempt to derive from navigationHierarchy
            const navHierarchy = $page.data.navigationHierarchy as NavItem[] | undefined;
            const currentPath = $page.url.pathname;

            if (navHierarchy && navHierarchy.length > 0) {
                const flatNavigableItems: NavItem[] = [];

                function flattenHierarchy(items: NavItem[]) {
                    for (const item of items) {
                        // Define what's "visitable" for next/prev navigation
                        // Typically lessons, exercises, and perhaps module/course _index pages
                        if (item.type === 'lesson' || item.type === 'exercise' || item.type === 'module' || item.type === 'course') {
                            flatNavigableItems.push(item);
                        }
                        if (item.children && item.children.length > 0) {
                            flattenHierarchy(item.children);
                        }
                    }
                }

                flattenHierarchy(navHierarchy);

                // Sort by order and then by path as a fallback to ensure consistent ordering
                flatNavigableItems.sort((a, b) => {
                    if (a.order !== undefined && b.order !== undefined) {
                        if (a.order !== b.order) return a.order - b.order;
                    }
                    return a.path.localeCompare(b.path);
                });
                
                const currentIndex = flatNavigableItems.findIndex(item => item.path === currentPath);

                if (prevLink === null) { // Only derive if not provided by prop
                    if (currentIndex > 0) {
                        derivedPrevLink = {
                            path: flatNavigableItems[currentIndex - 1].path,
                            title: flatNavigableItems[currentIndex - 1].title
                        };
                    } else {
                        derivedPrevLink = null;
                    }
                } else {
                    derivedPrevLink = prevLink;
                }

                if (nextLink === null) { // Only derive if not provided by prop
                    if (currentIndex !== -1 && currentIndex < flatNavigableItems.length - 1) {
                        derivedNextLink = {
                            path: flatNavigableItems[currentIndex + 1].path,
                            title: flatNavigableItems[currentIndex + 1].title
                        };
                    } else {
                        derivedNextLink = null;
                    }
                } else {
                    derivedNextLink = nextLink;
                }
            } else {
                // Fallback if no hierarchy or props
                derivedPrevLink = prevLink;
                derivedNextLink = nextLink;
            }
        }
    }

</script>

<div class="next-prev-nav">
    {#if derivedPrevLink}
        <a href={derivedPrevLink.path} class="nav-button prev">
            &larr; Previous: {derivedPrevLink.title}
        </a>
    {/if}
    {#if derivedNextLink}
        <a href={derivedNextLink.path} class="nav-button next">
            Next: {derivedNextLink.title} &rarr;
        </a>
    {/if}
</div>

<style>
    .next-prev-nav {
        display: flex;
        justify-content: space-between;
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid #eee;
    }
    .nav-button {
        padding: 10px 15px;
        border: 1px solid #ddd;
        text-decoration: none;
        border-radius: 5px;
        color: #007bff;
        font-weight: 500;
        max-width: 48%; /* Prevent overlap on small screens */
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .nav-button:hover {
        background-color: #f0f0f0;
        border-color: #ccc;
    }
    .prev {
        /* styles for prev */
    }
    .next {
        margin-left: auto; /* Pushes next button to the right if only next exists */
    }
</style>
