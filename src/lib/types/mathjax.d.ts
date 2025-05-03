export interface MathJax {
  typesetPromise: (elements: HTMLElement[]) => Promise<void>;
  startup: {
    defaultPageReady: () => Promise<void>;
    defaultReady: () => void;
  };
}

declare global {
  interface Window {
    MathJax?: MathJax;
  }
}

export {};