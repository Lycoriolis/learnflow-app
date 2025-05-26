import { writable } from 'svelte/store';
import { isUserAdmin } from '$lib/services/adminService';
import { browser } from '$app/environment';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth'; // Added User type import

// Create admin store
function createAdminStore() {
  const { subscribe, set, update } = writable<{
    isAdmin: boolean;
    checkingStatus: boolean;
    user: User | null; // Added User type
  }>({
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
            user: adminStatus && user ? user : null // Ensure user is not null before assigning
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