import { e as error } from "../../../../chunks/index.js";
import { e as getContentNodeByIdentifier, d as getBreadcrumbs } from "../../../../chunks/contentService.js";
const load = async ({ params }) => {
  const identifier = params.id;
  try {
    const node = await getContentNodeByIdentifier("exercises", identifier);
    const containerTypes = ["category", "root", "exercise-category", "topic"];
    const isCategory = containerTypes.includes(node.type);
    const breadcrumbs = await getBreadcrumbs("exercises", identifier);
    if (isCategory) {
      return {
        node,
        isCategory: true,
        items: node.children || [],
        // Pass children if available
        breadcrumbs
      };
    } else if (node.type === "exercise") {
      const content = node.markdownContent || "";
      const contentLoadingError = node.contentLoadingError;
      if (contentLoadingError) {
        console.warn(`Content loading error for exercise ${identifier}: ${contentLoadingError}`);
      }
      return {
        node,
        // Renamed from exercise to node for consistency
        content,
        isCategory: false,
        breadcrumbs
      };
    } else {
      console.warn(`Unexpected content node type "${node.type}" for identifier: ${identifier}`);
      throw error(404, "Content type not viewable");
    }
  } catch (err) {
    if (err.status) {
      throw err;
    }
    console.error(`Error loading exercise content for identifier ${identifier}:`, err);
    throw error(500, `Error loading exercise content: ${err.message || "Internal Server Error"}`);
  }
};
export {
  load
};
//# sourceMappingURL=_page.server.ts.js.map
