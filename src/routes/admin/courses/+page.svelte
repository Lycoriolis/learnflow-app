<script lang="ts">
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, deleteDoc, Timestamp, query, orderBy } from 'firebase/firestore';
  import { app } from '$lib/firebase.js';
  
  interface Course {
    id?: string; // Firestore document ID
    title: string;
    description: string;
    category: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    published: boolean;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
    // Add other relevant fields like imageURL, instructorId, etc. later
  }

  let isLoading = true;
  let courses: Course[] = [];
  let filteredCourses: Course[] = [];
  let searchQuery = '';

  let showModal = false;
  let isEditing = false;
  let currentCourse: Course = createNewCourse();
  let isSaving = false;
  let saveError = '';

  let showDeleteConfirm = false;
  let courseToDelete: Course | null = null;
  let isDeleting = false;
  let deleteError = '';

  const db = getFirestore(app);
  const coursesCollection = collection(db, 'courses');

  onMount(async () => {
    await loadCourses();
  });

  async function loadCourses() {
    isLoading = true;
    try {
      // Query courses ordered by creation date
      const q = query(coursesCollection, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      courses = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Course));
      filterCourses();
      console.log('Courses loaded:', courses);
    } catch (error) {
      console.error('Error loading courses:', error);
      // Handle error display to user
    } finally {
      isLoading = false;
    }
  }

  function filterCourses() {
    if (searchQuery.trim() === '') {
      filteredCourses = [...courses];
    } else {
      const query = searchQuery.toLowerCase();
      filteredCourses = courses.filter(course => 
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query) ||
        course.category.toLowerCase().includes(query)
      );
    }
  }

  function createNewCourse(): Course {
    return {
      title: '',
      description: '',
      category: '',
      difficulty: 'Beginner',
      published: false,
    };
  }

  function openAddModal() {
    isEditing = false;
    currentCourse = createNewCourse();
    saveError = '';
    showModal = true;
  }

  function openEditModal(course: Course) {
    isEditing = true;
    currentCourse = { ...course }; // Clone the course data
    saveError = '';
    showModal = true;
  }

  function closeModal() {
    showModal = false;
  }

  async function saveCourse() {
    isSaving = true;
    saveError = '';
    try {
      const courseData = { ...currentCourse };
      delete courseData.id; // Don't save the ID within the document data

      if (isEditing && currentCourse.id) {
        // Update existing course
        console.log('Updating course:', currentCourse.id, courseData);
        const courseRef = doc(db, 'courses', currentCourse.id);
        await updateDoc(courseRef, {
          ...courseData,
          updatedAt: Timestamp.now()
        });
        console.log('Course updated successfully');
      } else {
        // Add new course
        console.log('Adding new course:', courseData);
        await addDoc(coursesCollection, {
          ...courseData,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
        console.log('Course added successfully');
      }
      closeModal();
      await loadCourses(); // Reload courses after saving
    } catch (error: any) {
      console.error('Error saving course:', error);
      saveError = error.message || 'Failed to save course. Please try again.';
    } finally {
      isSaving = false;
    }
  }

  function confirmDelete(course: Course) {
    courseToDelete = course;
    deleteError = '';
    showDeleteConfirm = true;
  }

  function cancelDelete() {
    showDeleteConfirm = false;
    courseToDelete = null;
  }

  async function deleteCourse() {
    if (!courseToDelete || !courseToDelete.id) return;
    isDeleting = true;
    deleteError = '';
    try {
      console.log('Deleting course:', courseToDelete.id);
      const courseRef = doc(db, 'courses', courseToDelete.id);
      await deleteDoc(courseRef);
      console.log('Course deleted successfully');
      cancelDelete();
      await loadCourses(); // Reload courses after deleting
    } catch (error: any) {
      console.error('Error deleting course:', error);
      deleteError = error.message || 'Failed to delete course. Please try again.';
    } finally {
      isDeleting = false;
    }
  }

  function formatDate(timestamp?: Timestamp): string {
    if (!timestamp) return 'N/A';
    return timestamp.toDate().toLocaleDateString();
  }
</script>

<svelte:head>
  <title>Admin | Manage Courses | LearnFlow</title>
</svelte:head>

<div in:fly={{ y: 20, duration: 300 }}>
  <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Manage Courses</h1>
    <button 
      on:click={openAddModal}
      class="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md shadow-sm transition duration-150"
    >
      <i class="fas fa-plus mr-2"></i>
      Add New Course
    </button>
  </div>

  <!-- Search Bar -->
  <div class="mb-6">
    <input 
      type="text" 
      placeholder="Search courses by title, description, or category..."
      bind:value={searchQuery}
      on:input={filterCourses}
      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
    />
  </div>

  {#if isLoading}
    <div class="flex justify-center items-center h-64">
      <div class="w-12 h-12 border-4 border-t-indigo-500 border-indigo-200 rounded-full animate-spin"></div>
    </div>
  {:else}
    <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Difficulty</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created</th>
              <th scope="col" class="relative px-6 py-3">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {#if filteredCourses.length === 0}
              <tr>
                <td colspan="6" class="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                  {searchQuery ? 'No courses match your search.' : 'No courses found. Add one!'}
                </td>
              </tr>
            {:else}
              {#each filteredCourses as course}
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{course.title}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">{course.description}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{course.category}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{course.difficulty}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${course.published 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}
                    >
                      {course.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatDate(course.createdAt)}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      on:click={() => openEditModal(course)}
                      class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3"
                      aria-label="Edit course"
                    >
                      <i class="fas fa-pencil-alt"></i>
                    </button>
                    <button 
                      on:click={() => confirmDelete(course)}
                      class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      aria-label="Delete course"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              {/each}
            {/if}
          </tbody>
        </table>
      </div>
    </div>
  {/if}
</div>

<!-- Add/Edit Course Modal -->
{#if showModal}
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-75 flex items-center justify-center z-30" on:click|self={closeModal}>
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full p-6 mx-4 max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-4 border-b pb-3 dark:border-gray-700">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">{isEditing ? 'Edit Course' : 'Add New Course'}</h3>
        <button on:click={closeModal} class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>

      <form on:submit|preventDefault={saveCourse} class="space-y-4">
        {#if saveError}
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <span class="block sm:inline">Error: {saveError}</span>
          </div>
        {/if}

        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
          <input type="text" id="title" bind:value={currentCourse.title} required class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white">
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
          <textarea id="description" rows="4" bind:value={currentCourse.description} required class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"></textarea>
        </div>

        <div>
          <label for="category" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
          <input type="text" id="category" bind:value={currentCourse.category} required class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white">
        </div>

        <div>
          <label for="difficulty" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Difficulty</label>
          <select id="difficulty" bind:value={currentCourse.difficulty} class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white">
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>

        <div class="flex items-center">
          <input id="published" type="checkbox" bind:checked={currentCourse.published} class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:checked:bg-indigo-500">
          <label for="published" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">Published</label>
        </div>

        <div class="flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
          <button type="button" on:click={closeModal} class="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150">
            Cancel
          </button>
          <button type="submit" disabled={isSaving} class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 disabled:opacity-50">
            {#if isSaving}
              <span class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              Saving...
            {:else}
              {isEditing ? 'Update Course' : 'Add Course'}
            {/if}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

<!-- Delete Confirmation Modal -->
{#if showDeleteConfirm}
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-75 flex items-center justify-center z-40" on:click|self={cancelDelete}>
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 mx-4">
      <div class="text-center">
        <div class="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-exclamation-triangle text-red-600 dark:text-red-400 text-xl"></i>
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Delete Course</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Are you sure you want to delete the course "<span class="font-semibold">{courseToDelete?.title}</span>"?
          This action cannot be undone.
        </p>
        {#if deleteError}
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-left" role="alert">
            <span class="block sm:inline">Error: {deleteError}</span>
          </div>
        {/if}
      </div>
      <div class="flex justify-center space-x-4">
        <button on:click={cancelDelete} disabled={isDeleting} class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 disabled:opacity-50">
          Cancel
        </button>
        <button on:click={deleteCourse} disabled={isDeleting} class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 disabled:opacity-50">
          {#if isDeleting}
            <span class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
            Deleting...
          {:else}
            Delete Course
          {/if}
        </button>
      </div>
    </div>
  </div>
{/if} 