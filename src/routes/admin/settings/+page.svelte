<script lang="ts">
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import { getFirestore, doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
  import { app as firebaseApp } from '$lib/firebase.js';
  import type { FirebaseApp } from 'firebase/app';

  // Define interfaces for settings
  interface SiteSettings {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    allowRegistration: boolean;
    maintenanceMode: boolean;
    updatedAt?: Timestamp;
  }

  interface ThemeSettings {
    primaryColor: string;
    darkMode: 'auto' | 'light' | 'dark';
    font: string;
    updatedAt?: Timestamp;
  }

  let isLoading = true;
  let isSaving = false;
  let successMessage = '';
  let errorMessage = '';
  
  let siteSettings: SiteSettings = { 
    siteName: '', siteDescription: '', contactEmail: '', 
    allowRegistration: true, maintenanceMode: false 
  };
  
  let themeSettings: ThemeSettings = { 
    primaryColor: '#4F46E5', darkMode: 'auto', font: 'Inter' 
  };

  // Explicitly type the app and get Firestore instance
  const app: FirebaseApp = firebaseApp as FirebaseApp;
  let db: any; // Use any temporarily to bypass linter issue with mock object
  try {
    db = getFirestore(app);
  } catch(e) {
     console.error("Firestore initialization failed:", e);
     errorMessage = "Database connection failed. Settings cannot be loaded or saved.";
     // Assign a mock db or handle error appropriately
     db = null; 
  }
  
  const siteSettingsRef = db ? doc(db, 'settings', 'site') : null;
  const themeSettingsRef = db ? doc(db, 'settings', 'theme') : null;

  onMount(async () => {
    if (db) {
        await loadSettings();
    } else {
        isLoading = false; // If db failed, stop loading
    }
  });

  async function loadSettings() {
    if (!siteSettingsRef || !themeSettingsRef) return;
    isLoading = true;
    try {
      const [siteSnap, themeSnap] = await Promise.all([
        getDoc(siteSettingsRef),
        getDoc(themeSettingsRef)
      ]);

      if (siteSnap.exists()) {
        siteSettings = siteSnap.data() as SiteSettings;
        console.log('Site settings loaded:', siteSettings);
      } else {
        console.warn('Site settings document does not exist. Using defaults.');
      }

      if (themeSnap.exists()) {
        themeSettings = themeSnap.data() as ThemeSettings;
        console.log('Theme settings loaded:', themeSettings);
      } else {
        console.warn('Theme settings document does not exist. Using defaults.');
      }

    } catch (error) {
      console.error('Error loading settings:', error);
      errorMessage = 'Failed to load settings.';
    } finally {
      isLoading = false;
    }
  }

  async function saveAllSettings() {
    if (!siteSettingsRef || !themeSettingsRef) {
        errorMessage = "Database connection failed. Cannot save settings.";
        return;
    }
    isSaving = true;
    errorMessage = '';
    successMessage = '';
    
    try {
      console.log('Saving site settings:', siteSettings);
      console.log('Saving theme settings:', themeSettings);

      await Promise.all([
        setDoc(siteSettingsRef, { ...siteSettings, updatedAt: Timestamp.now() }, { merge: true }),
        setDoc(themeSettingsRef, { ...themeSettings, updatedAt: Timestamp.now() }, { merge: true })
      ]);
      
      successMessage = 'Settings saved successfully!';
      console.log('Settings saved successfully.');
      
      setTimeout(() => { successMessage = ''; }, 3000);
    } catch (error: any) {
      console.error('Error saving settings:', error);
      errorMessage = error.message || 'Failed to save settings. Please try again.';
    } finally {
      isSaving = false;
    }
  }

  function resetTheme() {
    themeSettings = {
      primaryColor: '#4F46E5', 
      darkMode: 'auto', 
      font: 'Inter'
    };
    console.log('Theme reset to defaults (client-side)');
  }
</script>

<svelte:head>
  <title>Admin | Settings | LearnFlow</title>
</svelte:head>

<div in:fly={{ y: 20, duration: 300 }}>
  <div class="mb-6">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Platform Settings</h1>
    <p class="text-gray-600 dark:text-gray-400 mt-1">Configure global settings for LearnFlow.</p>
  </div>

  {#if isLoading}
    <div class="flex justify-center items-center h-64">
      <div class="w-12 h-12 border-4 border-t-indigo-500 border-indigo-200 rounded-full animate-spin"></div>
    </div>
  {:else}
    {#if successMessage}
      <div class="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
        <span class="block sm:inline">{successMessage}</span>
      </div>
    {/if}
    {#if errorMessage && !successMessage} <!-- Show error only if no success message -->
      <div class="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span class="block sm:inline">Error: {errorMessage}</span>
      </div>
    {/if}
  
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <form on:submit|preventDefault={saveAllSettings}>
        <!-- Site Settings Section -->
        <div class="p-6 border-b dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Site Configuration</h3>
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div class="col-span-1 sm:col-span-2">
              <label for="siteName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Site Name</label>
              <input type="text" id="siteName" bind:value={siteSettings.siteName} required class="input-field" disabled={!db}>
            </div>
            <div class="col-span-1 sm:col-span-2">
              <label for="siteDescription" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Site Description</label>
              <textarea id="siteDescription" rows="3" bind:value={siteSettings.siteDescription} class="input-field" disabled={!db}></textarea>
            </div>
            <div>
              <label for="contactEmail" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Email</label>
              <input type="email" id="contactEmail" bind:value={siteSettings.contactEmail} required class="input-field" disabled={!db}>
            </div>
            <div class="col-span-1 sm:col-span-2 grid grid-cols-2 gap-4 items-center pt-2">
                <div class="flex items-center">
                    <input id="allowRegistration" type="checkbox" bind:checked={siteSettings.allowRegistration} class="checkbox-field" disabled={!db}>
                    <label for="allowRegistration" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">Allow User Registration</label>
                </div>
                 <div class="flex items-center">
                    <input id="maintenanceMode" type="checkbox" bind:checked={siteSettings.maintenanceMode} class="checkbox-field" disabled={!db}>
                    <label for="maintenanceMode" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">Enable Maintenance Mode</label>
                </div>
            </div>
          </div>
        </div>

        <!-- Theme Settings Section -->
        <div class="p-6">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">Appearance</h3>
                 <button type="button" on:click={resetTheme} class="secondary-button text-sm" disabled={!db}>Reset Theme Defaults</button>
            </div>
          
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label for="primaryColor" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Primary Color</label>
               <div class="mt-1 flex rounded-md shadow-sm">
                 <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-sm">
                    <div class="w-4 h-4 rounded-full border dark:border-gray-500" style="background-color: {themeSettings.primaryColor}"></div>
                  </span>
                  <input type="text" id="primaryColor" bind:value={themeSettings.primaryColor} placeholder="#rrggbb" class="input-field rounded-l-none" disabled={!db}>
               </div>
            </div>
            <div>
              <label for="font" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Font Family</label>
              <select id="font" bind:value={themeSettings.font} class="select-field" disabled={!db}>
                <option>Inter</option>
                <option>Roboto</option>
                <option>Poppins</option>
                <option>Open Sans</option>
              </select>
            </div>
            <div>
              <label for="darkMode" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Dark Mode</label>
              <select id="darkMode" bind:value={themeSettings.darkMode} class="select-field" disabled={!db}>
                <option value="auto">Auto (System Preference)</option>
                <option value="light">Light Mode Only</option>
                <option value="dark">Dark Mode Only</option>
              </select>
            </div>
          </div>
        </div>
        
        <!-- Save Button Footer -->
        <div class="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-end border-t dark:border-gray-600">
          <button 
            type="submit" 
            disabled={isSaving || !db} 
            class="primary-button"
          >
            {#if isSaving}
              <span class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              Saving...
            {:else}
              Save All Settings
            {/if}
          </button>
        </div>
      </form>
    </div>
  {/if}
</div>

<style>
  .input-field {
    @apply mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-gray-600;
  }
  .select-field {
      @apply mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-gray-600;
  }
  .checkbox-field {
      @apply h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:checked:bg-indigo-500 disabled:opacity-50;
  }
  .primary-button {
      @apply inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 disabled:opacity-50;
  }
   .secondary-button {
      @apply inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 text-sm leading-5 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50;
  }
</style> 