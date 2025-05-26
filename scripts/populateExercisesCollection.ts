import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { initializeApp, cert, getApps, type App as FirebaseAdminApp } from 'firebase-admin/app'; // Modular app functions
import { getFirestore } from 'firebase-admin/firestore'; // Modular firestore
import dotenv from 'dotenv';
import { getAllExercises, type Exercise } from '../src/lib/server/contentService.js';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

let db: admin.firestore.Firestore; // Use the fully qualified type for db

try {
  const firebaseAdminConfigEnv = process.env.FIREBASE_ADMIN_CONFIG;
  if (!firebaseAdminConfigEnv) {
    console.error(
      'Error: FIREBASE_ADMIN_CONFIG environment variable is not set. ' +
      'Ensure it is available in your .env file or environment.'
    );
    process.exit(1);
  }

  let serviceAccount;
  try {
    serviceAccount = JSON.parse(firebaseAdminConfigEnv);
  } catch (e) {
    console.error(
      'Error: Failed to parse FIREBASE_ADMIN_CONFIG. Make sure it is a valid JSON string.',
      e
    );
    process.exit(1);
  }

  let app: FirebaseAdminApp;
  if (getApps().length === 0) {
    app = initializeApp({
      credential: cert(serviceAccount),
    });
    console.log('Firebase Admin SDK initialized using modular pattern.');
  } else {
    app = getApps()[0]; // Get the default app if already initialized
    console.log('Firebase Admin SDK already initialized (modular pattern).');
  }
  db = getFirestore(app);

} catch (error) {
  console.error('Failed to initialize Firebase Admin SDK or Firestore:', error);
  process.exit(1);
}

async function populateExercises() {
  if (!db) {
    console.error("Firestore database instance (db) is not initialized. Exiting.");
    process.exit(1);
  }
  console.log('Fetching all exercises from MDX files...');
  const exercises: Exercise[] = await getAllExercises();
  console.log(`Found ${exercises.length} exercises to process.`);

  if (exercises.length === 0) {
    console.log('No exercises found to populate. Exiting.');
    return;
  }

  let batch = db.batch();
  let operationCounter = 0;
  let totalExercisesProcessed = 0;

  for (const exercise of exercises) {
    if (!exercise.id) {
      console.warn('Exercise missing id, skipping:', exercise.title);
      continue;
    }
    
    const categoryPath = exercise.categoryPath || 'uncategorized';
    let docId = `${categoryPath}_${exercise.id}`.replace(/\/\//g, '_').replace(/^_+|_+$/g, '');
    if (!docId) {
        console.warn('Generated empty docId for exercise, skipping:', exercise.title, exercise.id, categoryPath);
        continue;
    }

    const docRef = db.collection('exercises').doc(docId);

    const exerciseData: Partial<Exercise> & { lastUpdated: admin.firestore.FieldValue } = {
      id: exercise.id,
      title: exercise.title || 'Untitled Exercise',
      category: exercise.category || 'Uncategorized',
      categoryPath: categoryPath,
      difficulty: exercise.difficulty || 'medium',
      description: exercise.description || '',
      tags: Array.isArray(exercise.tags) ? exercise.tags : [],
      contentPath: exercise.contentPath || '',
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
    };

    batch.set(docRef, exerciseData);
    operationCounter++;
    totalExercisesProcessed++;

    if (operationCounter >= 490) {
      console.log(`Committing batch of ${operationCounter} operations...`);
      await batch.commit();
      console.log('Batch committed.');
      batch = db.batch(); 
      operationCounter = 0; 
    }
  }

  if (operationCounter > 0) {
    console.log(`Committing final batch of ${operationCounter} operations...`);
    await batch.commit();
    console.log('Final batch committed.');
  }

  console.log(`Successfully processed and attempted to populate ${totalExercisesProcessed} exercises.`);
  if (totalExercisesProcessed === exercises.length) {
    console.log('All exercises processed and populated in Firestore.');
  } else {
    console.warn('Some exercises may not have been processed. Check logs.');
  }
}

populateExercises()
  .then(() => {
    console.log('Script finished successfully.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });

// Need to import the admin namespace for FieldValue and Firestore type
import admin from 'firebase-admin';
