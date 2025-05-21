<script lang="ts">
    import type { NavItem } from '$lib/contentService';
    import { page } from '$app/stores';

    export let navigationHierarchy: NavItem[] = [];
    export let themeSlug: string = ''; // The current theme slug

    // Helper function to find the current path in the navigation hierarchy
    // and build the breadcrumb trail.
    function findPath(items: NavItem[], currentUrlPath: string, basePath: string): NavItem[] {
        const trail: NavItem[] = [];

        function search(currentItems: NavItem[], currentBuiltPath: string): boolean {
            for (const item of currentItems) {
                // Check if the item's path matches the start of the current URL path
                if (currentUrlPath === item.path || (currentUrlPath.startsWith(item.path + '/') && item.path !== basePath) ) {
                    trail.push(item);
                    if (currentUrlPath === item.path) {
                        return true; // Exact match found
                    }
                    if (item.children && item.children.length > 0) {
                        if (search(item.children, item.path)) {
                            return true; // Match found in children
                        }
                    }
                    // If it's a prefix match but no deeper match, this is the deepest parent
                     if (currentUrlPath.startsWith(item.path + '/')) return true;
                }
            }
            // If no direct match or child match, but currentUrlPath starts with item.path, it's a parent
            for (const item of currentItems) {
                 if (currentUrlPath.startsWith(item.path + '/')) {
                    trail.push(item);
                    if (item.children && item.children.length > 0) {
                         if (search(item.children, item.path)) return true;
                    }
                    return true; // It's a parent of the current path
                 }
            }
            return false;
        }

        // Add the theme as the root of the breadcrumb for this context
        const themeRootItem: NavItem = {
            title: themeSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), // Basic title from slug
            slug: [themeSlug],
            path: `/courses/${themeSlug}`,
            type: 'theme'
        };
        trail.push(themeRootItem);

        search(navigationHierarchy, `/courses/${themeSlug}`);
        return trail;
    }

    $: breadcrumbTrail = findPath(navigationHierarchy, $page.url.pathname, `/courses/${themeSlug}`);

</script>

<nav aria-label="breadcrumb">
    <ol class="breadcrumbs-list">
        {#each breadcrumbTrail as item, i (item.path)}
            <li class="breadcrumb-item">
                {#if i < breadcrumbTrail.length - 1}
                    <a href={item.path}>{item.title}</a>
                    <span class="separator" aria-hidden="true">/</span>
                {:else}
                    <span aria-current="page">{item.title}</span>
                {/if}
            </li>
        {/each}
    </ol>
</nav>

<style>
    .breadcrumbs-list {
        list-style: none;
        padding: 0;
        margin: 0 0 20px 0;
        display: flex;
        flex-wrap: wrap;
        font-size: 0.9em;
        color: #4a4a4a; /* Darker general text for breadcrumbs */
    }
    .breadcrumb-item {
        display: flex;
        align-items: center;
    }
    .breadcrumb-item a {
        text-decoration: none;
        color: #0056b3; /* Consistent darker blue for links */
    }
    .breadcrumb-item a:hover {
        text-decoration: underline;
    }
    .breadcrumb-item .separator {
        margin: 0 0.5em;
        color: #7a7a7a; /* Darker separator */
    }
    .breadcrumb-item span[aria-current="page"] {
        font-weight: bold;
        color: #1a1a1a; /* Very dark for current page */
    }
</style>
