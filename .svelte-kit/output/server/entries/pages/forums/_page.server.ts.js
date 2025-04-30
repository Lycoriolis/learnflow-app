import { h as getAllTopics, g as getAllCategories } from "../../../chunks/forumService.js";
const load = async () => {
  try {
    const [topics, categories] = await Promise.all([
      getAllTopics(),
      getAllCategories()
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
