import { e as error } from "../../../chunks/index.js";
import { c as getContentListByCategory, d as getBreadcrumbs } from "../../../chunks/contentService.js";
const load = async ({ url }) => {
  const categoryIdentifier = url.searchParams.get("category") || "";
  try {
    const items = await getContentListByCategory("exercises", categoryIdentifier);
    const breadcrumbs = await getBreadcrumbs("exercises", categoryIdentifier);
    return {
      items,
      // Renamed from exercises to items for consistency
      breadcrumbs,
      currentCategory: categoryIdentifier
    };
  } catch (err) {
    if (err.status) {
      throw err;
    }
    console.error(`Error loading exercises page for category "${categoryIdentifier}":`, err);
    error(500, `Failed to load exercises data. An unexpected error occurred.`);
  }
};
export {
  load
};
//# sourceMappingURL=_page.server.ts.js.map
