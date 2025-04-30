interface $$__sveltets_2_IsomorphicComponent<Props extends Record<string, any> = any, Events extends Record<string, any> = any, Slots extends Record<string, any> = any, Exports = {}, Bindings = string> {
    new (options: import('svelte').ComponentConstructorOptions<Props>): import('svelte').SvelteComponent<Props, Events, Slots> & {
        $$bindings?: Bindings;
    } & Exports;
    (internal: unknown, props: Props & {
        $$events?: Events;
        $$slots?: Slots;
    }): Exports & {
        $set?: any;
        $on?: any;
    };
    z_$$bindings?: Bindings;
}
declare const ForumFilters: $$__sveltets_2_IsomorphicComponent<{
    categories?: Array<{
        id: string;
        name: string;
    }>;
    filterCategory: string;
    searchQuery: string;
    sortOption: string;
    difficultyFilter: string;
}, {
    search: CustomEvent<any>;
    category: CustomEvent<any>;
    sort: CustomEvent<any>;
    difficulty: CustomEvent<any>;
} & {
    [evt: string]: CustomEvent<any>;
}, {}, {}, string>;
type ForumFilters = InstanceType<typeof ForumFilters>;
export default ForumFilters;
