import { h as head, b as attr, f as escape_html, d as attr_class, a as pop, p as push, j as stringify } from "../../../../chunks/index3.js";
import { o as onDestroy } from "../../../../chunks/index-server.js";
import "firebase/firestore";
import "../../../../chunks/authStore.js";
function _page($$payload, $$props) {
  push();
  let timeStr;
  const WORK_MIN = 25;
  let minutes = WORK_MIN;
  let seconds = 0;
  let isRunning = false;
  let cycle = 1;
  let completedCycles = 0;
  onDestroy(() => {
  });
  timeStr = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Pomodoro Timer | LearnFlow</title>`;
  });
  $$payload.out += `<div class="flex flex-col items-center justify-center min-h-[60vh] py-10 svelte-1abuzv3"><div class="relative mb-8 svelte-1abuzv3"><svg width="180" height="180" viewBox="0 0 180 180" class="svelte-1abuzv3"><circle cx="90" cy="90" r="80" fill="#f3f4f6" class="svelte-1abuzv3"></circle><circle cx="90" cy="90" r="80" fill="none" stroke="#f87171" stroke-width="14" stroke-dasharray="502"${attr("stroke-dashoffset", 502 - 502 * ((WORK_MIN * 60 - (minutes * 60 + seconds)) / (WORK_MIN * 60)))} stroke-linecap="round" style="transition: stroke-dashoffset 0.5s linear;" class="svelte-1abuzv3"></circle><circle cx="90" cy="90" r="60" fill="#f87171" class="svelte-1abuzv3"></circle><ellipse cx="90" cy="70" rx="18" ry="10" fill="#34d399" class="svelte-1abuzv3"></ellipse><ellipse cx="80" cy="100" rx="6" ry="8" fill="#fff" class="svelte-1abuzv3"></ellipse><ellipse cx="100" cy="100" rx="6" ry="8" fill="#fff" class="svelte-1abuzv3"></ellipse><ellipse cx="80" cy="102" rx="2" ry="3" fill="#222" class="svelte-1abuzv3"></ellipse><ellipse cx="100" cy="102" rx="2" ry="3" fill="#222" class="svelte-1abuzv3"></ellipse><path d="M80 115 Q90 125 100 115" stroke="#222" stroke-width="3" fill="none" class="svelte-1abuzv3"></path></svg> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <div class="absolute inset-0 flex flex-col items-center justify-center svelte-1abuzv3"><span class="text-5xl font-mono font-bold text-gray-900 dark:text-white drop-shadow svelte-1abuzv3">${escape_html(timeStr)}</span> <span${attr_class(`mt-2 text-lg font-semibold ${stringify("text-red-500")}`, "svelte-1abuzv3")}>${escape_html("Work")}</span></div></div> <div class="flex space-x-4 mb-6 svelte-1abuzv3"><button class="px-6 py-2 rounded-lg bg-indigo-600 text-white font-bold shadow hover:bg-indigo-700 transition svelte-1abuzv3"${attr("disabled", isRunning, true)}><i class="fas fa-play mr-2 svelte-1abuzv3"></i> Start</button> <button class="px-6 py-2 rounded-lg bg-yellow-400 text-white font-bold shadow hover:bg-yellow-500 transition svelte-1abuzv3"${attr("disabled", true, true)}><i class="fas fa-pause mr-2 svelte-1abuzv3"></i> Pause</button> <button class="px-6 py-2 rounded-lg bg-gray-300 text-gray-700 font-bold shadow hover:bg-gray-400 transition svelte-1abuzv3"><i class="fas fa-redo mr-2 svelte-1abuzv3"></i> Reset</button></div> <div class="flex items-center space-x-6 mt-2 svelte-1abuzv3"><span class="text-sm text-gray-500 svelte-1abuzv3">Cycle: <span class="font-bold text-indigo-600 svelte-1abuzv3">${escape_html(cycle)}</span></span> <span class="text-sm text-gray-500 svelte-1abuzv3">Completed: <span class="font-bold text-green-500 svelte-1abuzv3">${escape_html(completedCycles)}</span></span></div> <div class="mt-8 text-center text-gray-400 text-xs svelte-1abuzv3"><span class="svelte-1abuzv3">Stay focused! Every 4 cycles, enjoy a longer break 🍅</span></div></div>`;
  pop();
}
export {
  _page as default
};
//# sourceMappingURL=_page.svelte.js.map
