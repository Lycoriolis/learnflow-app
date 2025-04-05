<script>
  const categories = [
    {
      id: 'profile',
      title: 'Profile',
      icon: 'fa-user'
    },
    {
      id: 'account',
      title: 'Account',
      icon: 'fa-shield-alt'
    },
    {
      id: 'appearance',
      title: 'Appearance',
      icon: 'fa-palette'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: 'fa-bell'
    },
    {
      id: 'privacy',
      title: 'Privacy',
      icon: 'fa-lock'
    }
  ];
  
  let activeCategory = 'profile';
  
  function setCategory(id) {
    activeCategory = id;
  }
</script>

<div class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
  <h1 class="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
  
  <div class="bg-white rounded-xl shadow-sm overflow-hidden">
    <div class="flex flex-col md:flex-row">
      <!-- Sidebar -->
      <div class="w-full md:w-64 border-r border-gray-200">
        <nav class="p-4">
          {#each categories as category}
            <button
              on:click={() => setCategory(category.id)}
              class="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 text-left {activeCategory === category.id ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'}"
            >
              <i class="fas {category.icon} w-5 mr-2 {activeCategory === category.id ? 'text-indigo-600' : 'text-gray-400'}"></i>
              {category.title}
            </button>
          {/each}
        </nav>
      </div>
      
      <!-- Content -->
      <div class="flex-1 p-6">
        <div class="max-w-2xl">
          <!-- Profile settings -->
          {#if activeCategory === 'profile'}
            <h2 class="text-lg font-medium text-gray-900 mb-4">Profile Settings</h2>
            <p class="text-gray-500 mb-6">Manage your personal information and how it appears to others.</p>
            
            <div class="space-y-6">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" id="name" value="Alex Morgan" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border" />
              </div>
              
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" id="email" value="alex@example.com" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border" />
              </div>
              
              <div>
                <button class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  Save Changes
                </button>
              </div>
            </div>
          {:else}
            <div class="text-center py-8">
              <p class="text-gray-500">This settings section is coming soon...</p>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>
