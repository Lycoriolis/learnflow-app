import * as server from '../entries/pages/admin/forums/_page.server.ts.js';

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/forums/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/forums/+page.server.ts";
export const imports = ["_app/immutable/nodes/7.D0mby8we.js","_app/immutable/chunks/COm6N4YE.js","_app/immutable/chunks/69_IOA4Y.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/HPQed-Yx.js","_app/immutable/chunks/PqlH_gqs.js","_app/immutable/chunks/ZM6Rlk1U.js","_app/immutable/chunks/Bkjpsbyi.js","_app/immutable/chunks/B0JaqILT.js","_app/immutable/chunks/Da7F0fHf.js","_app/immutable/chunks/ErG-rR4v.js","_app/immutable/chunks/G1Z7eEzt.js","_app/immutable/chunks/XjHDu-gE.js","_app/immutable/chunks/D8Qc2aSm.js","_app/immutable/chunks/D0cPXSkH.js","_app/immutable/chunks/CGqtlgv0.js","_app/immutable/chunks/CToUoAZH.js","_app/immutable/chunks/Bpt9IQqH.js","_app/immutable/chunks/DucSn23Y.js","_app/immutable/chunks/YB-lia8l.js","_app/immutable/chunks/BWnoWNEX.js","_app/immutable/chunks/D8i9UXqZ.js","_app/immutable/chunks/B9hwOBZE.js","_app/immutable/chunks/BC8mezXZ.js","_app/immutable/chunks/CWdZjy_S.js","_app/immutable/chunks/BWjJF4ZV.js"];
export const stylesheets = [];
export const fonts = [];
