/// <reference types="svelte" />
/// <reference types="@sveltejs/kit" />

/**
 * Declaration file for Svelte HTML elements to fix TypeScript errors
 */
declare namespace svelteHTML {
  interface HTMLAttributes<T> {
    // Event handlers with proper Svelte syntax
    'on:click'?: (event: CustomEvent<MouseEvent>) => void;
    'on:mouseover'?: (event: CustomEvent<MouseEvent>) => void;
    'on:mouseenter'?: (event: CustomEvent<MouseEvent>) => void;
    'on:mouseleave'?: (event: CustomEvent<MouseEvent>) => void;
    'on:focus'?: (event: CustomEvent<FocusEvent>) => void;
    'on:blur'?: (event: CustomEvent<FocusEvent>) => void;
    'on:keydown'?: (event: CustomEvent<KeyboardEvent>) => void;
    'on:keyup'?: (event: CustomEvent<KeyboardEvent>) => void;
    'on:input'?: (event: CustomEvent<InputEvent>) => void;
    'on:change'?: (event: CustomEvent<Event>) => void;
    'on:submit'?: (event: CustomEvent<SubmitEvent>) => void;
    'on:error'?: (event: CustomEvent<ErrorEvent>) => void;
    'on:load'?: (event: CustomEvent<Event>) => void;
    
    // Allow any other custom events or attributes
    [key: string]: any;
  }
  
  interface SVGAttributes<T> {
    [key: string]: any;
  }
  
  interface IntrinsicElements {
    [elem: string]: any;
  }
}
