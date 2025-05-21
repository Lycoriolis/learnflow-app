import React, { useEffect } from 'react';
import 'katex/dist/katex.min.css'; // Import KaTeX CSS

interface MarkdownRendererProps {
  htmlContent: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ htmlContent }) => {
  // Basic styling for demonstration. You'll want to expand this with CSS.
  // Or, preferably, move these styles to a global CSS file or a CSS module.
  const styles = `
    .markdown-content h1 { font-size: 2em; margin-bottom: 0.5em; }
    .markdown-content h2 { font-size: 1.5em; margin-bottom: 0.5em; }
    .markdown-content h3 { font-size: 1.25em; margin-bottom: 0.5em; }
    .markdown-content p { line-height: 1.6; margin-bottom: 1em; }
    .markdown-content ul, .markdown-content ol { margin-left: 20px; margin-bottom: 1em; padding-left: 1.5em; }
    .markdown-content li { margin-bottom: 0.25em; }
    .markdown-content code:not(pre > code) { background-color: #f0f0f0; padding: 0.2em 0.4em; margin: 0 0.1em; border-radius: 3px; font-size: 0.9em; }
    .markdown-content pre { background-color: #2d2d2d; color: #f0f0f0; padding: 1em; border-radius: 5px; overflow-x: auto; margin-bottom: 1em; }
    .markdown-content pre code { background-color: transparent; padding: 0; margin: 0; font-size: 0.9em; }
    .markdown-content blockquote { border-left: 4px solid #ccc; margin-left: 0; padding-left: 1em; color: #555; font-style: italic; }
    .markdown-content table { border-collapse: collapse; width: auto; margin-bottom: 1em; }
    .markdown-content th, .markdown-content td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    .markdown-content th { background-color: #f2f2f2; }
    /* KaTeX styles are imported globally via 'katex/dist/katex.min.css' */
  `;

  return (
    <>
      <style jsx global>{styles}</style>
      <div className="markdown-content" dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </>
  );
};

export default MarkdownRenderer;
