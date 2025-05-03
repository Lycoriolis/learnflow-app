const categoryMap = {
  cs: "Computer Science",
  math: "Mathematics",
  languages: "Languages",
  science: "Science"
};
const load = ({ params }) => {
  const slug = params.slug;
  const categoryName = categoryMap[slug] || "Unknown Category";
  return {
    slug,
    categoryName
  };
};
export {
  load
};
//# sourceMappingURL=_page.ts.js.map
