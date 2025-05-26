<script lang="ts">
	import { goto } from '$app/navigation';
	import { adminLogin, isAllowedAdminEmail } from '$lib/services/adminService';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	// Form state
	const email = writable('');
	const password = writable('');
	const error = writable('');
	const loading = writable(false);
	const submitted = writable(false);

	// Handle admin login
	async function handleAdminLogin() {
		$error = '';
		$loading = true;
		$submitted = true;

		try {
			// Basic validation
			if (!$email || !$password) {
				$error = 'Please enter both email and password';
				$loading = false;
				return;
			}

			// Check if email is in allowed admin list
			if (!isAllowedAdminEmail($email)) {
				$error = 'This email is not authorized for admin access';
				$loading = false;
				return;
			}

			// Attempt login
			await adminLogin($email, $password);
			
			// Redirect to admin dashboard on success
			goto('/admin/dashboard');
		} catch (err: any) {
			console.error('Admin login error:', err);
			$error = err.message || 'Authentication failed. Please check your credentials.';
		} finally {
			$loading = false;
		}
	}

	onMount(() => {
		// Reset form state when component mounts
		$email = '';
		$password = '';
		$error = '';
		$submitted = false;
	});
</script>

<div class="flex items-center justify-center min-h-screen bg-gray-100">
	<div class="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
		<div class="text-center">
			<h1 class="text-2xl font-bold text-gray-900">Admin Login</h1>
			<p class="mt-2 text-sm text-gray-600">
				Please enter your credentials to access the admin dashboard
			</p>
		</div>

		<form class="mt-8 space-y-6" on:submit|preventDefault={handleAdminLogin}>
			{#if $error}
				<div class="p-3 text-sm text-red-600 bg-red-100 rounded-md" role="alert">
					{$error}
				</div>
			{/if}

			<div class="space-y-4">
				<div>
					<label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
					<input
						id="email"
						name="email"
						type="email"
						autocomplete="email"
						required
						bind:value={$email}
						class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
					/>
				</div>

				<div>
					<label for="password" class="block text-sm font-medium text-gray-700">Password</label>
					<input
						id="password"
						name="password"
						type="password"
						autocomplete="current-password"
						required
						bind:value={$password}
						class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
					/>
				</div>
			</div>

			<div>
				<button
					type="submit"
					disabled={$loading}
					class="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
					aria-label={$loading ? 'Signing in...' : 'Sign in to admin panel'}
				>
					{#if $loading}
						<svg class="w-5 h-5 mr-2 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true"
							>
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						Signing in...
					{:else}
						Sign in
					{/if}
				</button>
			</div>
		</form>

		<div class="mt-6 text-center">
			<a href="/" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">
				Return to home page
			</a>
		</div>
	</div>
</div>