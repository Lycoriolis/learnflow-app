<!-- src/routes/admin/courses/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import { getFirestore, collection, getDocs, query, orderBy, doc, deleteDoc } from 'firebase/firestore';
  
  // Define course type
  interface Course {
    id: string;
    title: string;
    description: string;
    category: string;
    level: string;
    status: 'draft' | 'published' | 'archived';
    enrollments: number;
    createdAt: string;
    updatedAt: string;
  }
  
  let courses: Course[] = [];
  let filteredCourses: Course[] = [];
  let isLoading = true;
  let searchQuery = '';
  let selectedCategory = 'all';
  let selectedStatus = 'all';
  let showConfirmDialog = false;
  let courseToDelete: Course | null = null;
  
  // Simulate API data
  const categories = [
    { id: 'mathematics', name: 'Mathematics' },
    { id: 'computer-science', name: 'Computer Science' },
    { id: 'languages', name: 'Languages' },
    { id: 'science', name: 'Science' },
    { id: 'arts', name: 'Arts & Humanities' }
  ];
  
  onMount(async () => {
    // Simulate API call to get courses
    setTimeout(() => {
      courses = [
        {
          id: 'course1',
          title: 'Introduction to Python',
          description: 'Learn the basics of Python programming language',
          category: 'computer-science',
          level: 'beginner',
          status: 'published',
          enrollments: 45,
          createdAt: '2024-03-15',
          updatedAt: '2024-04-01'
        },
        {
          id: 'course2',
          title: 'Advanced Mathematics',
          description: 'An in-depth course on advanced mathematical concepts',
          category: 'mathematics',
          level: 'advanced',
          status: 'published',
          enrollments: 32,
          createdAt: '2024-02-10',
          updatedAt: '2024-03-25'
        },
        {
          id: 'course3',
          title: 'Web Development Fundamentals',
          description: 'Learn the basics of HTML, CSS, and JavaScript',
          category: 'computer-science',
          level: 'beginner',
          status: 'published',
          enrollments: 53,
          createdAt: '2024-01-20',
          updatedAt: '2024-02-15'
        },
        {
          id: 'course4',
          title: 'French for Beginners',
          description: 'Start learning French from scratch',
          category: 'languages',
          level: 'beginner',
          status: 'draft',
          enrollments: 0,
          createdAt: '2024-04-10',
          updatedAt: '2024-04-10'
        }
      ];
      
      filteredCourses = [...courses];
      isLoading = false;
    }, 1000);
    
    /* Real Firebase implementation would be:
    try {
      const db = getFirestore();
      const coursesRef = collection(db, 'courses');
      const q = query(coursesRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      courses = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          description: data.description,
          category: data.category,
          level: data.level,
          status: data.status,
          enrollments: data.enrollments || 0,
          createdAt: formatDate(data.createdAt?.toDate()),
          updatedAt: formatDate(data.updatedAt?.toDate())
        };
      });
      
      filteredCourses = [...courses];
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      isLoading = false;
    }
    */
  });
  
  // Filter courses based on search query and filters
  $: {
    if (courses.length > 0) {
      filteredCourses = courses.filter(course => {
        const matchesSearch = searchQuery === '' || 
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
        const matchesStatus = selectedStatus === 'all' || course.status === selectedStatus;
        
        return matchesSearch && matchesCategory && matchesStatus;
      });
    }
  }
  
  // Format date
  function formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }
  
  // Get category name by ID
  function getCategoryName(categoryId: string): string {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  }
  
  // Get status badge color
  function getStatusColor(status: string): string {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  }
  
  // Convert level to display text
  function formatLevel(level: string): string {
    return level.charAt(0).toUpperCase() + level.slice(1);
  }
  
  // Confirm course deletion
  function confirmDelete(course: Course) {
    courseToDelete = course;
    showConfirmDialog = true;
  }
  
  // Cancel deletion
  function cancelDelete() {
    courseToDelete = null;
    showConfirmDialog = false;
  }
  
  // Delete course
  async function deleteCourse() {
    if (!courseToDelete) return;
    
    /* Real Firebase implementation would be:
    try {
      const db = getFirestore();
      await deleteDoc(doc(db, 'courses', courseToDelete.id));
      
      // Update local state
      courses = courses.filter(course => course.id !== courseToDelete.id);
      filteredCourses = filteredCourses.filter(course => course.id !== courseToDelete.id);
    } catch (error) {
      console.error('Error deleting course:', error);
    }
    */
    
    // Simulate API call
    courses = courses.filter(course => course.id !== courseToDelete.id);
    filteredCourses = filteredCourses.filter(course => course.id !== courseToDelete.id);
    
    cancelDelete();
  }
</script>

<svelte:head>
  <title>Admin | Manage Courses | LearnFlow</title>
</svelte:head>

<div in:fly={{ y: 20, duration: 300 }}>
  <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Manage Courses</h1>
    <a 
      href="/admin/courses/new" 
      class="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md shadow-sm transition duration-150"
    >
      <i class="fas fa-plus-circle mr-2"></i>
      Add New Course
    </a>
  </div>
  
  <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
    <!-- Filters Section -->
    <div class="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <label for="search" class="sr-only">Search</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i class="fas fa-search text-gray-400"></i>
            </div>
            <input
              id="search"
              type="text"
              bind:value={searchQuery}
              placeholder="Search courses..."
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>
        <div class="sm:w-48">
          <label for="category-filter" class="sr-only">Filter by category</label>
          <select
            id="category-filter"
            bind:value={selectedCategory}
            class="block w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="all">All Categories</option>
            {#each categories as category}
              <option value={category.id}>{category.name}</option>
            {/each}
          </select>
        </div>
        <div class="sm:w-48">
          <label for="status-filter" class="sr-only">Filter by status</label>
          <select
            id="status-filter"
            bind:value={selectedStatus}
            class="block w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>
    </div>
    
    <!-- Courses Table -->
    {#if isLoading}
      <div class="flex justify-center items-center h-64">
        <div class="w-12 h-12 border-4 border-t-indigo-500 border-indigo-200 rounded-full animate-spin"></div>
      </div>
    {:else}
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Course</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Level</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Enrollments</th>
              <th scope="col" class="relative px-6 py-3">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {#each filteredCourses as course}
              <tr>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{course.title}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">{course.description.length > 60 ? course.description.substring(0, 60) + '...' : course.description}</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500 dark:text-gray-400">{getCategoryName(course.category)}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500 dark:text-gray-400">{formatLevel(course.level)}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full {getStatusColor(course.status)}">
                    {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {course.enrollments}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a 
                    href={`/admin/courses/${course.id}`} 
                    class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200 mr-3"
                  >
                    Edit
                  </a>
                  <button 
                    on:click={() => confirmDelete(course)}
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            {/each}
            
            {#if filteredCourses.length === 0}
              <tr>
                <td colspan="6" class="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                  {searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all'
                    ? 'No courses match your filters. Try a different search or filter.'
                    : 'No courses found in the system.'}
                </td>
              </tr>
            {/if}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</div>

<!-- Delete Confirmation Dialog -->
{#if showConfirmDialog && courseToDelete}
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-80 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 mx-4">
      <div class="text-center">
        <div class="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-exclamation-triangle text-red-600 dark:text-red-400 text-xl"></i>
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Delete Course</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Are you sure you want to delete <span class="font-medium">{courseToDelete.title}</span>?
          {#if courseToDelete.enrollments > 0}
            <br><br>
            <span class="text-red-600 dark:text-red-400 font-medium">
              Warning: This course has {courseToDelete.enrollments} active enrollments. 
              Deleting it will remove access for all enrolled students.
            </span>
          {/if}
          <br><br>
          This action cannot be undone.
        </p>
      </div>
      
      <div class="flex justify-end space-x-3">
        <button 
          type="button" 
          on:click={cancelDelete}
          class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150"
        >
          Cancel
        </button>
        <button 
          type="button" 
          on:click={deleteCourse}
          class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
{/if} 