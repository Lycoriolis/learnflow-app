import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { v4 as uuidv4 } from 'uuid';
import type { Course, Module, Lesson, Exercise, Category } from '../src/lib/types/content';

// Initialize Firebase Admin SDK
admin.initializeApp();

const db = admin.firestore();

// Define content directories
const contentDir = path.resolve(process.cwd(), 'static/content');
const coursesDir = path.join(contentDir, 'courses');
const exercisesDir = path.join(contentDir, 'exercises');

// Define interfaces for content metadata
interface ContentMetadata {
  id: string;
  title: string;
  description: string;
  order: number;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    author: string;
  };
}

// Function to migrate content to Firestore
async function migrateContentToFirebase() {
  console.log('Starting migration...');
  const batch = db.batch();

  // Process courses, modules, and lessons
  const courseDirs = fs.readdirSync(coursesDir);
  for (const courseDir of courseDirs) {
    const coursePath = path.join(coursesDir, courseDir);
    if (!fs.statSync(coursePath).isDirectory()) continue;

    const courseIndexPath = path.join(coursePath, '_index.mdx');
    let courseId = uuidv4(); // Default courseId

    if (fs.existsSync(courseIndexPath)) {
      const courseContent = fs.readFileSync(courseIndexPath, 'utf8');
      const { data: courseMetadata } = matter(courseContent);
      courseId = courseMetadata.id || courseId; // Use ID from frontmatter if available
      const courseRef = db.collection('courses').doc(courseId);
      batch.set(courseRef, {
        ...courseMetadata,
        id: courseId,
        slug: courseDir, // Assuming directory name is the slug
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date(),
          author: 'Admin',
          ...(courseMetadata.metadata || {})
        }
      });
    } else {
      // Create a course entry even if _index.mdx is missing, using the folder name
      const courseRef = db.collection('courses').doc(courseId);
      batch.set(courseRef, {
        id: courseId,
        title: courseDir.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), // Convert slug to title
        slug: courseDir,
        description: `Course: ${courseDir}`,
        order: 0, // Default order
        category: '', // Default category
        tags: [], // Default tags
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date(),
          author: 'Admin'
        }
      });
    }

    const moduleDirs = fs.readdirSync(coursePath).filter(f => fs.statSync(path.join(coursePath, f)).isDirectory());
    for (const moduleDir of moduleDirs) {
      const modulePath = path.join(coursePath, moduleDir);
      const moduleIndexPath = path.join(modulePath, '_index.mdx');
      let moduleId = uuidv4(); // Default moduleId

      if (fs.existsSync(moduleIndexPath)) {
        const moduleContent = fs.readFileSync(moduleIndexPath, 'utf8');
        const { data: moduleMetadata } = matter(moduleContent);
        moduleId = moduleMetadata.id || moduleId; // Use ID from frontmatter if available
        const moduleRef = db.collection('modules').doc(moduleId);
        batch.set(moduleRef, {
          ...moduleMetadata,
          id: moduleId,
          courseId: courseId,
          slug: moduleDir, // Assuming directory name is the slug
          metadata: {
            createdAt: new Date(),
            updatedAt: new Date(),
            author: 'Admin',
            ...(moduleMetadata.metadata || {})
          }
        });
      } else {
        // Create a module entry even if _index.mdx is missing
        const moduleRef = db.collection('modules').doc(moduleId);
        batch.set(moduleRef, {
          id: moduleId,
          courseId: courseId,
          title: moduleDir.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          slug: moduleDir,
          description: `Module: ${moduleDir}`,
          order: 0, // Default order
          metadata: {
            createdAt: new Date(),
            updatedAt: new Date(),
            author: 'Admin'
          }
        });
      }

      const lessonFiles = fs.readdirSync(modulePath).filter(f => f.endsWith('.mdx') && f !== '_index.mdx');
      for (const lessonFile of lessonFiles) {
        const lessonFilePath = path.join(modulePath, lessonFile);
        const lessonContent = fs.readFileSync(lessonFilePath, 'utf8');
        const { data: lessonMetadata } = matter(lessonContent);
        const lessonId = lessonMetadata.id || uuidv4(); // Use ID from frontmatter or generate new
        const lessonRef = db.collection('lessons').doc(lessonId);
        batch.set(lessonRef, {
          ...lessonMetadata,
          id: lessonId,
          moduleId: moduleId,
          slug: lessonFile.replace('.mdx', ''), // Assuming filename (without .mdx) is the slug
          metadata: {
            createdAt: new Date(),
            updatedAt: new Date(),
            author: 'Admin',
            ...(lessonMetadata.metadata || {})
          }
        });
      }
    }
  }

  // Process exercises (assuming exercises are in top-level category folders under exercisesDir)
  const exerciseCategoryDirs = fs.readdirSync(exercisesDir).filter(f => fs.statSync(path.join(exercisesDir, f)).isDirectory());
  for (const categoryDir of exerciseCategoryDirs) {
    const categoryPath = path.join(exercisesDir, categoryDir);
    const exerciseFiles = fs.readdirSync(categoryPath).filter(f => f.endsWith('.mdx') && f !== '_index.mdx');

    for (const exerciseFile of exerciseFiles) {
      const exerciseFilePath = path.join(categoryPath, exerciseFile);
      const exerciseContent = fs.readFileSync(exerciseFilePath, 'utf8');
      const { data: exerciseMetadata } = matter(exerciseContent);
      const exerciseId = exerciseMetadata.id || uuidv4(); // Use ID from frontmatter or generate new
      const exerciseRef = db.collection('exercises').doc(exerciseId);
      batch.set(exerciseRef, {
        ...exerciseMetadata,
        id: exerciseId,
        slug: exerciseFile.replace('.mdx', ''), // Assuming filename (without .mdx) is the slug
        category: categoryDir, // Assuming parent folder is the category
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date(),
          author: 'Admin',
          ...(exerciseMetadata.metadata || {})
        }
      });
    }
  }

  // Commit the batch
  await batch.commit();
  console.log('Migration completed successfully.');
}

migrateContentToFirebase().catch(console.error);