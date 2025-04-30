import { N as fallback, M as bind_props, B as pop, z as push } from "./index.js";
import { Chart, registerables } from "chart.js";
import "chartjs-adapter-date-fns";
function FocusTimeChart($$payload, $$props) {
  push();
  Chart.register(...registerables);
  let sessions = fallback($$props["sessions"], () => [], true);
  let timeUnit = fallback($$props["timeUnit"], "day");
  $$payload.out += `<div class="chart-container" style="position: relative; height:300px;"><canvas></canvas></div>`;
  bind_props($$props, { sessions, timeUnit });
  pop();
}
export {
  FocusTimeChart as F
};
