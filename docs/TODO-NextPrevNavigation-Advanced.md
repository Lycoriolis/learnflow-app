# TODO: NextPrevNavigation Advanced Logic

**Component:** `src/lib/components/NextPrevNavigation.svelte`

**Current Status:**
- Prioritizes `prevLink`/`nextLink` props from frontmatter.
- If props are not provided, attempts to derive next/previous links by flattening the `navigationHierarchy` from `$page.data`.
- Sorts flattened items by `order` then `path`.
- Excludes items of `type: "exercise"` from the main sequential flow.

**Potential Future Enhancements:**

1.  **Circular Navigation within a Section:**
    *   Option to loop back to the first item of a module/course when on the last item, and vice-versa.
    *   Could be controlled by a prop or global setting.

2.  **Skip "Empty" Overviews:**
    *   If a module/course `_index.md` page has minimal content and primarily serves as a container, the "Next" from the previous lesson could skip directly to the first lesson of that module.
    *   This would require more sophisticated analysis of the `navigationHierarchy` or specific frontmatter flags (e.g., `skipOverviewInNav: true`).

3.  **User Progress Awareness:**
    *   "Next" button could point to the next *unread* or *incomplete* lesson/module, rather than strictly the next sequential one.
    *   Requires integration with user progress tracking (see `TODO-UserProgress-Database.md`).

4.  **Handling of Multiple "Next" Paths:**
    *   In complex non-linear courses, a lesson might have multiple valid "next" steps. The current component only supports one.
    *   This would require a significant UI change (e.g., a dropdown or multiple buttons).

5.  **More Granular Type Exclusion/Inclusion:**
    *   Allow configuration of which content `type`s are considered part of the main navigable sequence beyond the current hardcoded list.

6.  **Performance for Very Large Hierarchies:**
    *   Ensure the flattening and sorting logic remains performant if `navigationHierarchy` becomes extremely large and deep. (Currently likely fine for most cases).

7.  **Accessibility:**
    *   Ensure `aria-labels` clearly indicate the destination, especially if titles are truncated.
