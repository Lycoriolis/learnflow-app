const { initializeApp } = require('firebase-admin/app');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');
const { v4: uuidv4 } = require('uuid');

// Initialize Firebase Admin SDK (relies on GOOGLE_APPLICATION_CREDENTIALS)
initializeApp();

const db = getFirestore();
const auth = getAuth();

async function initializeUserActivity(userId, batch) {
  const now = Timestamp.now();

  // Example 1: User Registered Event
  const registrationActivityId = uuidv4();
  const registrationActivityRef = db.collection('userActivity').doc(registrationActivityId);
  batch.set(registrationActivityRef, {
    id: registrationActivityId,
    userId: userId,
    eventType: 'USER_REGISTERED',
    referenceId: userId, // Reference to the user themselves
    metadata: {
      registrationDate: now,
      source: 'system_init'
    },
    timestampStart: now,
    timestampEnd: now
  });

  // Example 2: Initial Login Event (simulated)
  const loginActivityId = uuidv4();
  const loginActivityRef = db.collection('userActivity').doc(loginActivityId);
  batch.set(loginActivityRef, {
    id: loginActivityId,
    userId: userId,
    eventType: 'USER_LOGIN',
    referenceId: null,
    metadata: {
      loginDate: now,
      ipAddress: '127.0.0.1' // Example IP
    },
    timestampStart: now,
    timestampEnd: now
  });

  console.log(`Prepared sample activities for user: ${userId}`);
}

async function main() {
  try {
    console.log('Initializing user activity tracking with sample data...');
    
    const usersResponse = await auth.listUsers();
    if (!usersResponse || !usersResponse.users || usersResponse.users.length === 0) {
      console.log('No users found. Skipping activity initialization.');
      return;
    }
    
    const batch = db.batch();
    let operationCount = 0;

    for (const user of usersResponse.users) {
      await initializeUserActivity(user.uid, batch);
      operationCount += 2; // Two activities per user

      // Firestore batch limit is 500 operations. Commit if near limit.
      if (operationCount >= 490) { // A bit of buffer
        await batch.commit();
        console.log('Committed a batch of user activities.');
        batch = db.batch(); // Start a new batch
        operationCount = 0;
      }
    }
    
    if (operationCount > 0) {
      await batch.commit(); // Commit any remaining operations
      console.log('Committed the final batch of user activities.');
    }
    
    console.log('User activity initialization completed successfully!');
  } catch (error) {
    console.error('Error during user activity initialization:', error);
    process.exit(1);
  } finally {
    // process.exit(0); // Let the script exit naturally
  }
}

main();
