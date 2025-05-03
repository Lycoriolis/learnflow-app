import { e as error } from "../../../chunks/index.js";
import { g as getContentNodeByPath, d as getBreadcrumbs } from "../../../chunks/contentService.js";
const load = async ({ url }) => {
  const path = url.searchParams.get("path") || "";
  try {
    const node = await getContentNodeByPath("courses", path);
    if (!node) {
      error(404, `Course content not found for path: ${path || "/"}`);
    }
    const breadcrumbs = await getBreadcrumbs("courses", path);
    return {
      node,
      // This can be the root node structure or a specific item node
      breadcrumbs,
      currentPath: path
    };
  } catch (err) {
    if (err.status) {
      throw err;
    }
    console.error(`Unexpected error loading courses page for path "${path}":`, err);
    error(500, `Failed to load course data. An unexpected error occurred.`);
  }
};
export {
  load
};
//# sourceMappingURL=_page.server.ts.js.map
