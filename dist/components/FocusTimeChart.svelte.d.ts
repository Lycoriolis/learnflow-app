import type { FocusSession } from '../stores/pipStores.js';
import 'chartjs-adapter-date-fns';
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
declare const FocusTimeChart: $$__sveltets_2_IsomorphicComponent<{
    sessions?: FocusSession[];
    timeUnit?: "day" | "week" | "month";
}, {
    [evt: string]: CustomEvent<any>;
}, {}, {}, string>;
type FocusTimeChart = InstanceType<typeof FocusTimeChart>;
export default FocusTimeChart;
