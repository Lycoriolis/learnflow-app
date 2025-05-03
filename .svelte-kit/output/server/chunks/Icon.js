import "clsx";
import { a as pop, p as push } from "./index3.js";
import { o as onDestroy } from "./index-server.js";
import "./functions.js";
function Icon($$payload, $$props) {
  push();
  const { $$slots, $$events, ...props } = $$props;
  onDestroy(() => {
  });
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  pop();
}
export {
  Icon as I
};
//# sourceMappingURL=Icon.js.map
