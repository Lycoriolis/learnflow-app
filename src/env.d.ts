/// <reference types="@sveltejs/kit" />
/// <reference types="vite/client" />

declare module "$env/dynamic/private" {
  export const env: Record<string, string>;
}

declare module "$env/dynamic/public" {
  export const env: Record<string, string>;
  export const API_URL: string;
  export const PUBLIC_VITE_ADMIN_EMAILS: string;
}

declare module "$env/static/private" {
  export const OPENROUTER_API_KEY: string;
}
