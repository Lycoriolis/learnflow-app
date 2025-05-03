import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CourseStructure, Exercise } from '../src/lib/types/shared';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
const app = initializeApp({
  credential: cert(serviceAccount)
});
const db = getFirestore(app);

async function migrateCourses() {
  const coursesDir = path.join(__dirname, '../static/content/courses');
  const courseFiles = fs.readdirSync(coursesDir);

  for (const file of courseFiles) {
    if (file.endsWith('.json')) {
      const coursePath = path.join(coursesDir, file);
      const courseData = JSON.parse(fs.readFileSync(coursePath, 'utf-8')) as CourseStructure;

      // Add metadata
      const courseWithMetadata = {
        ...courseData,
        metadata: {
          ...courseData.metadata,
          createdAt: new Date(),
          updatedAt: new Date(),
          isPublished: true
        }
      };

      // Store in Firestore
      await db.collection('courses').doc(courseData.id).set(courseWithMetadata);
      console.log(`Migrated course: ${courseData.title}`);
    }
  }
}

async function migrateExercises() {
  const exercisesDir = path.join(__dirname, '../static/content/exercises');
  const exerciseFiles = fs.readdirSync(exercisesDir);

  for (const file of exerciseFiles) {
    if (file.endsWith('.json')) {
      const exercisePath = path.join(exercisesDir, file);
      const exerciseData = JSON.parse(fs.readFileSync(exercisePath, 'utf-8')) as Exercise;

      // Add metadata
      const exerciseWithMetadata = {
        ...exerciseData,
        metadata: {
          ...exerciseData.metadata,
          createdAt: new Date(),
          updatedAt: new Date(),
          isPublished: true
        }
      };

      // Store in Firestore
      await db.collection('exercises').doc(exerciseData.id).set(exerciseWithMetadata);
      console.log(`Migrated exercise: ${exerciseData.title}`);
    }
  }
}

async function main() {
  try {
    console.log('Starting content migration...');
    
    // Clear existing data
    console.log('Clearing existing data...');
    const coursesSnapshot = await db.collection('courses').get();
    const exercisesSnapshot = await db.collection('exercises').get();
    
    const batch = db.batch();
    coursesSnapshot.docs.forEach(doc => batch.delete(doc.ref));
    exercisesSnapshot.docs.forEach(doc => batch.delete(doc.ref));
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