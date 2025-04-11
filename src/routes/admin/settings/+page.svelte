<!-- src/routes/admin/settings/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
  import { app } from '$lib/firebase.js';
  
  let isLoading = true;
  let isSaving = false;
  let successMessage = '';
  let errorMessage = '';
  
  // Site settings
  let settings = {
    siteName: '',
    siteDescription: '',
    contactEmail: '',
    supportEmail: '',
    enableRegistration: true,
    enablePublicCourses: true,
    maintenanceMode: false,
    analyticsEnabled: true,
    defaultUserRole: 'student',
    courseApprovalRequired: false,
    maxUploadSize: 5,
    allowedFileTypes: '',
    termsLastUpdated: '',
    privacyLastUpdated: ''
  };
  
  // Theme settings
  let theme = {
    primaryColor: '#4F46E5',
    secondaryColor: '#10B981',
    accentColor: '#F59E0B',
    darkMode: 'auto',
    font: 'Inter',
    borderRadius: 'medium',
    logo: 'default'
  };
  
  onMount(async () => {
    // Simulate loading site settings from Firestore
    setTimeout(() => {
      // This would actually fetch from Firestore in production
      settings = {
        siteName: 'LearnFlow',
        siteDescription: 'Modern learning platform for everyone',
        contactEmail: 'contact@learnflow.edu',
        supportEmail: 'support@learnflow.edu',
        enableRegistration: true,
        enablePublicCourses: true,
        maintenanceMode: false,
        analyticsEnabled: true,
        defaultUserRole: 'student',
        courseApprovalRequired: true,
        maxUploadSize: 10,
        allowedFileTypes: '.pdf,.doc,.docx,.jpg,.png,.mp4',
        termsLastUpdated: '2023-08-15',
        privacyLastUpdated: '2023-08-15'
      };
      
      theme = {
        primaryColor: '#4F46E5',
        secondaryColor: '#10B981',
        accentColor: '#F59E0B',
        darkMode: 'auto',
        font: 'Inter',
        borderRadius: 'medium',
        logo: 'default'
      };
      
      isLoading = false;
    }, 1000);
  });
  
  async function saveSettings() {
    isSaving = true;
    errorMessage = '';
    successMessage = '';
    
    try {
      // Simulated API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In production this would save to Firestore
      // const db = getFirestore(app);
      // await setDoc(doc(db, "settings", "site"), settings);
      // await setDoc(doc(db, "settings", "theme"), theme);
      
      successMessage = 'Settings saved successfully!';
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        successMessage = '';
      }, 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      errorMessage = 'Failed to save settings. Please try again.';
    } finally {
      isSaving = false;
    }
  }
  
  function resetTheme() {
    theme = {
      primaryColor: '#4F46E5',
      secondaryColor: '#10B981',
      accentColor: '#F59E0B',
      darkMode: 'auto',
      font: 'Inter',
      borderRadius: 'medium',
      logo: 'default'
    };
  }
</script>

<svelte:head>
  <title>Admin | Site Settings | LearnFlow</title>
</svelte:head>

<div in:fly={{ y: 20, duration: 300 }}>
  <div class="mb-6">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Site Settings</h1>
    <p class="text-gray-600 dark:text-gray-400 mt-1">Configure your LearnFlow platform settings</p>
  </div>
  
  {#if isLoading}
    <div class="flex justify-center items-center h-64">
      <div class="w-12 h-12 border-4 border-t-indigo-500 border-indigo-200 rounded-full animate-spin"></div>
    </div>
  {:else}
    {#if successMessage}
      <div class="mb-6 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800 p-4 rounded-md">
        <div class="flex">
          <div class="flex-shrink-0">
            <i class="fas fa-check-circle text-green-500 dark:text-green-400 text-lg"></i>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-green-800 dark:text-green-300">{successMessage}</p>
          </div>
        </div>
      </div>
    {/if}
    
    {#if errorMessage}
      <div class="mb-6 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 p-4 rounded-md">
        <div class="flex">
          <div class="flex-shrink-0">
            <i class="fas fa-exclamation-circle text-red-500 dark:text-red-400 text-lg"></i>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-red-800 dark:text-red-300">{errorMessage}</p>
          </div>
        </div>
      </div>
    {/if}
  
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <div class="p-6">
        <div class="flex flex-col space-y-6 md:flex-row md:space-y-0 md:space-x-6">
          <!-- Left column for tabs -->
          <div class="w-full md:w-1/4">
            <nav class="space-y-1">
              <a href="#general" class="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200">
                <i class="fas fa-cog mr-3 h-4 w-4"></i>
                General
              </a>
              <a href="#appearance" class="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white">
                <i class="fas fa-palette mr-3 h-4 w-4"></i>
                Appearance
              </a>
              <a href="#email" class="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white">
                <i class="fas fa-envelope mr-3 h-4 w-4"></i>
                Email
              </a>
              <a href="#privacy" class="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white">
                <i class="fas fa-shield-alt mr-3 h-4 w-4"></i>
                Privacy
              </a>
              <a href="#advanced" class="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white">
                <i class="fas fa-sliders-h mr-3 h-4 w-4"></i>
                Advanced
              </a>
            </nav>
          </div>
          
          <!-- Right column for settings -->
          <div class="w-full md:w-3/4">
            <div class="space-y-8">
              <!-- General Settings -->
              <div id="general">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">General Settings</h3>
                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div class="col-span-1 sm:col-span-2">
                    <label for="siteName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Site Name</label>
                    <input 
                      type="text" 
                      id="siteName" 
                      bind:value={settings.siteName} 
                      class="mt-1 block w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div class="col-span-1 sm:col-span-2">
                    <label for="siteDescription" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Site Description</label>
                    <textarea 
                      id="siteDescription" 
                      rows="3" 
                      bind:value={settings.siteDescription}
                      class="mt-1 block w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    ></textarea>
                  </div>
                  
                  <div class="col-span-1">
                    <label for="contactEmail" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Email</label>
                    <input 
                      type="email" 
                      id="contactEmail" 
                      bind:value={settings.contactEmail}
                      class="mt-1 block w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div class="col-span-1">
                    <label for="supportEmail" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Support Email</label>
                    <input 
                      type="email" 
                      id="supportEmail" 
                      bind:value={settings.supportEmail}
                      class="mt-1 block w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div class="col-span-1">
                    <div class="flex items-center">
                      <input 
                        id="enableRegistration" 
                        type="checkbox" 
                        bind:checked={settings.enableRegistration}
                        class="h-4 w-4 text-indigo-600 dark:text-indigo-500 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded"
                      />
                      <label for="enableRegistration" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Enable User Registration
                      </label>
                    </div>
                  </div>
                  
                  <div class="col-span-1">
                    <div class="flex items-center">
                      <input 
                        id="enablePublicCourses" 
                        type="checkbox" 
                        bind:checked={settings.enablePublicCourses}
                        class="h-4 w-4 text-indigo-600 dark:text-indigo-500 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded"
                      />
                      <label for="enablePublicCourses" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Enable Public Courses
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Appearance -->
              <div id="appearance">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white">Appearance</h3>
                  <button 
                    type="button" 
                    on:click={resetTheme}
                    class="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 dark:text-indigo-200 dark:bg-indigo-900 dark:hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Reset to Default
                  </button>
                </div>
                
                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div class="col-span-1">
                    <label for="primaryColor" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Primary Color</label>
                    <div class="mt-1 flex rounded-md shadow-sm">
                      <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-sm">
                        <div class="w-4 h-4 rounded-full" style="background-color: {theme.primaryColor}"></div>
                      </span>
                      <input 
                        type="text" 
                        id="primaryColor" 
                        bind:value={theme.primaryColor}
                        class="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                  
                  <div class="col-span-1">
                    <label for="secondaryColor" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Secondary Color</label>
                    <div class="mt-1 flex rounded-md shadow-sm">
                      <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-sm">
                        <div class="w-4 h-4 rounded-full" style="background-color: {theme.secondaryColor}"></div>
                      </span>
                      <input 
                        type="text" 
                        id="secondaryColor" 
                        bind:value={theme.secondaryColor}
                        class="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                  
                  <div class="col-span-1">
                    <label for="darkMode" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Dark Mode</label>
                    <select 
                      id="darkMode" 
                      bind:value={theme.darkMode}
                      class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                    >
                      <option value="auto">Auto (System Preference)</option>
                      <option value="light">Light Mode Only</option>
                      <option value="dark">Dark Mode Only</option>
                    </select>
                  </div>
                  
                  <div class="col-span-1">
                    <label for="font" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Font</label>
                    <select 
                      id="font" 
                      bind:value={theme.font}
                      class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                    >
                      <option value="Inter">Inter</option>
                      <option value="Roboto">Roboto</option>
                      <option value="Poppins">Poppins</option>
                      <option value="Open Sans">Open Sans</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <!-- Advanced Settings -->
              <div id="advanced">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Advanced Settings</h3>
                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div class="col-span-1">
                    <div class="flex items-center">
                      <input 
                        id="maintenanceMode" 
                        type="checkbox" 
                        bind:checked={settings.maintenanceMode}
                        class="h-4 w-4 text-indigo-600 dark:text-indigo-500 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded"
                      />
                      <label for="maintenanceMode" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Maintenance Mode
                      </label>
                    </div>
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Only admins can access the site when enabled</p>
                  </div>
                  
                  <div class="col-span-1">
                    <div class="flex items-center">
                      <input 
                        id="analyticsEnabled" 
                        type="checkbox" 
                        bind:checked={settings.analyticsEnabled}
                        class="h-4 w-4 text-indigo-600 dark:text-indigo-500 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded"
                      />
                      <label for="analyticsEnabled" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Enable Firebase Analytics
                      </label>
                    </div>
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Collect anonymous usage data</p>
                  </div>
                  
                  <div class="col-span-1">
                    <label for="defaultUserRole" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Default User Role</label>
                    <select 
                      id="defaultUserRole" 
                      bind:value={settings.defaultUserRole}
                      class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                    >
                      <option value="student">Student</option>
                      <option value="instructor">Instructor</option>
                    </select>
                  </div>
                  
                  <div class="col-span-1">
                    <div class="flex items-center">
                      <input 
                        id="courseApprovalRequired" 
                        type="checkbox" 
                        bind:checked={settings.courseApprovalRequired}
                        class="h-4 w-4 text-indigo-600 dark:text-indigo-500 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded"
                      />
                      <label for="courseApprovalRequired" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Course Approval Required
                      </label>
                    </div>
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Require admin approval for new courses</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-end">
        <button 
          type="button" 
          on:click={saveSettings}
          disabled={isSaving}
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {#if isSaving}
            <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving...
          {:else}
            Save Settings
          {/if}
        </button>
      </div>
    </div>
  {/if}
</div> 