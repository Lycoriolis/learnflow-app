import * as server from '../entries/pages/admin/users/_page.server.ts.js';

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/users/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/users/+page.server.ts";
export const imports = ["_app/immutable/nodes/10.1jk-28iB.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/69_IOA4Y.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/D8Zr53n5.js","_app/immutable/chunks/UpSy6tP0.js","_app/immutable/chunks/CCLz0Z0F.js","_app/immutable/chunks/ByokzzJe.js","_app/immutable/chunks/BAqAra_5.js","_app/immutable/chunks/8AErAcLY.js","_app/immutable/chunks/BzVavbfz.js","_app/immutable/chunks/D0guHZRM.js","_app/immutable/chunks/CYIMW-vo.js","_app/immutable/chunks/B51PyqUg.js"];
export const stylesheets = [];
export const fonts = [];
