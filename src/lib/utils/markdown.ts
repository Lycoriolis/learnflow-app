/**
 * Utility functions for working with markdown
 */

// Simple markdown renderer that doesn't require external libraries
export function renderMarkdown(markdown: string | null | undefined): string {
  // This is a very basic markdown renderer
  // For a real app, you'd want to use a proper library
  if (!markdown) return '';

  return markdown
    // Handle headings
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Handle code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/gm, '<pre><code class="language-$1">$2</code></pre>')
    // Handle inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Handle bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Handle emphasis
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Handle links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // Handle paragraphs
    .replace(/^\s*(\n)?(.+)/gm, function(match: string) {
      return /^<(\/)?(h\d|pre|ul|ol|li|blockquote|p|table|tr|td|th)/.test(match) ? match : '<p>' + match + '</p>';
    })
    // Handle line breaks
    .replace(/\n/g, '<br>');
}

// Function to load external markdown renderer from CDN
export function loadMarkedLibrary(): Promise<any> {
  return new Promise((resolve) => {
    // If already loaded, resolve immediately
    if (typeof window !== 'undefined' && window.marked) {
      resolve(window.marked);
      return;
    }

    // Otherwise load from CDN
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/marked@4.3.0/marked.min.js';
    script.onload = () => resolve(window.marked);
    document.head.appendChild(script);
  });
}
