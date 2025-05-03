const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
const app = initializeApp({
  credential: cert(serviceAccount)
});
const db = getFirestore(app);

async function readMarkdownContent(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf-8');
    }
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
  }
  return null;
}

async function migrateCourses() {
  const coursesDir = path.join(__dirname, '../static/content/courses');
  const indexPath = path.join(coursesDir, 'index.json');
  
  if (!fs.existsSync(indexPath)) {
    console.log('No courses index file found');
    return;
  }

  const indexData = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
  const { categories, featuredCourses } = indexData;

  // Migrate categories
  for (const category of categories) {
    await db.collection('courseCategories').doc(category.id).set(category);
    console.log(`Migrated course category: ${category.title}`);
  }

  // Migrate courses
  for (const course of featuredCourses) {
    const courseId = course.id;
    const courseDir = path.join(coursesDir, courseId);
    
    if (!fs.existsSync(courseDir)) {
      console.log(`Course directory not found: ${courseId}`);
      continue;
    }

    // Read course content
    const courseFiles = fs.readdirSync(courseDir);
    const courseContent = {};
    
    for (const file of courseFiles) {
      if (file.endsWith('.md')) {
        const filePath = path.join(courseDir, file);
        const content = await readMarkdownContent(filePath);
        if (content) {
          courseContent[path.parse(file).name] = content;
        }
      }
    }

    const courseWithMetadata = {
      ...course,
      content: courseContent,
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublished: true,
        author: 'System'
      }
    };

    await db.collection('courses').doc(courseId).set(courseWithMetadata);
    console.log(`Migrated course: ${course.title} (${courseId})`);
  }
}

async function migrateExercises() {
  const exercisesDir = path.join(__dirname, '../static/content/exercises');
  const indexPath = path.join(exercisesDir, 'index.json');
  
  if (!fs.existsSync(indexPath)) {
    console.log('No exercises index file found');
    return;
  }

  const indexData = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
  const { exercises, categories } = indexData;

  // Migrate categories
  for (const category of categories) {
    await db.collection('exerciseCategories').doc(category.id).set(category);
    console.log(`Migrated exercise category: ${category.title}`);
  }

  // Migrate exercises
  for (const exercise of exercises) {
    const exerciseId = exercise.id;
    const exercisePath = path.join(exercisesDir, exercise.path);
    
    // Read exercise content
    const content = await readMarkdownContent(exercisePath);
    
    const exerciseWithMetadata = {
      ...exercise,
      content: content || '',
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublished: true,
        author: 'System'
      }
    };

    await db.collection('exercises').doc(exerciseId).set(exerciseWithMetadata);
    console.log(`Migrated exercise: ${exercise.title} (${exerciseId})`);
  }
}

async function main() {
  try {
    console.log('Starting content migration...');
    
    // Clear existing data
    console.log('Clearing existing data...');
    const coursesSnapshot = await db.collection('courses').get();
    const exercisesSnapshot = await db.collection('exercises').get();
    const courseCategoriesSnapshot = await db.collection('courseCategories').get();
    const exerciseCategoriesSnapshot = await db.collection('exerciseCategories').get();
    
    const batch = db.batch();
    coursesSnapshot.docs.forEach(doc => batch.delete(doc.ref));
    exercisesSnapshot.docs.forEach(doc => batch.delete(doc.ref));
    courseCategoriesSnapshot.docs.forEach(doc => batch.delete(doc.ref));
    exerciseCategoriesSnapshot.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
    
    // Migrate new data
    await migrateCourses();
    await migrateExercises();
    
    console.log('Content migration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

main(); 