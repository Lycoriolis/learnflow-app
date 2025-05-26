<script lang="ts">
  import { onMount } from 'svelte';
  import type { UserProfile } from '$lib/types/shared';
  import { updateUserProfile } from '$lib/stores/userProfileStore';
  
  export let profile: UserProfile;
  
  // Form state
  let displayName = profile.displayName || '';
  let photoURL = profile.photoURL || '';
  let isUpdating = false;
  let updateError: string | null = null;
  let updateSuccess = false;
  
  // Settings state
  let settings = {
    theme: 'dark',
    language: 'en',
    notifications: {
      email: true,
      push: true,
      dailyDigest: false
    },
    accessibility: {
      fontSize: 1, // 1 = normal, 0.9 = small, 1.1 = large
      highContrast: false,
      reducedMotion: false
    },
    privacySettings: {
      showProfile: true,
      showActivity: true,
      showCourses: true
    }
  };
  
  async function handleProfileUpdate() {
    try {
      isUpdating = true;
      updateError = null;
      updateSuccess = false;
      
      // Simple validation
      if (!displayName.trim()) {
        updateError = 'Display name cannot be empty';
        return;
      }
      
      // Update profile in Firestore
      await updateUserProfile(profile.uid, {
        displayName,
        photoURL
      });
      
      updateSuccess = true;
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        updateSuccess = false;
      }, 3000);
      
    } catch (err: any) {
      console.error('Error updating profile:', err);
      updateError = err.message || 'Failed to update profile';
    } finally {
      isUpdating = false;
    }
  }
  
  async function handleSettingsUpdate() {
    try {
      isUpdating = true;
      updateError = null;
      updateSuccess = false;
      
      // In a real app, this would save the settings to a database or localStorage
      console.log('Saving settings:', settings);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      updateSuccess = true;
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        updateSuccess = false;
      }, 3000);
      
    } catch (err: any) {
      console.error('Error updating settings:', err);
      updateError = err.message || 'Failed to update settings';
    } finally {
      isUpdating = false;
    }
  }
</script>

<div>
  <h2 class="text-xl font-semibold text-white mb-6">Settings</h2>
  
  <!-- Feedback messages -->
  {#if updateError}
    <div class="bg-red-500 bg-opacity-20 border border-red-500 text-red-100 p-4 rounded-lg mb-6">
      <p>{updateError}</p>
    </div>
  {/if}
  
  {#if updateSuccess}
    <div class="bg-green-500 bg-opacity-20 border border-green-500 text-green-100 p-4 rounded-lg mb-6">
      <p>Settings updated successfully!</p>
    </div>
  {/if}
  
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <!-- Profile Information -->
    <div class="bg-gray-700 rounded-lg p-6">
      <h3 class="text-lg font-medium text-white mb-4">Profile Information</h3>
      
      <div class="space-y-4">
        <div>
          <label for="displayName" class="block text-gray-400 text-sm mb-1">Display Name</label>
          <input
            type="text"
            id="displayName"
            bind:value={displayName}
            class="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label for="photoURL" class="block text-gray-400 text-sm mb-1">Profile Picture URL</label>
          <input
            type="text"
            id="photoURL"
            bind:value={photoURL}
            placeholder="https://example.com/your-photo.jpg"
            class="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p class="text-xs text-gray-500 mt-1">Enter a URL to your profile picture</p>
        </div>
        
        <div>
          <label for="email" class="block text-gray-400 text-sm mb-1">Email</label>
          <input
            type="email"
            id="email"
            value={profile.email || ''}
            disabled
            class="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-gray-400 cursor-not-allowed"
          />
          <p class="text-xs text-gray-500 mt-1">Email cannot be changed</p>
        </div>
        
        <button
          on:click={handleProfileUpdate}
          disabled={isUpdating}
          class="mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUpdating ? 'Updating...' : 'Update Profile'}
        </button>
      </div>
    </div>
    
    <!-- App Settings -->
    <div class="bg-gray-700 rounded-lg p-6">
      <h3 class="text-lg font-medium text-white mb-4">App Settings</h3>
      
      <div class="space-y-6">
        <!-- Theme -->
        <div>
          <span id="theme-label" class="block text-gray-400 text-sm mb-2">Theme</span>
          <div class="flex space-x-4" aria-labelledby="theme-label">
            <label class="inline-flex items-center">
              <input
                type="radio"
                bind:group={settings.theme}
                value="light"
                class="form-radio text-blue-600"
              />
              <span class="ml-2 text-gray-300">Light</span>
            </label>
            <label class="inline-flex items-center">
              <input
                type="radio"
                bind:group={settings.theme}
                value="dark"
                class="form-radio text-blue-600"
              />
              <span class="ml-2 text-gray-300">Dark</span>
            </label>
            <label class="inline-flex items-center">
              <input
                type="radio"
                bind:group={settings.theme}
                value="system"
                class="form-radio text-blue-600"
              />
              <span class="ml-2 text-gray-300">System</span>
            </label>
          </div>
        </div>
        
        <!-- Language -->
        <div>
          <label for="language" class="block text-gray-400 text-sm mb-2">Language</label>
          <select
            id="language"
            bind:value={settings.language}
            class="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
            <option value="de">German</option>
            <option value="zh">Chinese</option>
          </select>
        </div>
        
        <!-- Notifications -->
        <div>
          <span id="notifications-label" class="block text-gray-400 text-sm mb-2">Notifications</span>
          <div class="space-y-2" aria-labelledby="notifications-label">
            <label class="inline-flex items-center">
              <input
                type="checkbox"
                bind:checked={settings.notifications.email}
                class="form-checkbox text-blue-600"
              />
              <span class="ml-2 text-gray-300">Email Notifications</span>
            </label>
            <label class="inline-flex items-center">
              <input
                type="checkbox"
                bind:checked={settings.notifications.push}
                class="form-checkbox text-blue-600"
              />
              <span class="ml-2 text-gray-300">Push Notifications</span>
            </label>
            <label class="inline-flex items-center">
              <input
                type="checkbox"
                bind:checked={settings.notifications.dailyDigest}
                class="form-checkbox text-blue-600"
              />
              <span class="ml-2 text-gray-300">Daily Digest</span>
            </label>
          </div>
        </div>
        
        <!-- Accessibility -->
        <div>
          <span id="accessibility-label" class="block text-gray-400 text-sm mb-2">Accessibility</span>
          <div class="space-y-3" aria-labelledby="accessibility-label">
            <div>
              <label for="fontSize" class="block text-gray-300 text-sm mb-1">Font Size</label>
              <input
                type="range"
                id="fontSize"
                bind:value={settings.accessibility.fontSize}
                min="0.9"
                max="1.2"
                step="0.1"
                class="w-full"
              />
              <div class="flex justify-between text-xs text-gray-400">
                <span>Small</span>
                <span>Normal</span>
                <span>Large</span>
              </div>
            </div>
            
            <label class="inline-flex items-center">
              <input
                type="checkbox"
                bind:checked={settings.accessibility.highContrast}
                class="form-checkbox text-blue-600"
              />
              <span class="ml-2 text-gray-300">High Contrast</span>
            </label>
            
            <label class="inline-flex items-center">
              <input
                type="checkbox"
                bind:checked={settings.accessibility.reducedMotion}
                class="form-checkbox text-blue-600"
              />
              <span class="ml-2 text-gray-300">Reduced Motion</span>
            </label>
          </div>
        </div>
        
        <button
          on:click={handleSettingsUpdate}
          disabled={isUpdating}
          class="mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUpdating ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  </div>
  
  <!-- Privacy Settings -->
  <div class="mt-8 bg-gray-700 rounded-lg p-6">
    <h3 class="text-lg font-medium text-white mb-4">Privacy Settings</h3>
    
    <div class="space-y-4">
      <div class="flex items-center justify-between py-2 border-b border-gray-600">
        <div>
          <h4 class="text-white font-medium">Profile Visibility</h4>
          <p class="text-gray-400 text-sm">Allow other users to see your profile information</p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" bind:checked={settings.privacySettings.showProfile} class="sr-only peer">
          <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
      
      <div class="flex items-center justify-between py-2 border-b border-gray-600">
        <div>
          <h4 class="text-white font-medium">Activity Visibility</h4>
          <p class="text-gray-400 text-sm">Allow other users to see your learning activity</p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" bind:checked={settings.privacySettings.showActivity} class="sr-only peer">
          <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
      
      <div class="flex items-center justify-between py-2 border-b border-gray-600">
        <div>
          <h4 class="text-white font-medium">Course Enrollment Visibility</h4>
          <p class="text-gray-400 text-sm">Allow other users to see courses you're enrolled in</p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" bind:checked={settings.privacySettings.showCourses} class="sr-only peer">
          <div class="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
      
      <button
        on:click={handleSettingsUpdate}
        disabled={isUpdating}
        class="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isUpdating ? 'Saving...' : 'Save Privacy Settings'}
      </button>
    </div>
  </div>
  
  <!-- Account Management -->
  <div class="mt-8 bg-gray-700 rounded-lg p-6">
    <h3 class="text-lg font-medium text-white mb-4">Account Management</h3>
    
    <div class="space-y-4">
      <div class="p-4 bg-yellow-500 bg-opacity-20 border border-yellow-500 text-yellow-100 rounded-lg">
        <h4 class="font-medium mb-1">Premium Membership</h4>
        <p class="text-sm mb-2">
          {profile.isPremium 
            ? 'You currently have a Premium membership. Enjoy all premium features!' 
            : 'Upgrade to Premium for unlimited access to all courses and features.'}
        </p>
        {#if !profile.isPremium}
          <button class="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded-lg text-sm transition-colors">
            Upgrade Now
          </button>
        {/if}
      </div>
      
      <div class="p-4 bg-red-500 bg-opacity-10 border border-red-500 text-red-100 rounded-lg">
        <h4 class="font-medium mb-1">Delete Account</h4>
        <p class="text-sm mb-2">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <button class="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-lg text-sm transition-colors">
          Delete Account
        </button>
      </div>
    </div>
  </div>
</div>
