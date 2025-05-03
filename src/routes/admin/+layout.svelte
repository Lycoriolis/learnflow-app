<script lang="ts">
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { adminStore } from '$lib/stores/adminStore';
	import { getAuth, signOut } from 'firebase/auth';

	// Initialize admin store on mount
	onMount(() => {
		adminStore.init();
		
		// Subscribe to admin store changes
		const unsubscribe = adminStore.subscribe(({ isAdmin, checkingStatus }) => {
			// If checking is complete and user is not admin, redirect to login
			if (!checkingStatus && !isAdmin && browser) {
				goto('/admin/login');
			}
		});
		
		return unsubscribe;
	});
	
	// Handle admin logout
	async function handleLogout() {
		try {
			const auth = getAuth();
			await signOut(auth);
			adminStore.reset();
			goto('/admin/login');
		} catch (error) {
			console.error('Logout error:', error);
		}
	}
</script>

<div class="flex h-screen bg-gray-100">
	<!-- Sidebar -->
	<div class="w-64 bg-indigo-800 text-white">
		<div class="p-4">
			<h1 class="text-2xl font-semibold">LearnFlow Admin</h1>
		</div>
		
		<nav class="mt-8">
			<a 
				href="/admin/dashboard" 
				class="flex items-center px-4 py-3 hover:bg-indigo-700 {$page.url.pathname === '/admin/dashboard' ? 'bg-indigo-700' : ''}"
			>
				<span class="mr-3">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
						<path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
					</svg>
				</span>
				Dashboard
			</a>
			
			<a 
				href="/admin/courses" 
				class="flex items-center px-4 py-3 hover:bg-indigo-700 {$page.url.pathname.startsWith('/admin/courses') ? 'bg-indigo-700' : ''}"
			>
				<span class="mr-3">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
						<path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
					</svg>
				</span>
				Courses
			</a>
			
			<a 
				href="/admin/users" 
				class="flex items-center px-4 py-3 hover:bg-indigo-700 {$page.url.pathname.startsWith('/admin/users') ? 'bg-indigo-700' : ''}"
			>
				<span class="mr-3">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
						<path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
					</svg>
				</span>
				Users
			</a>
			
			<a 
				href="/admin/analytics" 
				class="flex items-center px-4 py-3 hover:bg-indigo-700 {$page.url.pathname.startsWith('/admin/analytics') ? 'bg-indigo-700' : ''}"
			>
				<span class="mr-3">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
						<path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
					</svg>
				</span>
				Analytics
			</a>
			
			<a 
				href="/admin/settings" 
				class="flex items-center px-4 py-3 hover:bg-indigo-700 {$page.url.pathname.startsWith('/admin/settings') ? 'bg-indigo-700' : ''}"
			>
				<span class="mr-3">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
						<path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
					</svg>
				</span>
				Settings
			</a>
		</nav>
		
		<div class="absolute bottom-0 w-64 p-4 bg-indigo-900">
			<button 
				on:click={handleLogout}
				class="flex items-center w-full px-4 py-2 text-white bg-indigo-700 rounded hover:bg-indigo-600"
			>
				<span class="mr-3">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
						<path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm7 2v2.586l2.414 2.414H10v4h3v2H7v-2h3v-4H7V5h3z" clip-rule="evenodd" />
					</svg>
				</span>
				Logout
			</button>
		</div>
	</div>
	
	<!-- Main content -->
	<div class="flex-1 overflow-auto">
		<header class="bg-white shadow">
			<div class="px-6 py-4">
				<h2 class="text-xl font-semibold text-gray-800">
					{#if $page.url.pathname === '/admin/dashboard'}
						Admin Dashboard
					{:else if $page.url.pathname.startsWith('/admin/courses')}
						Course Management
					{:else if $page.url.pathname.startsWith('/admin/users')}
						User Management
					{:else if $page.url.pathname.startsWith('/admin/analytics')}
						Analytics
					{:else if $page.url.pathname.startsWith('/admin/settings')}
						Settings
					{:else}
						Admin Panel
					{/if}
				</h2>
			</div>
		</header>
		
		<main class="p-6">
			{#if $adminStore.checkingStatus}
				<div class="flex justify-center items-center h-64">
					<div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
				</div>
			{:else if $adminStore.isAdmin}
				<slot />
			{:else}
				<div class="text-center">
					<p>You don't have permission to access this page. Redirecting...</p>
				</div>
			{/if}
		</main>
	</div>
</div>