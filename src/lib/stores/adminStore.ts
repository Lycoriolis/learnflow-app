import { writable } from 'svelte/store';
import { isUserAdmin } from '$lib/services/adminService';
import { browser } from '$app/environment';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Create admin store
function createAdminStore() {
  const { subscribe, set, update } = writable({
    isAdmin: false,
    checkingStatus: true,
    user: null
  });

  return {
    subscribe,
    
    // Initialize admin status based on current auth state
    init: () => {
      if (!browser) return;
      
      const auth = getAuth();
      
      // Listen for auth state changes
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          // Check if the user is an admin
          const adminStatus = await isUserAdmin(user.uid);
          
          update(state => ({
            ...state,
            isAdmin: adminStatus,
            checkingStatus: false,
            user: adminStatus ? user : null
          }));
        } else {
          // No user is signed in
          set({
            isAdmin: false,
            checkingStatus: false,
            user: null
          });
        }
      });
    },
    
    // Reset the admin store
    reset: () => {
      set({
        isAdmin: false,
        checkingStatus: false,
        user: null
      });
    }
  };
}

// Export the admin store
export const adminStore = createAdminStore();