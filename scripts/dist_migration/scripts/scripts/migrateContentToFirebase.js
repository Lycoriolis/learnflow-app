"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const gray_matter_1 = __importDefault(require("gray-matter"));
const uuid_1 = require("uuid");
// Initialize Firebase Admin SDK
firebase_admin_1.default.initializeApp();
const db = firebase_admin_1.default.firestore();
// Define content directories
const contentDir = path_1.default.resolve(process.cwd(), 'static/content');
const coursesDir = path_1.default.join(contentDir, 'courses');
const exercisesDir = path_1.default.join(contentDir, 'exercises');
// Function to migrate content to Firestore
async function migrateContentToFirebase() {
    console.log('Starting migration...');
    const batch = db.batch();
    // Process courses, modules, and lessons
    const courseDirs = fs_1.default.readdirSync(coursesDir);
    for (const courseDir of courseDirs) {
        const coursePath = path_1.default.join(coursesDir, courseDir);
        if (!fs_1.default.statSync(coursePath).isDirectory())
            continue;
        const courseIndexPath = path_1.default.join(coursePath, '_index.mdx');
        let courseId = (0, uuid_1.v4)(); // Default courseId
        if (fs_1.default.existsSync(courseIndexPath)) {
            const courseContent = fs_1.default.readFileSync(courseIndexPath, 'utf8');
            const { data: courseMetadata } = (0, gray_matter_1.default)(courseContent);
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
        }
        else {
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
        const moduleDirs = fs_1.default.readdirSync(coursePath).filter(f => fs_1.default.statSync(path_1.default.join(coursePath, f)).isDirectory());
        for (const moduleDir of moduleDirs) {
            const modulePath = path_1.default.join(coursePath, moduleDir);
            const moduleIndexPath = path_1.default.join(modulePath, '_index.mdx');
            let moduleId = (0, uuid_1.v4)(); // Default moduleId
            if (fs_1.default.existsSync(moduleIndexPath)) {
                const moduleContent = fs_1.default.readFileSync(moduleIndexPath, 'utf8');
                const { data: moduleMetadata } = (0, gray_matter_1.default)(moduleContent);
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
            }
            else {
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
            const lessonFiles = fs_1.default.readdirSync(modulePath).filter(f => f.endsWith('.mdx') && f !== '_index.mdx');
            for (const lessonFile of lessonFiles) {
                const lessonFilePath = path_1.default.join(modulePath, lessonFile);
                const lessonContent = fs_1.default.readFileSync(lessonFilePath, 'utf8');
                const { data: lessonMetadata } = (0, gray_matter_1.default)(lessonContent);
                const lessonId = lessonMetadata.id || (0, uuid_1.v4)(); // Use ID from frontmatter or generate new
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
    const exerciseCategoryDirs = fs_1.default.readdirSync(exercisesDir).filter(f => fs_1.default.statSync(path_1.default.join(exercisesDir, f)).isDirectory());
    for (const categoryDir of exerciseCategoryDirs) {
        const categoryPath = path_1.default.join(exercisesDir, categoryDir);
        const exerciseFiles = fs_1.default.readdirSync(categoryPath).filter(f => f.endsWith('.mdx') && f !== '_index.mdx');
        for (const exerciseFile of exerciseFiles) {
            const exerciseFilePath = path_1.default.join(categoryPath, exerciseFile);
            const exerciseContent = fs_1.default.readFileSync(exerciseFilePath, 'utf8');
            const { data: exerciseMetadata } = (0, gray_matter_1.default)(exerciseContent);
            const exerciseId = exerciseMetadata.id || (0, uuid_1.v4)(); // Use ID from frontmatter or generate new
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
