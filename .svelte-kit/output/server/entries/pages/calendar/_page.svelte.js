import { h as head, a as pop, p as push } from "../../../chunks/index3.js";
function _page($$payload, $$props) {
  push();
  const events = [
    {
      id: "event-1",
      title: "Introduction to JavaScript",
      date: "2023-04-12",
      time: "10:00 AM",
      type: "lesson",
      description: "Learn the basics of JavaScript programming language",
      course: "Web Development Fundamentals",
      color: "indigo"
    },
    {
      id: "event-2",
      title: "CSS Layout Assignment",
      date: "2023-04-14",
      time: "11:59 PM",
      type: "assignment",
      description: "Complete the CSS grid and flexbox assignment",
      course: "Web Development Fundamentals",
      color: "red"
    },
    {
      id: "event-3",
      title: "Data Visualization Workshop",
      date: "2023-04-18",
      time: "2:00 PM",
      type: "event",
      description: "Online workshop on data visualization techniques",
      location: "Zoom Meeting",
      color: "green"
    },
    {
      id: "event-4",
      title: "Project Proposal Deadline",
      date: "2023-04-20",
      time: "11:59 PM",
      type: "deadline",
      description: "Submit your project proposal",
      course: "UX Research Methods",
      color: "orange"
    },
    {
      id: "event-5",
      title: "Python Data Analysis",
      date: "2023-04-05",
      time: "3:30 PM",
      type: "lesson",
      description: "Using pandas for data analysis",
      course: "Data Science Fundamentals",
      color: "indigo",
      completed: true
    },
    {
      id: "event-6",
      title: "Machine Learning Quiz",
      date: "2023-04-25",
      time: "9:00 AM",
      type: "assignment",
      description: "Quiz on supervised learning algorithms",
      course: "Machine Learning Basics",
      color: "red"
    }
  ];
  let currentDate = /* @__PURE__ */ new Date();
  let currentYear = currentDate.getFullYear();
  let currentMonth = currentDate.getMonth();
  function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }
  function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
  }
  function getEventsForDay(year, month, day) {
    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter((event) => event.date === dateString);
  }
  function getEventsForMonth(year, month) {
    const monthString = String(month + 1).padStart(2, "0");
    const datePrefix = `${year}-${monthString}`;
    return events.filter((event) => event.date.startsWith(datePrefix)).sort((a, b) => {
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date);
      }
      if (a.time && b.time) {
        return a.time.localeCompare(b.time);
      }
      return 0;
    });
  }
  function isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
  }
  {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
    const today = /* @__PURE__ */ new Date();
    const prevMonthDays = [];
    if (firstDayOfMonth > 0) {
      const daysInPrevMonth = getDaysInMonth(currentYear, currentMonth - 1);
      for (let i = daysInPrevMonth - firstDayOfMonth + 1; i <= daysInPrevMonth; i++) {
        prevMonthDays.push({
          day: i,
          isCurrentMonth: false,
          isToday: false,
          events: []
        });
      }
    }
    const currentMonthDays = Array.from({ length: daysInMonth }).map((_, index) => {
      const day = index + 1;
      const date = new Date(currentYear, currentMonth, day);
      return {
        day,
        isCurrentMonth: true,
        isToday: isSameDay(date, today),
        events: getEventsForDay(currentYear, currentMonth, day)
      };
    });
    const allDays = [...prevMonthDays, ...currentMonthDays];
    const cellsNeeded = 42 - allDays.length;
    const nextMonthDays = Array.from({ length: cellsNeeded }).map((_, index) => {
      return {
        day: index + 1,
        isCurrentMonth: false,
        isToday: false,
        events: []
      };
    });
    [...allDays, ...nextMonthDays];
  }
  getEventsForMonth(currentYear, currentMonth);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Calendar | LearnFlow</title>`;
  });
  $$payload.out += `<div class="container mx-auto px-4 py-8 max-w-6xl svelte-rdy7il">`;
  {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="flex justify-center items-center h-64 svelte-rdy7il"><div class="loader svelte-rdy7il"></div></div>`;
  }
  $$payload.out += `<!--]--></div>`;
  pop();
}
export {
  _page as default
};
//# sourceMappingURL=_page.svelte.js.map
