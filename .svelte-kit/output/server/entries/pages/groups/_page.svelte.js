import { O as head, B as pop, z as push } from "../../../chunks/index.js";
import { o as onDestroy } from "../../../chunks/index-server.js";
import "clsx";
import "firebase/auth";
import "firebase/firestore";
function _page($$payload, $$props) {
  push();
  let filteredGroups;
  let allGroups = [];
  let searchQuery = "";
  onDestroy(() => {
  });
  [
    "all",
    ...Array.from(new Set(allGroups.map((group) => group.topic)))
  ];
  filteredGroups = allGroups.filter((group) => {
    const matchesSearch = searchQuery === "";
    return matchesSearch;
  });
  allGroups.filter((group) => group.isMember);
  filteredGroups.filter((group) => !group.isMember);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>User Groups | LearnFlow</title>`;
  });
  $$payload.out += `<div class="container mx-auto px-4 py-8 max-w-7xl svelte-131r20r">`;
  {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="flex justify-center items-center h-64 svelte-131r20r"><div class="loader svelte-131r20r"></div></div>`;
  }
  $$payload.out += `<!--]--></div>`;
  pop();
}
export {
  _page as default
};
