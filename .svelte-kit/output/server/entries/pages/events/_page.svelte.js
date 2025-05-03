import { h as head, a as pop, p as push } from "../../../chunks/index3.js";
import "../../../chunks/authStore.js";
function _page($$payload, $$props) {
  push();
  let filteredEvents;
  let allEvents = [
    {
      id: "event-1",
      title: "Live Q&A: Mastering CSS Grid",
      type: "Q&A",
      date: "2023-05-15",
      startTime: "4:00 PM UTC",
      description: "Join expert Sarah Johnson for a live Q&A session on advanced CSS Grid techniques.",
      image: "/images/events/css-grid-qa.jpg",
      location: "Online - YouTube Live",
      organizer: "LearnFlow Team",
      isFeatured: true,
      isRegistered: false,
      tags: ["CSS", "Frontend", "Q&A"],
      registrationLink: "#"
    },
    {
      id: "event-2",
      title: "Workshop: Introduction to Machine Learning",
      type: "Workshop",
      date: "2023-05-22",
      startTime: "1:00 PM UTC",
      endTime: "5:00 PM UTC",
      description: "Hands-on workshop covering the fundamentals of machine learning with Python.",
      image: "/images/events/ml-workshop.jpg",
      location: "Online - Zoom",
      organizer: "Data Science Society",
      isRegistered: true,
      tags: ["Machine Learning", "Python", "Workshop"]
    },
    {
      id: "event-3",
      title: "Webinar: Building Accessible Web Apps",
      type: "Webinar",
      date: "2023-05-25",
      startTime: "6:00 PM UTC",
      description: "Learn best practices for creating web applications accessible to everyone.",
      location: "Online - Webinar Platform",
      organizer: "LearnFlow Team",
      isRegistered: false,
      tags: [
        "Accessibility",
        "Web Development",
        "Webinar"
      ]
    },
    {
      id: "event-4",
      title: "LearnFlow Community Meetup",
      type: "Social",
      date: "2023-06-01",
      startTime: "5:00 PM UTC",
      description: "Connect with fellow learners and the LearnFlow team in this informal online meetup.",
      location: "Online - Discord",
      organizer: "LearnFlow Community",
      isRegistered: false,
      tags: ["Community", "Social"]
    },
    {
      id: "event-5",
      title: "Past Event: Design Thinking Challenge",
      type: "Competition",
      date: "2023-04-10",
      startTime: "9:00 AM UTC",
      endTime: "April 14th, 5:00 PM UTC",
      description: "A week-long challenge to apply design thinking principles to solve a real-world problem.",
      image: "/images/events/design-challenge.jpg",
      location: "Online Platform",
      organizer: "Design Club",
      isRegistered: true,
      // Assume user participated
      tags: ["Design Thinking", "Competition", "UX"]
    }
  ];
  [
    "all",
    ...new Set(allEvents.map((event) => event.type))
  ];
  filteredEvents = allEvents.filter((event) => {
    const eventDate = new Date(event.date);
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    let matchesDate = true;
    {
      matchesDate = eventDate >= today;
    }
    return matchesDate;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  filteredEvents.find((event) => event.isFeatured && new Date(event.date) >= /* @__PURE__ */ new Date());
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Events | LearnFlow</title>`;
  });
  $$payload.out += `<div class="container mx-auto px-4 py-8 max-w-7xl svelte-55jp0q">`;
  {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="flex justify-center items-center h-64 svelte-55jp0q"><div class="loader svelte-55jp0q"></div></div>`;
  }
  $$payload.out += `<!--]--></div>`;
  pop();
}
export {
  _page as default
};
//# sourceMappingURL=_page.svelte.js.map
