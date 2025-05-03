const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
const app = initializeApp({
  credential: cert(serviceAccount)
});
const db = getFirestore(app);
const auth = getAuth(app);

async function initializeUserProgress(userId) {
  const userProgress = {
    userId,
    courses: {},
    exercises: {},
    metrics: {
      totalCoursesStarted: 0,
      totalCoursesCompleted: 0,
      totalExercisesAttempted: 0,
      totalExercisesCompleted: 0,
      averageExerciseScore: 0,
      totalLearningTime: 0
    }
  };

  await db.collection('userProgress').doc(userId).set(userProgress);
  console.log(`Initialized progress tracking for user: ${userId}`);
}

async function main() {
  try {
    console.log('Initializing user progress tracking...');
    
    // Get all users
    const users = await auth.listUsers();
    
    // Initialize progress for each user
    for (const user of users.users) {
      await initializeUserProgress(user.uid);
    }
    
    console.log('User progress initialization completed successfully!');
  } catch (error) {
    console.error('Error during initialization:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

main(); 