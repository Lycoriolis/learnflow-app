import "gray-matter";
async function listContent(type) {
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        const content = type === "course" ? [
          {
            id: "sample-course",
            title: "Introduction to Web Development",
            type: "course",
            slug: "intro-web-dev",
            description: "Learn the basics of web development with HTML, CSS, and JavaScript",
            difficulty: "beginner",
            estimatedTime: "3 hours",
            tags: ["html", "css", "javascript", "web"]
          },
          {
            id: "bezout-theorem",
            title: "Bezout's Theorem and Identity",
            type: "course",
            slug: "bezout-theorem",
            description: "Understanding Bézout's identity, the extended GCD algorithm, and applications.",
            difficulty: "intermediate",
            estimatedTime: "90 minutes",
            tags: ["math", "number theory", "gcd", "bezout"]
          }
        ] : [
          {
            id: "html-basics-exercise",
            title: "HTML Basics Exercise",
            type: "exercise",
            slug: "html-basics",
            description: "Practice creating a simple HTML webpage with various elements",
            difficulty: "beginner",
            estimatedTime: "45 minutes",
            tags: ["html", "practice"]
          },
          {
            id: "bezout-identity-exercise",
            title: "Bézout's Identity Exercises",
            type: "exercise",
            slug: "bezout-identity",
            description: "Exercises on computing GCD, extended Euclidean algorithm, and Bézout coefficients.",
            difficulty: "intermediate",
            estimatedTime: "30 minutes",
            tags: ["math", "number theory", "gcd", "bezout"]
          }
        ];
        if (content.length === 0) {
          console.warn(`No ${type} content found`);
        }
        resolve(content);
      }, 500);
    });
  } catch (error) {
    console.error(`Error loading ${type} content:`, error);
    throw new Error(`Failed to load ${type} content`);
  }
}
const load = async () => {
  const courses = await listContent("course");
  return { courses };
};
export {
  load
};
