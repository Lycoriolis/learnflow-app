/**
 * Utility functions for working with markdown
 */
import MarkdownIt from 'markdown-it';
import MarkdownItContainer from 'markdown-it-container';
import MarkdownItKatex from 'markdown-it-katex';
import hljs from 'highlight.js';
import DOMPurify from 'dompurify';
import { browser } from '$app/environment';

// Initialize the markdown-it instance with our configuration
const md: MarkdownIt = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
  // Configure syntax highlighting with highlight.js
  highlight: function(str: string, lang: string): string {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code class="language-${lang}">${
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
        }</code></pre>`;
      } catch (err) {
        console.error('Highlight.js error:', err);
      }
    }
    
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
  }
});

// Add plugins
md.use(MarkdownItKatex);

// Add container plugin for callouts
md.use(MarkdownItContainer, 'info', {
  validate: function(params: string) {
    return params.trim().match(/^info/);
  },
  render: function(tokens: any[], idx: number) {
    if (tokens[idx].nesting === 1) {
      // opening tag
      return '<div class="info">\n';
    } else {
      // closing tag
      return '</div>\n';
    }
  }
});

md.use(MarkdownItContainer, 'warning', {
  validate: function(params: string) {
    return params.trim().match(/^warning/);
  },
  render: function(tokens: any[], idx: number) {
    if (tokens[idx].nesting === 1) {
      return '<div class="warning">\n';
    } else {
      return '</div>\n';
    }
  }
});

md.use(MarkdownItContainer, 'danger', {
  validate: function(params: string) {
    return params.trim().match(/^danger/);
  },
  render: function(tokens: any[], idx: number) {
    if (tokens[idx].nesting === 1) {
      return '<div class="danger">\n';
    } else {
      return '</div>\n';
    }
  }
});

/**
 * Renders markdown content to HTML with sanitization
 */
export function renderMarkdown(content: string): string {
  if (!content) return '';
  
  try {
    // Render markdown to HTML
    const html = md.render(content);
    
    // Sanitize the output HTML to prevent XSS
    if (browser && DOMPurify) {
      return DOMPurify.sanitize(html, {
        USE_PROFILES: { html: true },
        ADD_ATTR: ['target', 'rel'],
        ADD_TAGS: ['math', 'mrow', 'mi', 'mo', 'mn', 'msup', 'sub', 'sup']
      });
    }
    
    return html;
  } catch (error) {
    console.error('Error rendering markdown:', error);
    return `<p>Error rendering content</p>`;
  }
}

/**
 * Legacy compatibility for code that might be using marked
 * @deprecated Use renderMarkdown() instead
 */
export function loadMarkedLibrary(): Promise<{ parse: (markdown: string) => string }> {
  return Promise.resolve({
    parse: (markdown: string) => renderMarkdown(markdown)
  });
}