// Database initialization script for LearnFlow
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Check for service account file
const serviceAccountPath = path.join(dirname(__dirname), 'firebase-service-account.json');
if (!fs.existsSync(serviceAccountPath)) {
  console.error('Firebase service account JSON not found at:', serviceAccountPath);
  console.error('Please download your service account key from Firebase console:');
  console.error('  1. Go to Firebase Console > Project settings > Service accounts');
  console.error('  2. Click "Generate new private key"');
  console.error('  3. Save the JSON file as "firebase-service-account.json" in the root of your project');
  process.exit(1);
}

// Initialize Firebase Admin SDK
try {
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
  initializeApp({
    credential: cert(serviceAccount)
  });
  console.log('Firebase Admin SDK initialized successfully');
} catch (error) {
  console.error('Failed to initialize Firebase Admin SDK:', error);
  process.exit(1);
}

const db = getFirestore();
const timestamp = FieldValue.serverTimestamp();

// Helper function to add documents
async function addDocument(collection, docId, data) {
  try {
    const docRef = db.collection(collection).doc(docId);
    await docRef.set({
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp
    });
    console.log(`Added document ${docId} to ${collection}`);
    return docRef;
  } catch (error) {
    console.error(`Error adding document to ${collection}:`, error);
    throw error;
  }
}

// Helper function to add documents with auto-generated ID
async function addDocumentWithAutoId(collection, data) {
  try {
    const docRef = await db.collection(collection).add({
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp
    });
    console.log(`Added document ${docRef.id} to ${collection}`);
    return docRef;
  } catch (error) {
    console.error(`Error adding document to ${collection}:`, error);
    throw error;
  }
}

// Main database setup function
async function setupDatabase() {
  console.log('Starting database setup for LearnFlow...');
  
  // 1. Create admin user
  const adminUserId = 'admin1';
  await addDocument('users', adminUserId, {
    uid: adminUserId,
    email: 'admin@learnflow.app',
    displayName: 'Admin User',
    role: 'admin',
    photoURL: 'https://ui-avatars.com/api/?name=Admin+User&background=random',
    preferences: {
      theme: 'light',
      notifications: true
    },
    bio: 'LearnFlow administrator'
  });

  // 2. Create regular users
  const users = [
    { 
      uid: 'user1', 
      email: 'john@example.com', 
      displayName: 'John Doe', 
      role: 'user',
      photoURL: 'https://ui-avatars.com/api/?name=John+Doe&background=random',
      progress: {
        totalCoursesStarted: 2,
        totalCoursesCompleted: 1,
        totalPoints: 125,
        focusTime: 7200 // in seconds
      }
    },
    { 
      uid: 'user2', 
      email: 'jane@example.com', 
      displayName: 'Jane Smith', 
      role: 'user',
      photoURL: 'https://ui-avatars.com/api/?name=Jane+Smith&background=random',
      progress: {
        totalCoursesStarted: 3,
        totalCoursesCompleted: 2,
        totalPoints: 230,
        focusTime: 10800 // in seconds
      }
    },
    { 
      uid: 'user3', 
      email: 'alex@example.com', 
      displayName: 'Alex Johnson', 
      role: 'user',
      photoURL: 'https://ui-avatars.com/api/?name=Alex+Johnson&background=random',
      progress: {
        totalCoursesStarted: 1,
        totalCoursesCompleted: 0,
        totalPoints: 45,
        focusTime: 3600 // in seconds
      }
    }
  ];

  for (const user of users) {
    await addDocument('users', user.uid, user);
  }

  // 3. Create categories
  const categories = [
    { 
      id: 'programming',
      name: 'Programming',
      description: 'Learn programming languages and software development',
      iconUrl: 'https://example.com/icons/programming.svg',
      color: '#3498db',
      order: 1
    },
    { 
      id: 'mathematics',
      name: 'Mathematics',
      description: 'Explore various mathematics topics',
      iconUrl: 'https://example.com/icons/math.svg',
      color: '#e74c3c',
      order: 2
    },
    { 
      id: 'datascience',
      name: 'Data Science',
      description: 'Learn data analysis, visualization, and machine learning',
      iconUrl: 'https://example.com/icons/datascience.svg',
      color: '#9b59b6',
      order: 3
    }
  ];

  for (const category of categories) {
    await addDocument('categories', category.id, category);
  }

  // 4. Create courses
  const courses = [
    {
      id: 'javascript-basics',
      title: 'JavaScript Fundamentals',
      description: 'Learn the basics of JavaScript programming language',
      imageUrl: 'https://example.com/images/javascript.jpg',
      categoryId: 'programming',
      level: 'beginner',
      duration: 10800, // 3 hours in seconds
      tags: ['javascript', 'web development', 'programming'],
      createdBy: adminUserId,
      published: true,
      enrollmentCount: 24,
      rating: {
        average: 4.7,
        count: 15
      }
    },
    {
      id: 'python-data-analysis',
      title: 'Data Analysis with Python',
      description: 'Learn to analyze data using Python and popular libraries',
      imageUrl: 'https://example.com/images/python-data.jpg',
      categoryId: 'datascience',
      level: 'intermediate',
      duration: 14400, // 4 hours in seconds
      tags: ['python', 'data analysis', 'pandas'],
      createdBy: adminUserId,
      published: true,
      enrollmentCount: 18,
      rating: {
        average: 4.5,
        count: 10
      }
    },
    {
      id: 'calculus-intro',
      title: 'Introduction to Calculus',
      description: 'Master the fundamentals of calculus and its applications',
      imageUrl: 'https://example.com/images/calculus.jpg',
      categoryId: 'mathematics',
      level: 'intermediate',
      duration: 18000, // 5 hours in seconds
      tags: ['mathematics', 'calculus'],
      createdBy: adminUserId,
      published: true,
      enrollmentCount: 12,
      rating: {
        average: 4.2,
        count: 8
      }
    }
  ];

  for (const course of courses) {
    await addDocument('courses', course.id, course);
  }

  // 5. Create lessons for each course
  const javascriptLessons = [
    {
      id: 'js-lesson-1',
      courseId: 'javascript-basics',
      title: 'Introduction to JavaScript',
      description: 'Learn about JavaScript history and its place in web development',
      content: '# Introduction to JavaScript\n\nJavaScript is a programming language used to create dynamic content on websites...',
      order: 1,
      duration: 1800, // 30 minutes
      resources: [
        {
          type: 'video',
          url: 'https://example.com/videos/js-intro.mp4',
          title: 'JavaScript Introduction'
        },
        {
          type: 'article',
          url: 'https://example.com/articles/js-history.html',
          title: 'The History of JavaScript'
        }
      ]
    },
    {
      id: 'js-lesson-2',
      courseId: 'javascript-basics',
      title: 'Variables and Data Types',
      description: 'Learn about variables, primitive types, and operators',
      content: '# Variables and Data Types\n\nIn JavaScript, you declare variables using `let`, `const`, or `var`...',
      order: 2,
      duration: 3600, // 60 minutes
      resources: [
        {
          type: 'video',
          url: 'https://example.com/videos/js-variables.mp4',
          title: 'JavaScript Variables Explained'
        }
      ]
    },
    {
      id: 'js-lesson-3',
      courseId: 'javascript-basics',
      title: 'Functions and Scope',
      description: 'Master JavaScript functions, parameters, and variable scope',
      content: '# Functions and Scope\n\nFunctions are reusable blocks of code that perform a specific task...',
      order: 3,
      duration: 2700, // 45 minutes
      resources: [
        {
          type: 'video',
          url: 'https://example.com/videos/js-functions.mp4',
          title: 'JavaScript Functions Deep Dive'
        }
      ]
    }
  ];

  const pythonLessons = [
    {
      id: 'py-lesson-1',
      courseId: 'python-data-analysis',
      title: 'Python for Data Analysis',
      description: 'Introduction to Python for data analysis',
      content: '# Python for Data Analysis\n\nPython has become the leading language for data analysis and data science...',
      order: 1,
      duration: 2700, // 45 minutes
      resources: [
        {
          type: 'video',
          url: 'https://example.com/videos/python-data-intro.mp4',
          title: 'Python Data Analysis Introduction'
        }
      ]
    },
    {
      id: 'py-lesson-2',
      courseId: 'python-data-analysis',
      title: 'Working with Pandas',
      description: 'Learn to use pandas for data manipulation and analysis',
      content: '# Working with Pandas\n\nPandas is a powerful data analysis library in Python...',
      order: 2,
      duration: 3600, // 60 minutes
      resources: [
        {
          type: 'video',
          url: 'https://example.com/videos/pandas-intro.mp4',
          title: 'Pandas Introduction'
        }
      ]
    }
  ];

  const calculusLessons = [
    {
      id: 'calculus-lesson-1',
      courseId: 'calculus-intro',
      title: 'Limits and Continuity',
      description: 'Understand limits and continuity in calculus',
      content: '# Limits and Continuity\n\nLimits are the foundation of calculus. In this lesson, we\'ll explore...',
      order: 1,
      duration: 3600, // 60 minutes
      resources: [
        {
          type: 'video',
          url: 'https://example.com/videos/limits-intro.mp4',
          title: 'Introduction to Limits'
        }
      ]
    },
    {
      id: 'calculus-lesson-2',
      courseId: 'calculus-intro',
      title: 'Derivatives',
      description: 'Learn the concept of derivatives and how to calculate them',
      content: '# Derivatives\n\nDerivatives measure the rate of change of a function...',
      order: 2,
      duration: 4500, // 75 minutes
      resources: [
        {
          type: 'video',
          url: 'https://example.com/videos/derivatives.mp4',
          title: 'Understanding Derivatives'
        }
      ]
    }
  ];

  const allLessons = [...javascriptLessons, ...pythonLessons, ...calculusLessons];
  for (const lesson of allLessons) {
    await addDocument('lessons', lesson.id, lesson);
  }

  // 6. Create exercises
  const exercises = [
    {
      id: 'js-exercise-1',
      title: 'JavaScript Variables Practice',
      description: 'Practice creating and working with variables in JavaScript',
      courseId: 'javascript-basics',
      lessonId: 'js-lesson-2',
      difficulty: 'beginner',
      type: 'coding',
      instructions: 'Create variables using let, const, and var and assign appropriate values.',
      starterCode: '// Create your variables here\n\n// Don\'t modify below this line\nconsole.log(myString, myNumber, myBoolean);',
      solutionCode: '// Create your variables here\nlet myString = "Hello world";\nconst myNumber = 42;\nvar myBoolean = true;\n\n// Don\'t modify below this line\nconsole.log(myString, myNumber, myBoolean);',
      testCases: [
        {
          input: '',
          expectedOutput: 'Hello world 42 true',
          description: 'Variables should be correctly defined'
        }
      ],
      hints: ['Remember to use appropriate variable declarations (let, const, var)', 'Strings need quotes, numbers don\'t'],
      tags: ['javascript', 'variables'],
      completionTime: 600, // 10 minutes
      points: 10
    },
    {
      id: 'py-exercise-1',
      title: 'Pandas DataFrame Creation',
      description: 'Practice creating and manipulating pandas DataFrames',
      courseId: 'python-data-analysis',
      lessonId: 'py-lesson-2',
      difficulty: 'intermediate',
      type: 'coding',
      instructions: 'Create a pandas DataFrame with columns for "Name", "Age", and "Score", and populate it with at least 3 entries.',
      starterCode: 'import pandas as pd\n\n# Create your DataFrame here\n\n\n# Don\'t modify below this line\nprint(df)',
      solutionCode: 'import pandas as pd\n\n# Create your DataFrame here\ndata = {\n    "Name": ["Alice", "Bob", "Charlie"],\n    "Age": [25, 30, 22],\n    "Score": [85, 92, 78]\n}\ndf = pd.DataFrame(data)\n\n# Don\'t modify below this line\nprint(df)',
      testCases: [
        {
          input: '',
          expectedOutput: '',
          description: 'DataFrame should have 3 columns and at least 3 rows'
        }
      ],
      hints: ['Use a dictionary to define your data', 'Pass the dictionary to pd.DataFrame()'],
      tags: ['python', 'pandas', 'dataframe'],
      completionTime: 900, // 15 minutes
      points: 15
    }
  ];

  for (const exercise of exercises) {
    await addDocument('exercises', exercise.id, exercise);
  }

  // 7. Create user enrollments and progress
  const enrollments = [
    {
      userId: 'user1',
      courseId: 'javascript-basics',
      enrolledAt: timestamp,
      lastAccessedAt: timestamp,
      progress: 33, // percentage
      completedLessons: ['js-lesson-1'],
      completedExercises: ['js-exercise-1'],
      notes: 'Remember to practice variable declarations'
    },
    {
      userId: 'user1',
      courseId: 'python-data-analysis',
      enrolledAt: timestamp,
      lastAccessedAt: timestamp,
      progress: 10, // percentage
      completedLessons: [],
      completedExercises: [],
      notes: ''
    },
    {
      userId: 'user2',
      courseId: 'javascript-basics',
      enrolledAt: timestamp,
      lastAccessedAt: timestamp,
      progress: 100, // percentage
      completedLessons: ['js-lesson-1', 'js-lesson-2', 'js-lesson-3'],
      completedExercises: ['js-exercise-1'],
      notes: 'Completed all lessons, need to review functions'
    },
    {
      userId: 'user2',
      courseId: 'calculus-intro',
      enrolledAt: timestamp,
      lastAccessedAt: timestamp,
      progress: 50, // percentage
      completedLessons: ['calculus-lesson-1'],
      completedExercises: [],
      notes: 'Derivatives are challenging'
    }
  ];

  for (const enrollment of enrollments) {
    await addDocumentWithAutoId('enrollments', enrollment);
  }

  // 8. Create activity records
  const activities = [
    {
      userId: 'user1',
      type: 'course_started',
      timestamp: Timestamp.fromDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)), // 7 days ago
      details: {
        courseId: 'javascript-basics',
        courseTitle: 'JavaScript Fundamentals'
      }
    },
    {
      userId: 'user1',
      type: 'lesson_completed',
      timestamp: Timestamp.fromDate(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)), // 5 days ago
      details: {
        courseId: 'javascript-basics',
        lessonId: 'js-lesson-1',
        lessonTitle: 'Introduction to JavaScript'
      }
    },
    {
      userId: 'user1',
      type: 'exercise_completed',
      timestamp: Timestamp.fromDate(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)), // 3 days ago
      details: {
        exerciseId: 'js-exercise-1',
        exerciseTitle: 'JavaScript Variables Practice',
        points: 10
      }
    },
    {
      userId: 'user2',
      type: 'course_completed',
      timestamp: Timestamp.fromDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)), // 2 days ago
      details: {
        courseId: 'javascript-basics',
        courseTitle: 'JavaScript Fundamentals'
      }
    }
  ];

  for (const activity of activities) {
    await addDocumentWithAutoId('activities', activity);
  }

  // 9. Create forum categories and topics
  const forumCategories = [
    {
      id: 'general-discussion',
      name: 'General Discussion',
      description: 'General discussions about learning and programming',
      iconUrl: 'https://example.com/icons/forum-general.svg',
      order: 1
    },
    {
      id: 'course-help',
      name: 'Course Help',
      description: 'Get help with course materials and exercises',
      iconUrl: 'https://example.com/icons/forum-help.svg',
      order: 2
    },
    {
      id: 'programming-challenges',
      name: 'Programming Challenges',
      description: 'Share and discuss programming challenges',
      iconUrl: 'https://example.com/icons/forum-challenges.svg',
      order: 3
    }
  ];

  for (const category of forumCategories) {
    await addDocument('forumCategories', category.id, category);
  }

  const forumTopics = [
    {
      id: 'js-functions-help',
      title: 'Help understanding JavaScript functions',
      content: 'I\'m struggling to understand the difference between regular functions and arrow functions. Can someone explain?',
      categoryId: 'course-help',
      authorId: 'user1',
      tags: ['javascript', 'functions'],
      views: 24,
      isSticky: false,
      isClosed: false
    },
    {
      id: 'welcome-topic',
      title: 'Welcome to LearnFlow!',
      content: 'Welcome to the LearnFlow community! Feel free to introduce yourself here.',
      categoryId: 'general-discussion',
      authorId: adminUserId,
      tags: ['welcome', 'introduction'],
      views: 56,
      isSticky: true,
      isClosed: false
    }
  ];

  for (const topic of forumTopics) {
    await addDocument('forumTopics', topic.id, topic);
  }

  const forumPosts = [
    {
      topicId: 'js-functions-help',
      content: 'Regular functions have their own `this` binding, while arrow functions inherit `this` from the enclosing scope...',
      authorId: 'user2',
      timestamp: Timestamp.fromDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)) // 1 day ago
    },
    {
      topicId: 'js-functions-help',
      content: 'Thanks for the explanation! That makes sense now.',
      authorId: 'user1',
      timestamp: Timestamp.fromDate(new Date(Date.now() - 12 * 60 * 60 * 1000)) // 12 hours ago
    },
    {
      topicId: 'welcome-topic',
      content: 'Hi everyone! I\'m John and I\'m excited to learn JavaScript and Python.',
      authorId: 'user1',
      timestamp: Timestamp.fromDate(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)) // 6 days ago
    }
  ];

  for (const post of forumPosts) {
    await addDocumentWithAutoId('forumPosts', post);
  }

  // 10. Create some study groups
  const groups = [
    {
      id: 'javascript-study-group',
      name: 'JavaScript Study Group',
      description: 'A group for studying JavaScript together',
      createdBy: 'user2',
      members: ['user1', 'user2', 'user3'],
      courseId: 'javascript-basics',
      isPrivate: false,
      meetingSchedule: {
        dayOfWeek: 2, // Tuesday
        timeUtc: '18:00', // 6 PM UTC
        durationMinutes: 60
      }
    },
    {
      id: 'calculus-help-group',
      name: 'Calculus Support Group',
      description: 'Get help with calculus concepts',
      createdBy: 'user2',
      members: ['user2'],
      courseId: 'calculus-intro',
      isPrivate: false,
      meetingSchedule: {
        dayOfWeek: 4, // Thursday
        timeUtc: '19:00', // 7 PM UTC
        durationMinutes: 90
      }
    }
  ];

  for (const group of groups) {
    await addDocument('groups', group.id, group);
  }

  // 11. Add your Google account as an admin user
  await addDocument('users', 'U6upChZ6k1ce7PKkZQaM1YTrczj1', {
    uid: 'U6upChZ6k1ce7PKkZQaM1YTrczj1',
    email: 'beeelhaj@gmail.com',
    displayName: 'Othmane Belhaj',
    role: 'admin',
    photoURL: 'https://ui-avatars.com/api/?name=Othmane+Belhaj&background=random',
    preferences: {
      theme: 'light',
      notifications: true
    },
    bio: 'LearnFlow administrator'
  });

  console.log('🎉 Database setup complete! Your LearnFlow database has been initialized with sample data.');
}

// Run the setup
setupDatabase()
  .then(() => {
    console.log('Setup completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Setup failed:', error);
    process.exit(1);
  });