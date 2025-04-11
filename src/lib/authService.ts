import { Auth0Client, createAuth0Client } from '@auth0/auth0-spa-js';
import { isAuthenticated, user, loading } from './stores/authStore.js';
import { PUBLIC_AUTH0_DOMAIN, PUBLIC_AUTH0_CLIENT_ID } from '$env/static/public';

let client: Auth0Client;

async function getClient(): Promise<Auth0Client> {
	if (client) return client;

	client = await createAuth0Client({
		domain: PUBLIC_AUTH0_DOMAIN,
		clientId: PUBLIC_AUTH0_CLIENT_ID,
		authorizationParams: {
			redirect_uri: window.location.origin
		},
		cacheLocation: 'localstorage' // Optional: Consider using local storage for better persistence
	});

	return client;
}

async function checkAuth(): Promise<void> {
	loading.set(true);
	try {
		const authClient = await getClient();
		const authenticated = await authClient.isAuthenticated();
		isAuthenticated.set(authenticated);
		if (authenticated) {
			const userData = await authClient.getUser();
			user.set(userData ?? null); // Set user data or null if undefined
		} else {
			user.set(null); // Clear user data if not authenticated
		}
	} catch (err) {
		console.error('Auth check error:', err);
		isAuthenticated.set(false);
		user.set(null);
	} finally {
		loading.set(false);
	}
}

async function login(): Promise<void> {
	const authClient = await getClient();
	try {
		console.log('Login initiating with redirect_uri:', window.location.origin);
		await authClient.loginWithRedirect();
	} catch (err) {
		console.error('Login error:', err);
	}
}

async function logout(): Promise<void> {
	const authClient = await getClient();
	try {
		await authClient.logout({
			logoutParams: {
				returnTo: window.location.origin
			}
		});
		isAuthenticated.set(false);
		user.set(null);
	} catch (err) {
		console.error('Logout error:', err);
	}
}

// Function to handle the redirect callback
async function handleRedirectCallback(): Promise<void> {
	loading.set(true);
	try {
		const authClient = await getClient();
		console.log('Handling redirect callback from origin:', window.location.origin);
		// Check if the URL contains auth parameters
		const params = new URLSearchParams(window.location.search);
		if (params.has('code') && params.has('state')) {
			await authClient.handleRedirectCallback();
			// Update auth state after handling callback
			await checkAuth();
			// Clean the URL
			window.history.replaceState({}, document.title, window.location.pathname);
		} else {
			// If no auth params, just check the current auth state
			await checkAuth();
		}
	} catch (err) {
		console.error('Redirect callback error:', err);
		isAuthenticated.set(false);
		user.set(null);
	} finally {
		loading.set(false);
	}
}


export { getClient, checkAuth, login, logout, handleRedirectCallback }; 