// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

    // Add Splide to the Window interface
    interface Window {
        Splide: any; // Use 'any' for simplicity, or install @splidejs/splide types
    }
}

export {};
