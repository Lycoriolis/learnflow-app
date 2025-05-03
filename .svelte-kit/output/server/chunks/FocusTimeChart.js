import { g as bind_props, a as pop, p as push } from "./index3.js";
import { o as onDestroy } from "./index-server.js";
import "chartjs-adapter-date-fns";
import { y as fallback } from "./utils.js";
function FocusTimeChart($$payload, $$props) {
  push();
  let sessions = fallback($$props["sessions"], () => [], true);
  let timeUnit = fallback($$props["timeUnit"], "day");
  onDestroy(() => {
  });
  $$payload.out += `<div class="chart-container" style="position: relative; height:300px;">`;
  {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div class="h-full flex items-center justify-center text-gray-400"><p>Chart loading...</p></div>`;
  }
  $$payload.out += `<!--]--></div>`;
  bind_props($$props, { sessions, timeUnit });
  pop();
}
export {
  FocusTimeChart as F
};
//# sourceMappingURL=FocusTimeChart.js.map
