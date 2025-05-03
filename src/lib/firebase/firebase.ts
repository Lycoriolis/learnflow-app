// Re-export Firebase instances from the main firebase.ts file
// This prevents duplicate initialization errors

import { app, auth, db, analytics } from '$lib/firebase';

export { app, auth, db, analytics };
