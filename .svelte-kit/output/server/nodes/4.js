import * as server from '../entries/pages/_page.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/4.DM0zrzBB.js","_app/immutable/chunks/COm6N4YE.js","_app/immutable/chunks/69_IOA4Y.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/HPQed-Yx.js","_app/immutable/chunks/Bkjpsbyi.js","_app/immutable/chunks/ZM6Rlk1U.js","_app/immutable/chunks/Da7F0fHf.js","_app/immutable/chunks/D0cPXSkH.js","_app/immutable/chunks/BWjJF4ZV.js","_app/immutable/chunks/CGqtlgv0.js","_app/immutable/chunks/CToUoAZH.js","_app/immutable/chunks/Bpt9IQqH.js","_app/immutable/chunks/PqlH_gqs.js","_app/immutable/chunks/B0JaqILT.js","_app/immutable/chunks/ErG-rR4v.js","_app/immutable/chunks/XjHDu-gE.js","_app/immutable/chunks/G1Z7eEzt.js","_app/immutable/chunks/DRwqVxuN.js","_app/immutable/chunks/BC8mezXZ.js","_app/immutable/chunks/CWdZjy_S.js","_app/immutable/chunks/CNZtGARX.js","_app/immutable/chunks/GvWXBGfm.js","_app/immutable/chunks/D3PCwpG5.js","_app/immutable/chunks/i8jSxOG3.js","_app/immutable/chunks/D8i9UXqZ.js","_app/immutable/chunks/B9hwOBZE.js","_app/immutable/chunks/DN_AKHeO.js","_app/immutable/chunks/BRK8y73W.js","_app/immutable/chunks/Dp1pzeXC.js","_app/immutable/chunks/j_iAVkhk.js","_app/immutable/chunks/YB-lia8l.js","_app/immutable/chunks/B8g5sepC.js","_app/immutable/chunks/BV8la0Yt.js","_app/immutable/chunks/pK43Z0Mz.js"];
export const stylesheets = ["_app/immutable/assets/CourseCard.niTa1fSk.css","_app/immutable/assets/ExerciseCard.DPCSqYM9.css","_app/immutable/assets/4.DQ1mHQJ4.css"];
export const fonts = [];
