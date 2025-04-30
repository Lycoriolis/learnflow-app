import { V as copy_payload, W as assign_payload, M as bind_props, B as pop, z as push, O as head } from "../../../chunks/index.js";
import "clsx";
import "firebase/auth";
function _page($$payload, $$props) {
  push();
  let data = $$props["data"];
  let topics = data.topics;
  let categories = data.categories;
  console.log("Loaded categories:", categories);
  const testTopicId = "test-topic-1";
  if (!topics.some((t) => t.id === testTopicId)) {
    topics = [
      {
        id: testTopicId,
        title: "Test Topic: Welcome to the Forum!",
        category: categories[0]?.id || "general",
        author: {
          id: "test-user",
          name: "Test User",
          avatar: ""
        },
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        repliesCount: 0,
        viewsCount: 0,
        upvotes: 0,
        downvotes: 0,
        userVote: null,
        tags: ["test", "welcome"],
        isPinned: true,
        isLocked: false,
        difficulty: "beginner",
        resourceLinks: [],
        hasCodeExamples: false,
        isResolved: false
      },
      ...topics
    ];
  }
  let filterCategory = "all";
  let searchQuery = "";
  let difficultyFilter = "all";
  topics.filter((topic) => {
    const matchesCategory = filterCategory === "all";
    const matchesSearch = searchQuery === "";
    const matchesDifficulty = difficultyFilter === "all";
    const matchesResolution = topic.isResolved || !topic.isResolved || topic.isResolved === void 0;
    return matchesCategory && matchesSearch && matchesDifficulty && matchesResolution;
  }).sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    {
      const dateA = a.lastPost ? new Date(a.lastPost.date) : new Date(a.createdAt);
      const dateB = b.lastPost ? new Date(b.lastPost.date) : new Date(a.createdAt);
      return dateB.getTime() - dateA.getTime();
    }
  });
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    head($$payload2, ($$payload3) => {
      $$payload3.title = `<title>Forums | LearnFlow</title>`;
    });
    $$payload2.out += `<div class="container mx-auto px-4 py-8 max-w-7xl svelte-ea7bem">`;
    {
      $$payload2.out += "<!--[-->";
      $$payload2.out += `<div class="flex justify-center items-center h-64 svelte-ea7bem"><div class="loader svelte-ea7bem"></div></div>`;
    }
    $$payload2.out += `<!--]--></div>`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { data });
  pop();
}
export {
  _page as default
};
