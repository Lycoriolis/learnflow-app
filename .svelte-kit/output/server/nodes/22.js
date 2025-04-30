import * as server from '../entries/pages/forums/topic/_id_/_page.server.ts.js';

export const index = 22;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/forums/topic/_id_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/forums/topic/[id]/+page.server.ts";
export const imports = ["_app/immutable/nodes/22.DLHCLH5v.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/69_IOA4Y.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/D8Zr53n5.js","_app/immutable/chunks/BzVavbfz.js","_app/immutable/chunks/D0guHZRM.js","_app/immutable/chunks/CYIMW-vo.js","_app/immutable/chunks/B51PyqUg.js","_app/immutable/chunks/UpSy6tP0.js","_app/immutable/chunks/CCLz0Z0F.js","_app/immutable/chunks/ByokzzJe.js","_app/immutable/chunks/BAqAra_5.js","_app/immutable/chunks/8AErAcLY.js","_app/immutable/chunks/Djn-aou_.js","_app/immutable/chunks/Bfc47y5P.js","_app/immutable/chunks/DyX_nzx0.js","_app/immutable/chunks/QfzvdxsM.js","_app/immutable/chunks/DI_EjB8G.js","_app/immutable/chunks/z6kK6n-3.js","_app/immutable/chunks/C1FmrZbK.js","_app/immutable/chunks/DYIbtIuY.js","_app/immutable/chunks/CHieB3Fn.js","_app/immutable/chunks/Cw_GgyMt.js","_app/immutable/chunks/BM8m5GYV.js","_app/immutable/chunks/gnU0ypJ3.js"];
export const stylesheets = ["_app/immutable/assets/MarkdownRenderer.w4HA0fza.css","_app/immutable/assets/22.B6pW9uN4.css"];
export const fonts = [];
