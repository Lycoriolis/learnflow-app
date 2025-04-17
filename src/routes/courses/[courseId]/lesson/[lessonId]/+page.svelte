<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { isAuthenticated, loading } from '$lib/stores/authStore.js';
  import MarkdownRenderer from '$lib/components/MarkdownRenderer.svelte';
  import CourseFlashcardGenerator from '$lib/components/CourseFlashcardGenerator.svelte';
  
  // Get course and lesson IDs from the route params
  $: courseId = $page.params.courseId;
  $: lessonId = $page.params.lessonId;
  
  // Course and lesson state
  let course: any = null;
  let lesson: any = null;
  let lessonContent = '';
  let isLoading = true;
  let error: string | null = null;
  let currentModuleIndex = 0;
  let currentLessonIndex = 0;
  
  // Example markdown content for demonstration
  // In a real app, this would be loaded from an API or static files
  const sampleLessonContent = `
# HTML Elements and Structure

## Introduction to HTML Elements

HTML (HyperText Markup Language) documents are made up of HTML elements. An HTML element is defined by a start tag, some content, and an end tag.

For example, a paragraph element looks like this:

\`\`\`html
<p>This is a paragraph.</p>
\`\`\`

In this example, \`<p>\` is the start tag, "This is a paragraph." is the content, and \`</p>\` is the end tag.

## Document Structure

A basic HTML document has a specific structure:

\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>Page Title</title>
    <meta charset="UTF-8">
</head>
<body>
    <h1>Main Heading</h1>
    <p>This is a paragraph.</p>
</body>
</html>
\`\`\`

Let's break down each part:

1. \`<!DOCTYPE html>\` - Declares the document type as HTML5
2. \`<html>\` - The root element of an HTML page
3. \`<head>\` - Contains meta information about the document
4. \`<title>\` - Specifies the title of the document (shown in browser tabs)
5. \`<meta charset="UTF-8">\` - Specifies the character encoding
6. \`<body>\` - Contains the visible page content

## Common HTML Elements

Here are some common HTML elements you'll use frequently:

### Headings

HTML has six levels of headings, from \`<h1>\` (most important) to \`<h6>\` (least important):

\`\`\`html
<h1>Main Heading</h1>
<h2>Subheading</h2>
<h3>Section Heading</h3>
<h4>Sub-section Heading</h4>
<h5>Minor Heading</h5>
<h6>Smallest Heading</h6>
\`\`\`

### Paragraphs and Text Formatting

\`\`\`html
<p>This is a paragraph.</p>
<p>This is another paragraph with <strong>bold text</strong> and <em>italic text</em>.</p>
\`\`\`

### Lists

Unordered list:

\`\`\`html
<ul>
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
</ul>
\`\`\`

Ordered list:

\`\`\`html
<ol>
    <li>First item</li>
    <li>Second item</li>
    <li>Third item</li>
</ol>
\`\`\`

### Links and Images

\`\`\`html
<a href="https://www.example.com">Link to Example</a>

<img src="image.jpg" alt="Description of the image">
\`\`\`

## Practice Exercise

Try creating a simple HTML page with the following elements:

1. An appropriate document structure
2. A main heading
3. A paragraph of text
4. An unordered list with at least 3 items
5. A link to your favorite website
6. An image (you can use a placeholder image URL)

Then check your work using an HTML validator like [W3C Markup Validation Service](https://validator.w3.org/).
`;
  
  // Load the course and lesson data
  onMount(async () => {
    isLoading = true;
    error = null;
    
    try {
      // In a real app, you would fetch course and lesson data from an API
      // For this example, we'll use mock data
      course = getMockCourse(courseId);
      
      if (!course) {
        error = 'Course not found';
        isLoading = false;
        return;
      }
      
      // Find the lesson within the course modules
      let foundLesson = null;
      let moduleIndex = -1;
      let lessonIndex = -1;
      
      course.modules.forEach((module, mIndex) => {
        const lIndex = module.lessons.findIndex(l => l.id === lessonId);
        if (lIndex !== -1) {
          foundLesson = module.lessons[lIndex];
          moduleIndex = mIndex;
          lessonIndex = lIndex;
        }
      });
      
      if (foundLesson) {
        lesson = foundLesson;
        currentModuleIndex = moduleIndex;
        currentLessonIndex = lessonIndex;
        
        // In a real app, you would fetch the lesson content
        // For this example, we'll use the sample content
        lessonContent = sampleLessonContent;
      } else {
        error = 'Lesson not found';
      }
    } catch (err) {
      console.error('Error loading lesson:', err);
      error = 'Failed to load lesson content';
    } finally {
      isLoading = false;
    }
  });
  
  // Mock course data
  function getMockCourse(id) {
    if (id === 'web-development-101') {
      return {
        id: 'web-development-101',
        title: 'Web Development 101',
        description: 'Learn the basics of web development',
        category: 'Web Development',
        modules: [
          {
            id: 'mod-1',
            title: 'HTML Basics',
            lessons: [
              { id: 'html-intro', title: 'Introduction to HTML' },
              { id: 'html-elements', title: 'HTML Elements and Structure' },
              { id: 'html-forms', title: 'HTML Forms' }
            ]
          },
          {
            id: 'mod-2',
            title: 'CSS Fundamentals',
            lessons: [
              { id: 'css-intro', title: 'Introduction to CSS' },
              { id: 'css-selectors', title: 'CSS Selectors' },
              { id: 'css-box-model', title: 'The Box Model' }
            ]
          }
        ]
      };
    }
    return null;
  }
  
  // Get next and previous lessons
  $: nextLesson = getNextLesson();
  $: prevLesson = getPrevLesson();
  
  function getNextLesson() {
    if (!course || !lesson) return null;
    
    const module = course.modules[currentModuleIndex];
    if (currentLessonIndex < module.lessons.length - 1) {
      // Next lesson in the same module
      return {
        id: module.lessons[currentLessonIndex + 1].id,
        title: module.lessons[currentLessonIndex + 1].title,
        courseId: course.id
      };
    } else if (currentModuleIndex < course.modules.length - 1) {
      // First lesson in the next module
      const nextModule = course.modules[currentModuleIndex + 1];
      return {
        id: nextModule.lessons[0].id,
        title: nextModule.lessons[0].title,
        courseId: course.id
      };
    }
    return null;
  }
  
  function getPrevLesson() {
    if (!course || !lesson) return null;
    
    if (currentLessonIndex > 0) {
      // Previous lesson in the same module
      const module = course.modules[currentModuleIndex];
      return {
        id: module.lessons[currentLessonIndex - 1].id,
        title: module.lessons[currentLessonIndex - 1].title,
        courseId: course.id
      };
    } else if (currentModuleIndex > 0) {
      // Last lesson in the previous module
      const prevModule = course.modules[currentModuleIndex - 1];
      const lastLessonIndex = prevModule.lessons.length - 1;
      return {
        id: prevModule.lessons[lastLessonIndex].id,
        title: prevModule.lessons[lastLessonIndex].title,
        courseId: course.id
      };
    }
    return null;
  }
</script>

<svelte:head>
  <title>LearnFlow | {lesson ? lesson.title : 'Lesson'}</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
  {#if $loading}
    <div class="flex justify-center items-center min-h-[calc(100vh-200px)] text-4xl text-indigo-500">
      <i class="fas fa-spinner fa-spin"></i>
    </div>
  {:else if !$isAuthenticated}
    <div class="text-center py-10">
      <p class="text-xl text-gray-600 dark:text-gray-300 mb-4">Please log in to access course content.</p>
      <a 
        href={`/login?redirect=/courses/${courseId}/lesson/${lessonId}`}
        class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition duration-150"
      >
        Log In
      </a>
    </div>
  {:else if isLoading}
    <div class="flex justify-center items-center min-h-[calc(100vh-200px)] text-4xl text-indigo-500">
      <i class="fas fa-spinner fa-spin"></i>
    </div>
  {:else if error}
    <div class="text-center py-10">
      <h1 class="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Error</h1>
      <p class="text-gray-600 dark:text-gray-300">{error}</p>
      <a href="/courses" class="mt-6 inline-block px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition duration-150">
        Back to Courses
      </a>
    </div>
  {:else if course && lesson}
    <!-- Course/Lesson Header -->
    <div class="mb-6">
      <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
        <a href="/courses" class="hover:text-indigo-600 dark:hover:text-indigo-400">Courses</a>
        <span class="mx-2">›</span>
        <a href="/courses/{course.id}" class="hover:text-indigo-600 dark:hover:text-indigo-400">{course.title}</a>
        <span class="mx-2">›</span>
        <span>{lesson.title}</span>
      </div>
      
      <h1 class="mt-4 text-3xl font-bold text-gray-900 dark:text-white">{lesson.title}</h1>
      <p class="text-gray-600 dark:text-gray-300 mt-2">Module {currentModuleIndex + 1}: {course.modules[currentModuleIndex].title}</p>
    </div>
    
    <!-- Lesson Content with Markdown -->
    <div class="grid grid-cols-12 gap-6">
      <!-- Main Content -->
      <div class="col-span-12 lg:col-span-9">
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden mb-6">
          <div class="p-6">
            <MarkdownRenderer content={lessonContent} className="bg-white dark:bg-gray-800" />
          </div>
          
          <!-- Add flashcard generator -->
          <div class="border-t border-gray-200 dark:border-gray-700 p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <i class="fas fa-layer-group mr-2 text-orange-500"></i>
              Create Flashcards from Lesson
            </h3>
            <CourseFlashcardGenerator content={lessonContent} courseName={course.title} />
          </div>
        </div>
        
        <!-- Navigation Buttons -->
        <div class="flex justify-between items-center mt-6">
          {#if prevLesson}
            <a 
              href="/courses/{prevLesson.courseId}/lesson/{prevLesson.id}" 
              class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <i class="fas fa-arrow-left mr-2"></i>
              {prevLesson.title}
            </a>
          {:else}
            <div></div>
          {/if}
          
          {#if nextLesson}
            <a 
              href="/courses/{nextLesson.courseId}/lesson/{nextLesson.id}" 
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {nextLesson.title}
              <i class="fas fa-arrow-right ml-2"></i>
            </a>
          {:else}
            <a 
              href="/courses/{course.id}"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Complete Course
              <i class="fas fa-check ml-2"></i>
            </a>
          {/if}
        </div>
      </div>
      
      <!-- Sidebar - Module/Lesson Navigation -->
      <div class="col-span-12 lg:col-span-3">
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden sticky top-4">
          <div class="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <h3 class="font-medium text-gray-900 dark:text-white">Course Contents</h3>
          </div>
          
          <div class="p-4">
            <a href="/courses/{course.id}" class="text-indigo-600 dark:text-indigo-400 hover:underline text-sm mb-4 inline-block">
              <i class="fas fa-arrow-left mr-1"></i> Back to course overview
            </a>
            
            <div class="mt-3 space-y-4">
              {#each course.modules as module, moduleIndex}
                <div>
                  <h4 class="font-medium text-gray-800 dark:text-white mb-1">
                    Module {moduleIndex + 1}: {module.title}
                  </h4>
                  <ul class="ml-4 space-y-1">
                    {#each module.lessons as moduleLesson, lessonIndex}
                      <li>
                        <a 
                          href="/courses/{course.id}/lesson/{moduleLesson.id}" 
                          class="block py-1 px-2 text-sm rounded {moduleLesson.id === lesson.id ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-medium' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}"
                        >
                          {moduleIndex + 1}.{lessonIndex + 1} - {moduleLesson.title}
                        </a>
                      </li>
                    {/each}
                  </ul>
                </div>
              {/each}
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
