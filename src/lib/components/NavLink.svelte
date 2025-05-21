<script lang="ts">
    import type { NavItem } from '$lib/contentService';

    export let item: NavItem;
    export let currentPath: string;
    export let level: number = 0;

    $: isActive = currentPath === item.path || (item.path !== '/courses' && currentPath.startsWith(item.path + '/'));
    // A more precise active check for index pages of sections
    $: isSectionActive = currentPath === item.path;
    $: isParentActive = item.children && item.children.length > 0 && currentPath.startsWith(item.path + '/');

</script>

<li style="padding-left: {level * 15}px;" class:active={isSectionActive} class:parent-active={isParentActive && !isSectionActive}>
    <a href={item.path}>{item.title}</a>
    {#if item.children && item.children.length > 0}
        <ul>
            {#each item.children as childItem}
                <svelte:self item={childItem} {currentPath} level={level + 1} />
            {/each}
        </ul>
    {/if}
</li>

<style>
    li {
        margin: 8px 0;
        list-style-type: none;
    }
    ul {
        list-style-type: none;
        padding-left: 0; /* Reset padding, handled by li style */
        margin-top: 5px;
    }
    a {
        text-decoration: none;
        color: #205080; /* Darker blue for better contrast on light sidebar */
        display: block;
        padding: 4px 8px;
        border-radius: 4px;
        transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
    }
    a:hover {
        background-color: #e0e0e0; /* Slightly darker hover */
        color: #003366;
    }
    li.active > a {
        font-weight: bold;
        color: #004080; /* Stronger blue for active link */
        background-color: #d4eaff; /* Lighter blue background for active */
    }
    li.parent-active > a { /* Style for parent when a child is active but parent itself is not the direct page */
        font-weight: 500;
        color: #104070; /* Darker, but not as strong as active */
    }
</style>
