<script lang="ts">
    import type { NavItem } from '$lib/contentService';
    import { page } from '$app/stores';

    export let navigationHierarchy: NavItem[] = [];

    // Helper component for recursive rendering
    import NavLink from './NavLink.svelte'; // We'll create this simple helper next
</script>

<aside class="sidebar">
    <h3>Navigation</h3>
    {#if navigationHierarchy && navigationHierarchy.length > 0}
        <ul class="top-level-nav">
            {#each navigationHierarchy as item}
                <NavLink {item} currentPath={$page.url.pathname} level={0} />
            {/each}
        </ul>
    {:else}
        <p>Loading navigation...</p>
    {/if}
</aside>

<style>
    .sidebar {
        width: 280px;
        min-width: 220px;
        background-color: #f9f9f9;
        padding: 20px;
        /* height: 100vh; */ /* Remove or adjust: height is now controlled by calc() in theme layout */
        overflow-y: auto;
        border-right: 1px solid #e0e0e0;
    }
    .sidebar h3 {
        margin-top: 0;
        margin-bottom: 15px;
        font-size: 1.2em;
        color: #333;
    }
    .top-level-nav {
        list-style-type: none;
        padding-left: 0;
    }
</style>
