import { c as getContentListByCategory } from "../../../../chunks/contentService.js";
const load = async ({ params }) => {
  const { slug } = params;
  const items = await getContentListByCategory("courses", slug);
  return { items, slug };
};
export {
  load
};
//# sourceMappingURL=_page.server.ts.js.map
