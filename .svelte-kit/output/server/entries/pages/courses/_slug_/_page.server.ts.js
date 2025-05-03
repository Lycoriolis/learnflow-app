import { e as error } from "../../../../chunks/index.js";
import { e as getContentNodeByIdentifier } from "../../../../chunks/contentService.js";
const load = async (event) => {
  const { params } = event;
  const identifier = params.slug;
  try {
    const node = await getContentNodeByIdentifier("courses", identifier);
    const containerTypes = ["category", "root", "course-category", "topic"];
    const isCategory = containerTypes.includes(node.type);
    if (isCategory) {
      return {
        node,
        isCategory: true,
        items: node.children || []
        // Pass children if available
      };
    } else {
      const content = node.markdownContent || "";
      const contentLoadingError = node.contentLoadingError;
      if (contentLoadingError) {
        console.warn(`Content loading error for ${identifier}: ${contentLoadingError}`);
      }
      return {
        node,
        content,
        isCategory: false
      };
    }
  } catch (err) {
    if (err.status) {
      throw err;
    }
    console.error(`Error loading content for identifier ${identifier}:`, err);
    throw error(500, `Error loading content: ${err.message || "Internal Server Error"}`);
  }
};
export {
  load
};
//# sourceMappingURL=_page.server.ts.js.map
