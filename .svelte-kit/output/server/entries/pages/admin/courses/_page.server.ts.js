import { a as getAllContentItemsByType } from "../../../../chunks/contentService.js";
const load = async () => {
  const courses = await getAllContentItemsByType("courses", "course");
  return { courses };
};
export {
  load
};
//# sourceMappingURL=_page.server.ts.js.map
