/**
 * Utility functions for working with markdown
 */
import MarkdownIt from 'markdown-it';
import MarkdownItContainer from 'markdown-it-container';
import MarkdownItKatex from 'markdown-it-katex';
import MarkdownItAnchor from 'markdown-it-anchor';
import MarkdownItTOC from 'markdown-it-toc-done-right';
import hljs from 'highlight.js';
import DOMPurify from 'dompurify';
import { browser } from '$app/environment';
import slugify from 'slugify';

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
        return `<pre class="hljs" data-language="${lang}"><code class="language-${lang}">${
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
        }</code></pre>`;
      } catch (err) {
        console.error('Highlight.js error:', err);
        // Return the original code, escaped, but with an error message or indication
        return `<pre class="hljs hljs-error"><code class="language-${lang}">${md.utils.escapeHtml(str)}</code></pre>`;
      }
    }
    
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
  }
});

// Add anchors to headings
md.use(MarkdownItAnchor, {
  slugify: (s: string) => slugify(s, { lower: true, strict: true }),
  permalink: true,
  permalinkClass: 'header-anchor',
  permalinkSymbol: '#',
  permalinkBefore: false
});

// Add table of contents
md.use(MarkdownItTOC, {
  slugify: (s: string) => slugify(s, { lower: true, strict: true }),
  listType: 'ul',
  containerClass: 'table-of-contents',
  level: [2, 3, 4]
});

// Add KaTeX for math rendering
md.use(MarkdownItKatex, {
  throwOnError: false,
  errorColor: '#cc0000',
  strict: false,
  trust: true,
  macros: {
    // Set notation
    "\\R": "\\mathbb{R}",
    "\\N": "\\mathbb{N}",
    "\\Z": "\\mathbb{Z}",
    "\\Q": "\\mathbb{Q}",
    "\\C": "\\mathbb{C}",
    "\\P": "\\mathbb{P}",
    "\\E": "\\mathbb{E}",
    
    // Complex numbers
    "\\Re": "\\operatorname{Re}",
    "\\Im": "\\operatorname{Im}",
    "\\conj": "\\overline",
    
    // Common functions
    "\\sin": "\\operatorname{sin}",
    "\\cos": "\\operatorname{cos}",
    "\\tan": "\\operatorname{tan}",
    "\\ln": "\\operatorname{ln}",
    "\\log": "\\operatorname{log}",
    "\\exp": "\\operatorname{exp}",
    "\\sgn": "\\operatorname{sgn}",
    
    // Linear algebra
    "\\tr": "\\operatorname{tr}",
    "\\rank": "\\operatorname{rank}",
    "\\det": "\\operatorname{det}",
    "\\dim": "\\operatorname{dim}",
    "\\span": "\\operatorname{span}",
    "\\ker": "\\operatorname{ker}",
    "\\im": "\\operatorname{im}",
    
    // Probability
    "\\Var": "\\operatorname{Var}",
    "\\Cov": "\\operatorname{Cov}",
    "\\Corr": "\\operatorname{Corr}",
    
    // Delimiters
    "\\bigl": "\\left",
    "\\bigr": "\\right",
    "\\Bigl": "\\left",
    "\\Bigr": "\\right",
    
    // Shortcuts
    "\\eps": "\\varepsilon",
    "\\phi": "\\varphi",
    "\\theta": "\\vartheta",
    "\\rho": "\\varrho",
    
    // Arrows
    "\\ra": "\\rightarrow",
    "\\la": "\\leftarrow",
    "\\lra": "\\leftrightarrow",
    "\\Ra": "\\Rightarrow",
    "\\La": "\\Leftarrow",
    "\\Lra": "\\Leftrightarrow"
  },
  delimiters: [
    { left: "$$", right: "$$", display: true },
    { left: "$", right: "$", display: false },
    { left: "\\(", right: "\\)", display: false },
    { left: "\\[", right: "\\]", display: true }
  ]
});

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

// Add custom example container
md.use(MarkdownItContainer, 'example', {
  validate: function(params: string) {
    return params.trim().match(/^example/);
  },
  render: function(tokens: any[], idx: number) {
    if (tokens[idx].nesting === 1) {
      return '<div class="example-box">\n<h4>Example</h4>\n';
    } else {
      return '</div>\n';
    }
  }
});

// Add key concept container
md.use(MarkdownItContainer, 'key-concept', {
  validate: function(params: string) {
    return params.trim().match(/^key-concept/);
  },
  render: function(tokens: any[], idx: number) {
    if (tokens[idx].nesting === 1) {
      return '<div class="key-concept-box">\n<h4>Key Concept</h4>\n';
    } else {
      return '</div>\n';
    }
  }
});

// Add exercise container
md.use(MarkdownItContainer, 'exercise', {
  validate: function(params: string) {
    return params.trim().match(/^exercise/);
  },
  render: function(tokens: any[], idx: number) {
    if (tokens[idx].nesting === 1) {
      return '<div class="exercise">\n';
    } else {
      return '</div>\n';
    }
  }
});

// Add solution container
md.use(MarkdownItContainer, 'solution', {
  validate: function(params: string) {
    return params.trim().match(/^solution/);
  },
  render: function(tokens: any[], idx: number) {
    if (tokens[idx].nesting === 1) {
      return '<div class="solution">\n<h4>Solution</h4>\n';
    } else {
      return '</div>\n';
    }
  }
});

// Add hint container
md.use(MarkdownItContainer, 'hint', {
  validate: function(params: string) {
    return params.trim().match(/^hint/);
  },
  render: function(tokens: any[], idx: number) {
    if (tokens[idx].nesting === 1) {
      return '<div class="hint">\n<h4>Hint</h4>\n';
    } else {
      return '</div>\n';
    }
  }
});

// Add theorem container
md.use(MarkdownItContainer, 'theorem', {
  validate: function(params: string) {
    return params.trim().match(/^theorem/);
  },
  render: function(tokens: any[], idx: number) {
    if (tokens[idx].nesting === 1) {
      return '<div class="theorem">\n';
    } else {
      return '</div>\n';
    }
  }
});

// Add definition container
md.use(MarkdownItContainer, 'definition', {
  validate: function(params: string) {
    return params.trim().match(/^definition/);
  },
  render: function(tokens: any[], idx: number) {
    if (tokens[idx].nesting === 1) {
      return '<div class="definition">\n';
    } else {
      return '</div>\n';
    }
  }
});

// Add French course-specific callout containers
md.use(MarkdownItContainer, 'callout-definition', {
  validate: function(params: string) {
    return params.trim().match(/^callout-definition/);
  },
  render: function(tokens: any[], idx: number) {
    if (tokens[idx].nesting === 1) {
      return '<div class="callout callout-definition">\n';
    } else {
      return '</div>\n';
    }
  }
});

md.use(MarkdownItContainer, 'callout-proposition', {
  validate: function(params: string) {
    return params.trim().match(/^callout-proposition/);
  },
  render: function(tokens: any[], idx: number) {
    if (tokens[idx].nesting === 1) {
      return '<div class="callout callout-proposition">\n';
    } else {
      return '</div>\n';
    }
  }
});

md.use(MarkdownItContainer, 'callout-example', {
  validate: function(params: string) {
    return params.trim().match(/^callout-example/);
  },
  render: function(tokens: any[], idx: number) {
    if (tokens[idx].nesting === 1) {
      return '<div class="callout callout-example">\n';
    } else {
      return '</div>\n';
    }
  }
});

md.use(MarkdownItContainer, 'callout-note', {
  validate: function(params: string) {
    return params.trim().match(/^callout-note/);
  },
  render: function(tokens: any[], idx: number) {
    if (tokens[idx].nesting === 1) {
      return '<div class="callout callout-note">\n';
    } else {
      return '</div>\n';
    }
  }
});

md.use(MarkdownItContainer, 'callout-generic-emphasis', {
  validate: function(params: string) {
    return params.trim().match(/^callout-generic-emphasis/);
  },
  render: function(tokens: any[], idx: number) {
    if (tokens[idx].nesting === 1) {
      return '<div class="callout callout-generic-emphasis">\n';
    } else {
      return '</div>\n';
    }
  }
});

/**
 * Converts course content with bold-based callouts to container-based callouts
 * This function processes French course content that uses bold text patterns like "**Définition:** content"
 * and converts them to the new container format for enhanced rendering
 */
export function processCourseCallouts(content: string): string {
  if (!content) return '';
  
  const calloutConfig = [
    { 
      type: 'definition', 
      keywords: ['Définition'], 
      containerClass: 'callout-definition' 
    },
    { 
      type: 'proposition', 
      keywords: ['Proposition', 'Théorème', 'Lemme', 'Corollaire'], 
      containerClass: 'callout-proposition' 
    },
    { 
      type: 'example', 
      keywords: ['Exemple'], 
      containerClass: 'callout-example' 
    },
    { 
      type: 'note', 
      keywords: ['Note', 'Remarque'], 
      containerClass: 'callout-note' 
    },
    { 
      type: 'emphasis', 
      keywords: [
        'Sommes géométriques', 'Sommes télescopiques', 'Combinaisons',
        'Formule du binôme de Newton', 'Factorisations remarquables',
        'Structure affine de l\'ensemble des solutions',
        'Méthode du pivot de Gauss',
        'Développement d\'un produit de sommes :'
      ], 
      containerClass: 'callout-generic-emphasis' 
    }
  ];

  // Process paragraphs that start with bold text matching our keywords
  let processedContent = content;
  
  // Split content into lines for processing
  const lines = processedContent.split('\n');
  const processedLines: string[] = [];
  let i = 0;
  
  while (i < lines.length) {
    const line = lines[i].trim();
    
    // Check if this line starts with a bold keyword we want to convert
    let matchedConfig: any = null;
    let matchedKeyword: string = '';
    
    for (const config of calloutConfig) {
      for (const keyword of config.keywords) {
        // Look for patterns like **Définition:** or **Proposition:**
        const boldPattern = new RegExp(`^\\*\\*(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}):?\\*\\*(.*)$`, 'i');
        const match = line.match(boldPattern);
        
        if (match) {
          matchedConfig = config;
          matchedKeyword = keyword;
          break;
        }
      }
      if (matchedConfig) break;
    }
    
    if (matchedConfig) {
      // Start a container block
      processedLines.push(`:::: ${matchedConfig.containerClass}`);
      processedLines.push(`**${matchedKeyword}${line.includes(':') ? ':' : ''}** ${line.replace(/^\*\*[^*]+\*\*:?\s*/, '')}`);
      
      // Collect following lines until we hit an empty line or another heading/callout
      i++;
      while (i < lines.length) {
        const nextLine = lines[i].trim();
        
        // Stop if we hit an empty line or another potential callout
        if (!nextLine || nextLine.startsWith('#') || nextLine.match(/^\*\*[^*]+\*\*/)) {
          break;
        }
        
        processedLines.push(lines[i]);
        i++;
      }
      
      // Close the container
      processedLines.push('::::');
      
      // Don't increment i here since we might need to process the current line
      continue;
    } else {
      // Regular line, add as-is
      processedLines.push(lines[i]);
      i++;
    }
  }
  
  return processedLines.join('\n');
}

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
        ADD_ATTR: ['target', 'rel', 'data-language'],
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