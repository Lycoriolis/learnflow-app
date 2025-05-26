/**
 * Markdown optimization utilities specifically for exercise content
 * Fixes spacing, formatting, and rendering issues
 */

export interface MarkdownOptimizationOptions {
    fixSpacing: boolean;
    optimizeHeaders: boolean;
    enhanceMath: boolean;
    improveCodeBlocks: boolean;
    structureExercises: boolean;
}

export const defaultOptions: MarkdownOptimizationOptions = {
    fixSpacing: true,
    optimizeHeaders: true,
    enhanceMath: true,
    improveCodeBlocks: true,
    structureExercises: true
};

/**
 * Main function to optimize markdown content for exercises
 */
export function optimizeExerciseMarkdown(
    content: string, 
    options: Partial<MarkdownOptimizationOptions> = {}
): string {
    if (!content || typeof content !== 'string') {
        return '';
    }

    const opts = { ...defaultOptions, ...options };
    let optimized = content;

    // Fix line spacing issues first
    if (opts.fixSpacing) {
        optimized = fixSpacingIssues(optimized);
    }

    // Optimize headers
    if (opts.optimizeHeaders) {
        optimized = optimizeHeaders(optimized);
    }

    // Enhance math expressions
    if (opts.enhanceMath) {
        optimized = enhanceMathExpressions(optimized);
    }

    // Improve code blocks
    if (opts.improveCodeBlocks) {
        optimized = improveCodeBlocks(optimized);
    }

    // Structure exercise content
    if (opts.structureExercises) {
        optimized = structureExerciseContent(optimized);
    }

    return optimized.trim();
}

/**
 * Fix common spacing issues in markdown content
 */
function fixSpacingIssues(content: string): string {
    return content
        // Remove excessive blank lines (more than 2 consecutive)
        .replace(/\n{3,}/g, '\n\n')
        
        // Ensure proper spacing around headers
        .replace(/([^\n])\n(#{1,6}\s)/g, '$1\n\n$2')
        .replace(/(#{1,6}[^\n]*)\n([^\n#])/g, '$1\n\n$2')
        
        // Fix spacing around math blocks
        .replace(/([^\n])\n(\$\$)/g, '$1\n\n$2')
        .replace(/(\$\$)\n([^\n$])/g, '$1\n\n$2')
        
        // Fix spacing around code blocks
        .replace(/([^\n])\n(```)/g, '$1\n\n$2')
        .replace(/(```[^\n]*\n[\s\S]*?```)\n([^\n])/g, '$1\n\n$2')
        
        // Fix spacing around lists
        .replace(/([^\n])\n(\d+\.|\*|\-)\s/g, '$1\n\n$2 ')
        .replace(/(\d+\..*|[\*\-].*)\n([^\n\d\*\-\s])/g, '$1\n\n$2')
        
        // Remove trailing whitespace
        .replace(/[ \t]+$/gm, '')
        
        // Normalize line endings
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n');
}

/**
 * Optimize header structure and formatting
 */
function optimizeHeaders(content: string): string {
    return content
        // Ensure consistent header formatting
        .replace(/^(#{1,6})\s*(.+)\s*$/gm, '$1 $2')
        
        // Fix header hierarchy issues
        .replace(/^###+ (.+)/gm, (match, title) => {
            if (title.toLowerCase().includes('exercice')) {
                return `## ${title}`;
            }
            return match;
        })
        
        // Add structure to exercise headers
        .replace(/^## (Exercice\s+\d+(?:\.\d+)?)\s*:\s*(.+)$/gm, '## $1: $2')
        
        // Clean up header formatting
        .replace(/^(#{1,6})\s+(.+?)\s*#+\s*$/gm, '$1 $2');
}

/**
 * Enhance mathematical expressions formatting
 */
function enhanceMathExpressions(content: string): string {
    return content
        // Ensure proper spacing around inline math
        .replace(/([^\s\$])\$([^\$\s])/g, '$1 $$$2')
        .replace(/([^\$\s])\$([^\s\$])/g, '$1$ $2')
        
        // Fix display math blocks
        .replace(/\$\$\s*\n/g, '$$\n')
        .replace(/\n\s*\$\$/g, '\n$$')
        
        // Wrap system of equations properly
        .replace(/\\begin\{cases\}([\s\S]*?)\\end\{cases\}/g, (match, content) => {
            const cleanContent = content.trim();
            return `\n$$\\begin{cases}\n${cleanContent}\n\\end{cases}$$\n`;
        })
        
        // Fix common math symbols
        .replace(/\\mathbb\{([A-Z])\}/g, '\\mathbb{$1}')
        .replace(/\\llbracket/g, '\\llbracket')
        .replace(/\\rrbracket/g, '\\rrbracket')
        
        // Ensure proper spacing in math environments
        .replace(/\$\$([^$]+?)\$\$/g, (match, expr) => {
            const cleanExpr = expr.trim();
            return `\n$$${cleanExpr}$$\n`;
        });
}

/**
 * Improve code block formatting
 */
function improveCodeBlocks(content: string): string {
    return content
        // Ensure proper spacing around code blocks
        .replace(/([^\n])\n```/g, '$1\n\n```')
        .replace(/```\n([^\n])/g, '```\n\n$1')
        
        // Add language hints where missing
        .replace(/^```\n/gm, '```text\n')
        
        // Fix inline code spacing
        .replace(/([^\s`])`([^`\s])/g, '$1 `$2')
        .replace(/([^`\s])`([^\s`])/g, '$1` $2')
        
        // Clean up code block content
        .replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
            const cleanCode = code.replace(/^\s+|\s+$/g, '');
            return `\`\`\`${lang}\n${cleanCode}\n\`\`\``;
        });
}

/**
 * Structure exercise content for better organization
 */
function structureExerciseContent(content: string): string {
    return content
        // Standardize exercise numbering
        .replace(/^## Exercice (\d+)(?:\.(\d+))?\s*:\s*(.+)$/gm, (match, major, minor, title) => {
            const exerciseNum = minor ? `${major}.${minor}` : major;
            return `## Exercice ${exerciseNum}: ${title}`;
        })
        
        // Structure numbered items within exercises
        .replace(/^(\d+)\.\s+(.+)$/gm, (match, num, content) => {
            // Add proper spacing and structure
            return `${num}. ${content}`;
        })
        
        // Add solution sections where appropriate
        .replace(/^## (Solution|Réponse|Answer)\s*$/gm, '### $1')
        
        // Group related content
        .replace(/^(Soit|Soient|Montrer que|Calculer|Résoudre)\s+(.+)$/gm, '**$1** $2')
        
        // Enhance question formatting
        .replace(/^(\d+)\.\s+(Montrer que|Calculer|Résoudre|Soit|Soient)\s+(.+)$/gm, 
            '$1. **$2** $3');
}

/**
 * Validate and fix markdown structure
 */
export function validateMarkdownStructure(content: string): {
    isValid: boolean;
    issues: string[];
    suggestions: string[];
} {
    const issues: string[] = [];
    const suggestions: string[] = [];

    // Check for common issues
    if (content.includes('\n\n\n\n')) {
        issues.push('Excessive blank lines found');
        suggestions.push('Remove extra blank lines for better readability');
    }

    if (content.match(/\$[^$]*\$[^$]*\$/)) {
        issues.push('Potentially malformed inline math expressions');
        suggestions.push('Check math expressions for proper $ delimiters');
    }

    if (content.match(/^#{4,}/m)) {
        issues.push('Headers deeper than h3 found');
        suggestions.push('Consider restructuring content with fewer header levels');
    }

    if (!content.match(/^##?\s/m)) {
        issues.push('No main headers found');
        suggestions.push('Add proper header structure for better organization');
    }

    const mathBlocks = content.match(/\$\$[\s\S]*?\$\$/g) || [];
    const malformedMath = mathBlocks.filter(block => !block.includes('\n'));
    if (malformedMath.length > 0) {
        issues.push('Inline display math found');
        suggestions.push('Use proper display math formatting with line breaks');
    }

    return {
        isValid: issues.length === 0,
        issues,
        suggestions
    };
}

/**
 * Generate a summary of optimizations applied
 */
export function generateOptimizationReport(
    original: string, 
    optimized: string
): {
    originalLength: number;
    optimizedLength: number;
    spacingFixed: boolean;
    headersOptimized: boolean;
    mathEnhanced: boolean;
    codeImproved: boolean;
    exercisesStructured: boolean;
} {
    return {
        originalLength: original.length,
        optimizedLength: optimized.length,
        spacingFixed: !/\n{3,}/.test(optimized),
        headersOptimized: /^## Exercice \d+(?:\.\d+)?: /.test(optimized),
        mathEnhanced: /\$\$\n[\s\S]*?\n\$\$/.test(optimized),
        codeImproved: /```\w+\n[\s\S]*?\n```/.test(optimized),
        exercisesStructured: /^## Exercice/.test(optimized)
    };
}

/**
 * Quick fix function for common exercise markdown issues
 */
export function quickFixExerciseMarkdown(content: string): string {
    return optimizeExerciseMarkdown(content, {
        fixSpacing: true,
        optimizeHeaders: true,
        enhanceMath: true,
        improveCodeBlocks: false,
        structureExercises: true
    });
}
