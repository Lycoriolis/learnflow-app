/**
 * Load the user profile from Firestore. Returns null if not found.
 */
export async function getUserProfile(uid) {
    if (typeof window === 'undefined')
        return null;
    const { getFirestore, doc, getDoc } = await import('firebase/firestore');
    const { app } = await import('../firebase.js');
    const db = getFirestore(app);
    const ref = doc(db, 'users', uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
        return snap.data();
    }
    return null;
}
/**
 * Create a new user profile document in Firestore.
 */
export async function createUserProfile(profile) {
    if (typeof window === 'undefined')
        return;
    const { getFirestore, doc, setDoc } = await import('firebase/firestore');
    const { app } = await import('../firebase.js');
    const db = getFirestore(app);
    const ref = doc(db, 'users', profile.uid);
    await setDoc(ref, profile);
}
/**
 * Update existing user profile fields.
 */
export async function updateUserProfile(uid, data) {
    if (typeof window === 'undefined')
        return;
    const { getFirestore, doc, updateDoc } = await import('firebase/firestore');
    const { app } = await import('../firebase.js');
    const db = getFirestore(app);
    const ref = doc(db, 'users', uid);
    await updateDoc(ref, data);
}
