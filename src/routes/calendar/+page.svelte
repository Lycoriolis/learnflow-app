<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { user } from '$lib/stores/authStore.js';

  // Types
  type CalendarEvent = {
    id: string;
    title: string;
    date: string;
    time?: string;
    type: 'lesson' | 'assignment' | 'deadline' | 'event';
    description?: string;
    course?: string;
    location?: string;
    color?: string;
    completed?: boolean;
  };

  // Mock events data
  const events: CalendarEvent[] = [
    {
      id: 'event-1',
      title: 'Introduction to JavaScript',
      date: '2023-04-12',
      time: '10:00 AM',
      type: 'lesson',
      description: 'Learn the basics of JavaScript programming language',
      course: 'Web Development Fundamentals',
      color: 'indigo'
    },
    {
      id: 'event-2',
      title: 'CSS Layout Assignment',
      date: '2023-04-14',
      time: '11:59 PM',
      type: 'assignment',
      description: 'Complete the CSS grid and flexbox assignment',
      course: 'Web Development Fundamentals',
      color: 'red'
    },
    {
      id: 'event-3',
      title: 'Data Visualization Workshop',
      date: '2023-04-18',
      time: '2:00 PM',
      type: 'event',
      description: 'Online workshop on data visualization techniques',
      location: 'Zoom Meeting',
      color: 'green'
    },
    {
      id: 'event-4',
      title: 'Project Proposal Deadline',
      date: '2023-04-20',
      time: '11:59 PM',
      type: 'deadline',
      description: 'Submit your project proposal',
      course: 'UX Research Methods',
      color: 'orange'
    },
    {
      id: 'event-5',
      title: 'Python Data Analysis',
      date: '2023-04-05',
      time: '3:30 PM',
      type: 'lesson',
      description: 'Using pandas for data analysis',
      course: 'Data Science Fundamentals',
      color: 'indigo',
      completed: true
    },
    {
      id: 'event-6',
      title: 'Machine Learning Quiz',
      date: '2023-04-25',
      time: '9:00 AM',
      type: 'assignment',
      description: 'Quiz on supervised learning algorithms',
      course: 'Machine Learning Basics',
      color: 'red'
    }
  ];

  // Calendar state
  let currentDate = new Date();
  let currentView = 'month';
  let currentYear = currentDate.getFullYear();
  let currentMonth = currentDate.getMonth();

  // Navigation functions
  function prevMonth() {
    if (currentMonth === 0) {
      currentYear -= 1;
      currentMonth = 11;
    } else {
      currentMonth -= 1;
    }
    currentDate = new Date(currentYear, currentMonth, 1); // Update currentDate
  }

  function nextMonth() {
    if (currentMonth === 11) {
      currentYear += 1;
      currentMonth = 0;
    } else {
      currentMonth += 1;
    }
    currentDate = new Date(currentYear, currentMonth, 1); // Update currentDate
  }

  function goToToday() {
    const today = new Date();
    currentYear = today.getFullYear();
    currentMonth = today.getMonth();
    currentDate = today; // Update currentDate to today
  }

  // Calendar helpers
  function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
  }

  function getFirstDayOfMonth(year: number, month: number): number {
    return new Date(year, month, 1).getDay();
  }

  function getEventsForDay(year: number, month: number, day: number): CalendarEvent[] {
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => event.date === dateString);
  }

  function getEventsForMonth(year: number, month: number): CalendarEvent[] {
    const monthString = String(month + 1).padStart(2, '0');
    const datePrefix = `${year}-${monthString}`;
    return events.filter(event => event.date.startsWith(datePrefix))
      .sort((a, b) => {
        // Sort by date first
        if (a.date !== b.date) {
          return a.date.localeCompare(b.date);
        }
        // Then by time if available
        if (a.time && b.time) {
          // Simple time comparison (needs improvement for robust AM/PM handling)
          return a.time.localeCompare(b.time);
        }
        return 0;
      });
  }

  function formatMonthYear(date: Date): string {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  function getDayName(day: number): string {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day];
  }

  function isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  function getEventIcon(type: string): string {
    switch(type) {
      case 'lesson': return 'fa-book';
      case 'assignment': return 'fa-tasks';
      case 'deadline': return 'fa-clock';
      case 'event': return 'fa-calendar-alt';
      default: return 'fa-calendar-alt';
    }
  }

  // Build the days array for the month view
  let calendarDays: Array<{
    day: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    events: CalendarEvent[];
  }> = [];

  $: {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
    const today = new Date();

    // Previous month days
    const prevMonthDays = [];
    if (firstDayOfMonth > 0) {
      const daysInPrevMonth = getDaysInMonth(currentYear, currentMonth - 1);
      for (let i = daysInPrevMonth - firstDayOfMonth + 1; i <= daysInPrevMonth; i++) {
        prevMonthDays.push({ day: i, isCurrentMonth: false, isToday: false, events: [] });
      }
    }

    // Current month days
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

    // Next month days (to fill up to 6 weeks/42 cells for consistent height)
    const cellsNeeded = 42 - allDays.length;
    const nextMonthDays = Array.from({ length: cellsNeeded }).map((_, index) => {
      return { day: index + 1, isCurrentMonth: false, isToday: false, events: [] };
    });

    calendarDays = [...allDays, ...nextMonthDays];
  }

  // Get events for the selected month
  $: monthEvents = getEventsForMonth(currentYear, currentMonth);

  let loading = true;

  onMount(() => {
    setTimeout(() => {
      loading = false;
    }, 800);
  });
</script>

<svelte:head>
  <title>Calendar | LearnFlow</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-6xl">
  {#if loading}
    <div class="flex justify-center items-center h-64">
      <div class="loader"></div>
    </div>
  {:else}
    <div in:fade={{ duration: 300 }}>
      <!-- Header Section -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Calendar</h1>
          <p class="text-gray-600 dark:text-gray-400">Manage your learning schedule and deadlines</p>
        </div>

        <div class="mt-4 md:mt-0 flex space-x-2">
          <button
            on:click={goToToday}
            class="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-sm font-medium border border-gray-300 dark:border-gray-600 transition-colors flex items-center"
          >
            <i class="fas fa-calendar-day mr-2"></i>
            Today
          </button>
          <a
            href="/calendar/add"
            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium flex items-center transition-colors"
          >
            <i class="fas fa-plus mr-2"></i>
            Add Event
          </a>
        </div>
      </div>

      <!-- Calendar Controls -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
        <div class="p-4 flex flex-col sm:flex-row justify-between items-center border-b border-gray-200 dark:border-gray-700">
          <!-- Month/Year Navigation -->
          <div class="flex items-center mb-4 sm:mb-0">
            <button
              on:click={prevMonth}
              class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
              aria-label="Previous month"
            >
              <i class="fas fa-chevron-left"></i>
            </button>

            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mx-4">
              {formatMonthYear(currentDate)}
            </h2>

            <button
              on:click={nextMonth}
              class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
              aria-label="Next month"
            >
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>

          <!-- View Toggle -->
          <div class="inline-flex rounded-md shadow-sm">
            <button
              on:click={() => currentView = 'month'}
              class={`px-4 py-2 text-sm font-medium border ${
                currentView === 'month'
                  ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              } rounded-l-md transition-colors`}
            >
              <i class="fas fa-calendar-alt mr-1"></i>
              Month
            </button>
            <button
              on:click={() => currentView = 'week'}
              class={`px-4 py-2 text-sm font-medium border-t border-b ${
                currentView === 'week'
                  ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              } transition-colors`}
            >
              <i class="fas fa-calendar-week mr-1"></i>
              Week
            </button>
            <button
              on:click={() => currentView = 'day'}
              class={`px-4 py-2 text-sm font-medium border-t border-b ${
                currentView === 'day'
                  ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              } transition-colors`}
            >
              <i class="fas fa-calendar-day mr-1"></i>
              Day
            </button>
            <button
              on:click={() => currentView = 'list'}
              class={`px-4 py-2 text-sm font-medium border ${
                currentView === 'list'
                  ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              } rounded-r-md transition-colors`}
            >
              <i class="fas fa-list mr-1"></i>
              List
            </button>
          </div>
        </div>
      </div>

      <!-- Calendar Views -->
      {#if currentView === 'month'}
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <!-- Day headers -->
          <div class="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
            {#each ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as day}
              <div class="py-2 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
                {day}
              </div>
            {/each}
          </div>

          <!-- Calendar days -->
          <div class="grid grid-cols-7 grid-rows-6">
            {#each calendarDays as { day, isCurrentMonth, isToday, events } (day + isCurrentMonth.toString())}
              <div
                class={`min-h-[120px] p-1.5 border-r border-b border-gray-200 dark:border-gray-700 last:border-r-0 flex flex-col ${
                  isCurrentMonth ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-850'
                } ${isToday ? 'ring-2 ring-inset ring-indigo-500 dark:ring-indigo-400 z-10' : ''}`}
              >
                <div class="flex justify-between items-center mb-1">
                  <div
                    class={`text-sm font-medium rounded-full w-7 h-7 flex items-center justify-center ${
                      isToday
                        ? 'bg-indigo-500 text-white'
                        : isCurrentMonth
                          ? 'text-gray-900 dark:text-white'
                          : 'text-gray-400 dark:text-gray-500'
                    }`}
                  >
                    {day}
                  </div>
                  <!-- Add event button on hover? -->
                </div>

                {#if isCurrentMonth && events.length > 0}
                  <div class="flex-1 mt-1 space-y-1 overflow-y-auto">
                    {#each events as event}
                      <div
                        class="text-xs p-1 rounded bg-{event.color || 'indigo'}-100 dark:bg-{event.color || 'indigo'}-900/20
                               text-{event.color || 'indigo'}-700 dark:text-{event.color || 'indigo'}-300
                               flex items-center opacity-90 hover:opacity-100 cursor-pointer truncate border-l-2
                               border-{event.color || 'indigo'}-500"
                        title={event.title}
                      >
                        <i class={`fas ${getEventIcon(event.type)} mr-1 text-{event.color || 'indigo'}-500 dark:text-{event.color || 'indigo'}-400`}></i>
                        <span class="truncate">{event.title}</span>
                      </div>
                    {/each}
                  </div>
                {/if}
              </div>
            {/each}
          </div>
        </div>

      {:else if currentView === 'list'}
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
          <div class="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              {formatMonthYear(currentDate)} Events
            </h2>
          </div>

          {#if monthEvents.length === 0}
            <div class="p-8 text-center">
              <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mx-auto flex items-center justify-center mb-4">
                <i class="fas fa-calendar text-gray-400 dark:text-gray-500 text-2xl"></i>
              </div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No events scheduled</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-4">
                You don't have any events scheduled for this month.
              </p>
              <a
                href="/calendar/add"
                class="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors"
              >
                <i class="fas fa-plus mr-2"></i>
                Add Event
              </a>
            </div>
          {:else}
            <div class="divide-y divide-gray-200 dark:divide-gray-700">
              {#each monthEvents as event}
                <div class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div class="flex items-start">
                    <!-- Event Type Icon -->
                    <div class="mr-4 flex-shrink-0 mt-1">
                      <div class="w-10 h-10 rounded-full flex items-center justify-center bg-{event.color || 'indigo'}-100 dark:bg-{event.color || 'indigo'}-900/20">
                        <i class={`fas ${getEventIcon(event.type)} text-{event.color || 'indigo'}-600 dark:text-{event.color || 'indigo'}-400`}></i>
                      </div>
                    </div>

                    <!-- Event Details -->
                    <div class="flex-1">
                      <h3 class="text-base font-medium text-gray-900 dark:text-white">
                        {event.title}
                        {#if event.completed}
                          <span class="ml-2 text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded-full font-medium">
                            <i class="fas fa-check-circle mr-1"></i>Completed
                          </span>
                        {/if}
                      </h3>

                      <div class="mt-1 flex flex-wrap text-sm text-gray-500 dark:text-gray-400 gap-x-3 gap-y-1">
                        <span>
                          <i class="fas fa-calendar-day mr-1 opacity-75"></i>
                          {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </span>

                        {#if event.time}
                          <span>
                            <i class="fas fa-clock mr-1 opacity-75"></i>
                            {event.time}
                          </span>
                        {/if}

                        {#if event.course}
                          <span>
                            <i class="fas fa-graduation-cap mr-1 opacity-75"></i>
                            {event.course}
                          </span>
                        {/if}

                        {#if event.location}
                          <span>
                            <i class="fas fa-map-marker-alt mr-1 opacity-75"></i>
                            {event.location}
                          </span>
                        {/if}

                        <span class="capitalize">
                          <i class={`fas ${getEventIcon(event.type)} mr-1 opacity-75`}></i>
                          {event.type}
                        </span>
                      </div>

                      {#if event.description}
                        <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
                          {event.description}
                        </p>
                      {/if}
                    </div>

                    <!-- Actions -->
                    <div class="ml-4 flex-shrink-0 flex space-x-1">
                      <button class="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300" title="Edit">
                        <i class="fas fa-pencil-alt text-xs"></i>
                      </button>
                      {#if !event.completed && (event.type === 'lesson' || event.type === 'assignment')}
                        <button class="p-1 text-gray-400 hover:text-green-600 dark:text-gray-500 dark:hover:text-green-400" title="Mark as completed">
                          <i class="fas fa-check text-xs"></i>
                        </button>
                      {/if}
                      <button class="p-1 text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400" title="Delete">
                        <i class="fas fa-trash-alt text-xs"></i>
                      </button>
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </div>

      <!-- Placeholder for Week/Day views -->
      {:else}
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center">
          <div class="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/20 rounded-full mx-auto flex items-center justify-center mb-4">
            <i class={`fas fa-calendar-${currentView === 'week' ? 'week' : 'day'} text-indigo-600 dark:text-indigo-400 text-2xl`}></i>
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">{currentView === 'week' ? 'Week' : 'Day'} View Coming Soon</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            We're working on a detailed {currentView} view. For now, you can use the month or list view to see your scheduled events.
          </p>
          <button
            on:click={() => currentView = 'month'}
            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors"
          >
            Return to Month View
          </button>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .loader {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-left-color: #4f46e5;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Ensure calendar grid maintains height */
  .grid-rows-6 {
    grid-template-rows: repeat(6, minmax(120px, 1fr));
  }
</style> 