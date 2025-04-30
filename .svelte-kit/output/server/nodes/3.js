import * as server from '../entries/pages/admin/_layout.server.ts.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/+layout.server.ts";
export const imports = ["_app/immutable/nodes/3.DAj4p4g1.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/69_IOA4Y.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/D8Zr53n5.js","_app/immutable/chunks/ByokzzJe.js","_app/immutable/chunks/ycPwrSgR.js","_app/immutable/chunks/D0guHZRM.js","_app/immutable/chunks/CYIMW-vo.js","_app/immutable/chunks/B51PyqUg.js"];
export const stylesheets = [];
export const fonts = [];
