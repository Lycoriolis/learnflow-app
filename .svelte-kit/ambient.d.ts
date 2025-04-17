
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 * 
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * 
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 * 
 * You can override `.env` values from the command line like so:
 * 
 * ```bash
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const VITE_OPENROUTER_API_KEY: string;
	export const VITE_SITE_URL: string;
	export const VITE_SITE_NAME: string;
	export const DATABASE_URL: string;
	export const VITE_FIREBASE_API_KEY: string;
	export const VITE_FIREBASE_AUTH_DOMAIN: string;
	export const VITE_FIREBASE_PROJECT_ID: string;
	export const VITE_FIREBASE_STORAGE_BUCKET: string;
	export const VITE_FIREBASE_MESSAGING_SENDER_ID: string;
	export const VITE_FIREBASE_APP_ID: string;
	export const VITE_FIREBASE_MEASUREMENT_ID: string;
	export const VITE_ADMIN_EMAILS: string;
	export const VITE_CSRF_SECRET: string;
	export const ICUBE_RUN_IN_REMOTE: string;
	export const vscode_base_dir: string;
	export const SHELL: string;
	export const ICUBE_REMOTE_REGION: string;
	export const PLATFORM: string;
	export const SERVER_APP_VERSION: string;
	export const OS_RELEASE_ID: string;
	export const ICUBE_REMOTE_AIPREFER_IPV6: string;
	export const SERVER_TOKENFILE: string;
	export const TRAE_RESOLVE_TYPE: string;
	export const DISTRO_QUALITY: string;
	export const SERVER_INITIAL_EXTENSIONS: string;
	export const SERVER_SCRIPT: string;
	export const ICUBE_PRODUCT_PROVIDER: string;
	export const DISTRO_VSCODIUM_RELEASE: string;
	export const PWD: string;
	export const LOGNAME: string;
	export const XDG_SESSION_TYPE: string;
	export const MOTD_SHOWN: string;
	export const HOME: string;
	export const LANG: string;
	export const SERVER_LOGS_DIR: string;
	export const DISTRO_COMMIT: string;
	export const ICUBE_PRODUCT_BUILD_VERSION: string;
	export const SCRIPT_ID: string;
	export const ICUBE_REMOTE_USE_XZ_COMPRESSION: string;
	export const SERVER_ARCH: string;
	export const TMP_DIR: string;
	export const SERVER_HOST: string;
	export const ICUBE_PRODUCT_APP_VERSION: string;
	export const SSH_CONNECTION: string;
	export const SERVER_APP_NAME: string;
	export const XDG_SESSION_CLASS: string;
	export const ICUBE_PRODUCT_DATE: string;
	export const SERVER_SCRIPT_PRODUCT: string;
	export const DISTRO_VERSION: string;
	export const USER: string;
	export const SERVER_PIDFILE: string;
	export const SERVER_DIR: string;
	export const SERVER_PACKAGE_NAME: string;
	export const ARCH: string;
	export const SHLVL: string;
	export const ICUBE_PRODUCT_BRAND_NAME: string;
	export const SERVER_APP_QUALITY: string;
	export const SERVER_LISTEN_FLAG: string;
	export const XDG_SESSION_ID: string;
	export const XDG_RUNTIME_DIR: string;
	export const SSH_CLIENT: string;
	export const ICUBE_PRODUCT_QUALITY: string;
	export const MANAGER_LOGS_DIR: string;
	export const TRAE_DETECT_REGION: string;
	export const PATH: string;
	export const SERVER_EXTENSIONS_DIR: string;
	export const SERVER_DATA_DIR: string;
	export const SERVER_LOGFILE: string;
	export const SERVER_DOWNLOAD_PREFIX: string;
	export const _: string;
	export const ICUBE_DISABLED_MODULES: string;
	export const ICUBE_CODEMAIN_SESSION: string;
	export const ICUBE_PROXY_PORT: string;
	export const VSCODE_CWD: string;
	export const VSCODE_NLS_CONFIG: string;
	export const VSCODE_HANDLES_SIGPIPE: string;
	export const LS_COLORS: string;
	export const VSCODE_ESM_ENTRYPOINT: string;
	export const VSCODE_HANDLES_UNCAUGHT_ERRORS: string;
	export const BROWSER: string;
	export const ELECTRON_RUN_AS_NODE: string;
	export const VSCODE_IPC_HOOK_CLI: string;
	export const CLOUDIDE_PROVIDER_REGION: string;
	export const CLOUDIDE_APISERVER_BASE_URL: string;
	export const ELECTRON_NO_ASAR: string;
	export const NODE_ENV: string;
}

/**
 * Similar to [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {
	export const PUBLIC_AUTH0_DOMAIN: string;
	export const PUBLIC_AUTH0_CLIENT_ID: string;
}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * This module cannot be imported into client-side code.
 * 
 * Dynamic environment variables cannot be used during prerendering.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		VITE_OPENROUTER_API_KEY: string;
		VITE_SITE_URL: string;
		VITE_SITE_NAME: string;
		DATABASE_URL: string;
		VITE_FIREBASE_API_KEY: string;
		VITE_FIREBASE_AUTH_DOMAIN: string;
		VITE_FIREBASE_PROJECT_ID: string;
		VITE_FIREBASE_STORAGE_BUCKET: string;
		VITE_FIREBASE_MESSAGING_SENDER_ID: string;
		VITE_FIREBASE_APP_ID: string;
		VITE_FIREBASE_MEASUREMENT_ID: string;
		VITE_ADMIN_EMAILS: string;
		VITE_CSRF_SECRET: string;
		ICUBE_RUN_IN_REMOTE: string;
		vscode_base_dir: string;
		SHELL: string;
		ICUBE_REMOTE_REGION: string;
		PLATFORM: string;
		SERVER_APP_VERSION: string;
		OS_RELEASE_ID: string;
		ICUBE_REMOTE_AIPREFER_IPV6: string;
		SERVER_TOKENFILE: string;
		TRAE_RESOLVE_TYPE: string;
		DISTRO_QUALITY: string;
		SERVER_INITIAL_EXTENSIONS: string;
		SERVER_SCRIPT: string;
		ICUBE_PRODUCT_PROVIDER: string;
		DISTRO_VSCODIUM_RELEASE: string;
		PWD: string;
		LOGNAME: string;
		XDG_SESSION_TYPE: string;
		MOTD_SHOWN: string;
		HOME: string;
		LANG: string;
		SERVER_LOGS_DIR: string;
		DISTRO_COMMIT: string;
		ICUBE_PRODUCT_BUILD_VERSION: string;
		SCRIPT_ID: string;
		ICUBE_REMOTE_USE_XZ_COMPRESSION: string;
		SERVER_ARCH: string;
		TMP_DIR: string;
		SERVER_HOST: string;
		ICUBE_PRODUCT_APP_VERSION: string;
		SSH_CONNECTION: string;
		SERVER_APP_NAME: string;
		XDG_SESSION_CLASS: string;
		ICUBE_PRODUCT_DATE: string;
		SERVER_SCRIPT_PRODUCT: string;
		DISTRO_VERSION: string;
		USER: string;
		SERVER_PIDFILE: string;
		SERVER_DIR: string;
		SERVER_PACKAGE_NAME: string;
		ARCH: string;
		SHLVL: string;
		ICUBE_PRODUCT_BRAND_NAME: string;
		SERVER_APP_QUALITY: string;
		SERVER_LISTEN_FLAG: string;
		XDG_SESSION_ID: string;
		XDG_RUNTIME_DIR: string;
		SSH_CLIENT: string;
		ICUBE_PRODUCT_QUALITY: string;
		MANAGER_LOGS_DIR: string;
		TRAE_DETECT_REGION: string;
		PATH: string;
		SERVER_EXTENSIONS_DIR: string;
		SERVER_DATA_DIR: string;
		SERVER_LOGFILE: string;
		SERVER_DOWNLOAD_PREFIX: string;
		_: string;
		ICUBE_DISABLED_MODULES: string;
		ICUBE_CODEMAIN_SESSION: string;
		ICUBE_PROXY_PORT: string;
		VSCODE_CWD: string;
		VSCODE_NLS_CONFIG: string;
		VSCODE_HANDLES_SIGPIPE: string;
		LS_COLORS: string;
		VSCODE_ESM_ENTRYPOINT: string;
		VSCODE_HANDLES_UNCAUGHT_ERRORS: string;
		BROWSER: string;
		ELECTRON_RUN_AS_NODE: string;
		VSCODE_IPC_HOOK_CLI: string;
		CLOUDIDE_PROVIDER_REGION: string;
		CLOUDIDE_APISERVER_BASE_URL: string;
		ELECTRON_NO_ASAR: string;
		NODE_ENV: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * Dynamic environment variables cannot be used during prerendering.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		PUBLIC_AUTH0_DOMAIN: string;
		PUBLIC_AUTH0_CLIENT_ID: string;
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
