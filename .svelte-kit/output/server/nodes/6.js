import * as server from '../entries/pages/admin/courses/_page.server.ts.js';

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/courses/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/courses/+page.server.ts";
export const imports = ["_app/immutable/nodes/6.-OO_ii1X.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/69_IOA4Y.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/D8Zr53n5.js","_app/immutable/chunks/UpSy6tP0.js","_app/immutable/chunks/CCLz0Z0F.js","_app/immutable/chunks/ByokzzJe.js","_app/immutable/chunks/8AErAcLY.js","_app/immutable/chunks/CwmK-V57.js","_app/immutable/chunks/BzVavbfz.js","_app/immutable/chunks/D0guHZRM.js","_app/immutable/chunks/CYIMW-vo.js","_app/immutable/chunks/B51PyqUg.js"];
export const stylesheets = [];
export const fonts = [];
