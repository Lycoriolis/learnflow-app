import { getFirestore, query, collection, where, orderBy, limit, getDocs, addDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyBV3fl3Lhgm9EHdgsKK38PdA1vf3SZDVPg",
  authDomain: "learnflow-app-0.firebaseapp.com",
  projectId: "learnflow-app-0",
  storageBucket: "learnflow-app-0.firebasestorage.app",
  messagingSenderId: "1027565151934",
  appId: "1:1027565151934:web:0ecab7ec4b2394a5a6a0ef",
  measurementId: "G-LVTV18NEFP"
};
console.log("Firebase config:", {
  apiKey: firebaseConfig.apiKey ? firebaseConfig.apiKey.substring(0, 3) + "..." : "missing",
  authDomain: firebaseConfig.authDomain || "missing",
  projectId: firebaseConfig.projectId || "missing"
});
let app;
let auth;
let analytics = null;
let db;
try {
  console.log("Initializing Firebase app");
  app = initializeApp(firebaseConfig);
  console.log("Initializing Firebase auth");
  auth = getAuth(app);
  console.log("Initializing Firestore");
  db = getFirestore(app);
  if (false) ;
  if (typeof window !== "undefined") {
    try {
      console.log("Initializing Firebase analytics");
      analytics = getAnalytics(app);
    } catch (error) {
      console.warn("Failed to initialize Firebase Analytics:", error);
    }
  }
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase:", error);
  app = { name: "mock-app" };
  auth = {
    currentUser: null,
    onAuthStateChanged: (callback) => {
      if (typeof callback === "function") {
        callback(null);
      }
      return () => {
      };
    }
  };
  db = {
    collection: () => ({
      add: async () => ({ id: "mock-id" }),
      doc: () => ({
        get: async () => ({ exists: false, data: () => null }),
        update: async () => {
        }
      })
    })
  };
}
async function logEvent(eventType, referenceId, metadata) {
  const now = Date.now();
  await addDoc(collection(db, "activities"), {
    userId: globalThis?.localStorage?.getItem("userId"),
    eventType,
    referenceId,
    metadata,
    timestampStart: now,
    timestampEnd: now
  });
}
async function getRecentActivities(userId, limitCount = 10) {
  const q = query(
    collection(db, "activities"),
    where("userId", "==", userId),
    orderBy("timestampStart", "desc"),
    limit(limitCount)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc2) => ({
    id: doc2.id,
    ...doc2.data()
  }));
}
export {
  getRecentActivities as g,
  logEvent as l
};
