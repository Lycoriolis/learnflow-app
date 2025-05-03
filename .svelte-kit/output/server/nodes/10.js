import * as server from '../entries/pages/admin/users/_page.server.ts.js';

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/users/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/users/+page.server.ts";
export const imports = ["_app/immutable/nodes/10.BGfY5ppQ.js","_app/immutable/chunks/COm6N4YE.js","_app/immutable/chunks/69_IOA4Y.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/HPQed-Yx.js","_app/immutable/chunks/PqlH_gqs.js","_app/immutable/chunks/ZM6Rlk1U.js","_app/immutable/chunks/Bkjpsbyi.js","_app/immutable/chunks/B0JaqILT.js","_app/immutable/chunks/Da7F0fHf.js","_app/immutable/chunks/ErG-rR4v.js","_app/immutable/chunks/D0cPXSkH.js","_app/immutable/chunks/BWjJF4ZV.js","_app/immutable/chunks/CGqtlgv0.js","_app/immutable/chunks/CToUoAZH.js"];
export const stylesheets = [];
export const fonts = [];
