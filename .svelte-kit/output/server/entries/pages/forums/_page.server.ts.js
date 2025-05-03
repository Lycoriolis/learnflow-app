import { k as getTopics, a as getCategories } from "../../../chunks/forumService.js";
const load = async () => {
  try {
    const [topics, categories] = await Promise.all([
      getTopics(),
      getCategories()
    ]);
    return {
      topics,
      categories
    };
  } catch (error) {
    console.error("Error loading forum data:", error);
    return {
      topics: [],
      categories: [],
      error: "Failed to load forum data"
    };
  }
};
export {
  load
};
//# sourceMappingURL=_page.server.ts.js.map
