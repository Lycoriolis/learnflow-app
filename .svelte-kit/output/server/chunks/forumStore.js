import { p as persistentStore } from "./persistentStore.js";
import { d as derived, w as writable } from "./index2.js";
import "firebase/firestore";
import "firebase/auth";
const subscribedTopics = persistentStore("learnflow-subscribed-topics", []);
const categories = writable([]);
const topics = writable([]);
const currentTopic = writable(null);
const posts = writable([]);
const isLoading = writable(false);
const error = writable(null);
const pinnedTopics = derived(topics, ($topics) => {
  return $topics.filter((topic) => topic.is_pinned);
});
const recentTopics = derived(topics, ($topics) => {
  return $topics.filter((topic) => !topic.is_pinned).sort((a, b) => {
    const dateA = a.updated_at || a.created_at;
    const dateB = b.updated_at || b.created_at;
    if (!dateA || !dateB) return 0;
    return (dateB instanceof Date ? dateB.getTime() : 0) - (dateA instanceof Date ? dateA.getTime() : 0);
  }).slice(0, 10);
});
function getCategoryById(id) {
  let result;
  categories.subscribe((cats) => {
    result = cats.find((cat) => cat.id === id);
  })();
  return result;
}
export {
  currentTopic as a,
  posts as b,
  categories as c,
  error as e,
  getCategoryById as g,
  isLoading as i,
  pinnedTopics as p,
  recentTopics as r,
  subscribedTopics as s,
  topics as t
};
//# sourceMappingURL=forumStore.js.map
