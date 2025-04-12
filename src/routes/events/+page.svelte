<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { user } from '$lib/stores/authStore.js';

  // Types
  type PlatformEvent = {
    id: string;
    title: string;
    type: 'Webinar' | 'Workshop' | 'Q&A' | 'Competition' | 'Social';
    date: string;
    startTime: string;
    endTime?: string;
    description: string;
    image?: string;
    location: string; // Can be 'Online', a specific URL, or a physical location
    organizer: string;
    isFeatured?: boolean;
    isRegistered?: boolean;
    tags?: string[];
    registrationLink?: string;
  };

  // Mock Events Data
  const allEvents: PlatformEvent[] = [
    {
      id: 'event-1',
      title: 'Live Q&A: Mastering CSS Grid',
      type: 'Q&A',
      date: '2023-05-15',
      startTime: '4:00 PM UTC',
      description: 'Join expert Sarah Johnson for a live Q&A session on advanced CSS Grid techniques.',
      image: '/images/events/css-grid-qa.jpg',
      location: 'Online - YouTube Live',
      organizer: 'LearnFlow Team',
      isFeatured: true,
      isRegistered: false,
      tags: ['CSS', 'Frontend', 'Q&A'],
      registrationLink: '#'
    },
    {
      id: 'event-2',
      title: 'Workshop: Introduction to Machine Learning',
      type: 'Workshop',
      date: '2023-05-22',
      startTime: '1:00 PM UTC',
      endTime: '5:00 PM UTC',
      description: 'Hands-on workshop covering the fundamentals of machine learning with Python.',
      image: '/images/events/ml-workshop.jpg',
      location: 'Online - Zoom',
      organizer: 'Data Science Society',
      isRegistered: true,
      tags: ['Machine Learning', 'Python', 'Workshop']
    },
    {
      id: 'event-3',
      title: 'Webinar: Building Accessible Web Apps',
      type: 'Webinar',
      date: '2023-05-25',
      startTime: '6:00 PM UTC',
      description: 'Learn best practices for creating web applications accessible to everyone.',
      location: 'Online - Webinar Platform',
      organizer: 'LearnFlow Team',
      isRegistered: false,
      tags: ['Accessibility', 'Web Development', 'Webinar']
    },
    {
      id: 'event-4',
      title: 'LearnFlow Community Meetup',
      type: 'Social',
      date: '2023-06-01',
      startTime: '5:00 PM UTC',
      description: 'Connect with fellow learners and the LearnFlow team in this informal online meetup.',
      location: 'Online - Discord',
      organizer: 'LearnFlow Community',
      isRegistered: false,
      tags: ['Community', 'Social']
    },
     {
      id: 'event-5',
      title: 'Past Event: Design Thinking Challenge',
      type: 'Competition',
      date: '2023-04-10',
      startTime: '9:00 AM UTC',
      endTime: 'April 14th, 5:00 PM UTC',
      description: 'A week-long challenge to apply design thinking principles to solve a real-world problem.',
      image: '/images/events/design-challenge.jpg',
      location: 'Online Platform',
      organizer: 'Design Club',
      isRegistered: true, // Assume user participated
      tags: ['Design Thinking', 'Competition', 'UX']
    }
  ];

  // State for filters
  let selectedType = 'all';
  let selectedDateRange = 'upcoming'; // 'upcoming', 'past', 'all'

  // Event Types for filtering
  const eventTypes = [
    'all',
    ...new Set(allEvents.map(event => event.type))
  ];

  // Filtered Events
  $: filteredEvents = allEvents.filter(event => {
    const matchesType = selectedType === 'all' || event.type === selectedType;
    
    const eventDate = new Date(event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight for accurate date comparison
    
    let matchesDate = true;
    if (selectedDateRange === 'upcoming') {
      matchesDate = eventDate >= today;
    } else if (selectedDateRange === 'past') {
      matchesDate = eventDate < today;
    }
    
    return matchesType && matchesDate;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Sort by date

  // Separate featured event (most recent upcoming featured event)
  $: featuredEvent = filteredEvents.find(event => event.isFeatured && new Date(event.date) >= new Date());

  // Function to format date and time nicely
  function formatEventDateTime(dateStr: string, startTime: string, endTime?: string): string {
    const date = new Date(dateStr);
    const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let formattedString = date.toLocaleDateString('en-US', dateOptions);
    formattedString += ` at ${startTime}`;
    if (endTime) {
      formattedString += ` - ${endTime}`;
    }
    return formattedString;
  }

  // Placeholder for registration logic
  function handleRegistration(eventId: string) {
     console.log(`Handling registration for event ${eventId}`);
     const eventIndex = allEvents.findIndex(e => e.id === eventId);
     if (eventIndex !== -1) {
       allEvents[eventIndex].isRegistered = !allEvents[eventIndex].isRegistered;
       allEvents = [...allEvents]; // Trigger reactivity
     }
  }

  // Loading state
  let loading = true;

  onMount(() => {
    setTimeout(() => {
      loading = false;
    }, 800);
  });
</script>

<svelte:head>
  <title>Events | LearnFlow</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-7xl">
  {#if loading}
    <div class="flex justify-center items-center h-64">
      <div class="loader"></div>
    </div>
  {:else}
    <div in:fade={{ duration: 300 }}>
      <!-- Header Section -->
      <div class="text-center mb-12">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">LearnFlow Events</h1>
        <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Join webinars, workshops, Q&A sessions, and community meetups.
        </p>
      </div>

      <!-- Featured Event Section -->
      {#if featuredEvent}
        <div class="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-800 dark:to-purple-800 rounded-xl shadow-lg p-6 md:p-8 mb-12 text-white">
          <div class="flex flex-col md:flex-row items-center">
            {#if featuredEvent.image}
              <div class="w-full md:w-1/3 mb-4 md:mb-0 md:mr-8 flex-shrink-0">
                <img src={featuredEvent.image} alt={featuredEvent.title} class="rounded-lg shadow-md aspect-video object-cover w-full"/>
              </div>
            {/if}
            <div class="flex-1">
              <span class="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
                Featured Event
              </span>
              <h2 class="text-2xl md:text-3xl font-bold mb-2">{featuredEvent.title}</h2>
              <p class="text-indigo-100 dark:text-indigo-200 mb-3 text-sm">
                 <i class="fas fa-calendar-alt mr-1"></i> {formatEventDateTime(featuredEvent.date, featuredEvent.startTime, featuredEvent.endTime)}
              </p>
              <p class="text-indigo-100 dark:text-indigo-200 mb-5">
                {featuredEvent.description}
              </p>
              <button 
                on:click={() => handleRegistration(featuredEvent.id)}
                class="px-5 py-2.5 rounded-md bg-white text-indigo-700 text-base font-medium hover:bg-gray-50 transition-colors flex items-center"
              >
                 {#if featuredEvent.isRegistered}
                   <i class="fas fa-check-circle mr-2"></i> Registered
                 {:else}
                   <i class="fas fa-ticket-alt mr-2"></i> Register Now
                 {/if}
              </button>
            </div>
          </div>
        </div>
      {/if}

      <!-- Filter Bar -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-8">
        <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
          <span class="text-lg font-medium text-gray-700 dark:text-gray-300">Browse Events</span>
          <div class="flex flex-col sm:flex-row gap-3">
             <div class="relative">
              <select
                class="appearance-none pl-4 pr-10 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[160px] text-sm"
                bind:value={selectedDateRange}
              >
                <option value="upcoming">Upcoming Events</option>
                <option value="past">Past Events</option>
                <option value="all">All Events</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <i class="fas fa-chevron-down text-gray-400"></i>
              </div>
            </div>
            <div class="relative">
              <select
                class="appearance-none pl-4 pr-10 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[160px] text-sm"
                bind:value={selectedType}
              >
                {#each eventTypes as type}
                  <option value={type}>{type === 'all' ? 'All Types' : type}</option>
                {/each}
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <i class="fas fa-chevron-down text-gray-400"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Events List/Grid -->
      {#if filteredEvents.length === 0}
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center">
          <div class="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <i class="fas fa-calendar-times text-gray-400 dark:text-gray-500 text-2xl"></i>
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No events found</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            There are no {selectedDateRange !== 'all' ? selectedDateRange : ''} 
            {selectedType !== 'all' ? selectedType.toLowerCase() : ''} events matching your criteria.
          </p>
          <button 
            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors"
            on:click={() => { selectedType = 'all'; selectedDateRange = 'upcoming'; }}
          >
            Reset Filters
          </button>
        </div>
      {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {#each filteredEvents as event (event.id)}
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col transition-shadow hover:shadow-md">
              {#if event.image}
                <img src={event.image} alt={event.title} class="w-full h-40 object-cover"/>
              {:else}
                 <div class="w-full h-40 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center">
                    <i class="fas fa-calendar-star text-4xl text-purple-400 dark:text-purple-600"></i>
                 </div>
              {/if}
              <div class="p-5 flex-1 flex flex-col">
                <div class="mb-2">
                   <span class="inline-block bg-gray-100 dark:bg-gray-700 text-indigo-800 dark:text-indigo-300 text-xs font-medium px-2.5 py-0.5 rounded-full">{event.type}</span>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">{event.title}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <i class="fas fa-calendar-alt mr-1"></i> {formatEventDateTime(event.date, event.startTime, event.endTime)}
                </p>
                 <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <i class="fas fa-map-marker-alt mr-1"></i> {event.location}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 flex-1">{event.description}</p>
                
                 {#if event.tags && event.tags.length > 0}
                  <div class="flex flex-wrap gap-1 mb-4">
                    {#each event.tags as tag}
                      <span class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
                        #{tag}
                      </span>
                    {/each}
                  </div>
                {/if}
                
                <div class="mt-auto">
                  {#if new Date(event.date) < new Date()}
                     <span class="w-full block text-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-md text-sm font-medium">
                        <i class="fas fa-history mr-2"></i> Event Ended
                     </span>
                  {:else if event.isRegistered}
                     <span class="w-full block text-center px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-md text-sm font-medium">
                        <i class="fas fa-check-circle mr-2"></i> Registered
                     </span>
                  {:else}
                    <button 
                      on:click={() => handleRegistration(event.id)}
                      class="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors flex items-center justify-center"
                    >
                       <i class="fas fa-ticket-alt mr-2"></i> Register
                    </button>
                  {/if}
                </div>
              </div>
            </div>
          {/each}
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

   .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
   .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
   .aspect-video {
    aspect-ratio: 16 / 9;
  }
</style> 