import fs from 'fs';
import path from 'path';
// gray-matter is still useful for quickly reading frontmatter for navigation hierarchy without full module import
import matter from 'gray-matter'; 

// NOTE: The 'process.cwd()' approach for 'contentDirectory' might behave differently
// when Vite processes files in `src/lib`. 
// For dynamic imports, relative paths from the importing file are often more reliable,
// or using Vite's import.meta.glob.

// For simplicity in this refactor, we'll try to adapt, but `import.meta.glob` is robust.
// const contentDirectory = path.join(process.cwd(), 'src/lib/content'); // Old path if running script from project root
// Vite's `import.meta.glob` is the preferred way to handle collections of modules.

export interface MdxContentData {
  id: string;
  component: any; // This will be the Svelte component from MDX
  frontmatter: Record<string, any>;
  [key: string]: any; // For other properties if needed
}

export interface Theme {
  slug: string;
  title: string;
  description?: string;
  order?: number;
}

export interface NavItem {
  title: string;
  slug: string[];
  path: string;
  order?: number;
  children?: NavItem[];
  type?: string;
  description?: string;
}

interface SvelteKitEntryParams { // For prerendering paths
  theme: string;
  courseContentSlug?: string;
}


// --- Using import.meta.glob for robust module discovery ---
// This is the most reliable way with Vite to get all MDX modules.
// It works at build time and provides metadata.

// Path relative to the project root for glob pattern
const mdxModules = import.meta.glob('/src/lib/content/**/*.mdx');
const mdxIndexModules = import.meta.glob('/src/lib/content/**/_index.mdx');


async function loadMdxModule(modulePath: string) {
    if (mdxModules[modulePath] || mdxIndexModules[modulePath]) {
        const moduleLoader = mdxModules[modulePath] || mdxIndexModules[modulePath];
        const loadedModule: any = await moduleLoader();
        return {
            component: loadedModule.default, // The Svelte component
            frontmatter: loadedModule.metadata || {}, // Frontmatter from mdsvex
        };
    }
    throw new Error(`MDX module not found at path: ${modulePath}`);
}

export function getThemes(): Theme[] {
  const themes: Theme[] = [];
  const themeSlugs = new Set<string>();

  // Extract theme slugs from the paths of all MDX modules
  Object.keys(mdxModules).forEach(filePath => {
    // filePath is like '/src/lib/content/theme-slug/course/file.mdx'
    const parts = filePath.replace('/src/lib/content/', '').split('/');
    if (parts.length > 0 && parts[0]) {
      themeSlugs.add(parts[0]);
    }
  });
   Object.keys(mdxIndexModules).forEach(filePath => {
    const parts = filePath.replace('/src/lib/content/', '').split('/');
    if (parts.length > 0 && parts[0]) {
      themeSlugs.add(parts[0]);
    }
  });


  for (const themeSlug of themeSlugs) {
    // To get theme title/description, we need to read its _index.mdx frontmatter
    // This is less efficient than before as it involves a dynamic import or fs read.
    // For now, we'll use fs.readFileSync for simplicity for theme metadata.
    // A more optimized way would be to extract this at build time.
    const themeIndexMdxPathDisk = path.join(process.cwd(), 'src/lib/content', themeSlug, '_index.mdx');
    let title = themeSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    let description;
    let order;

    if (fs.existsSync(themeIndexMdxPathDisk)) {
        const fileContents = fs.readFileSync(themeIndexMdxPathDisk, 'utf8');
        const { data } = matter(fileContents); // Use gray-matter for quick frontmatter read
        if (data.title) title = data.title;
        if (data.description) description = data.description;
        if (data.order) order = data.order;
    }
    
    // Exclude 'courses' and 'exercises' if they are not actual themes
    if (themeSlug !== 'courses' && themeSlug !== 'exercises' && !themeSlug.startsWith('.')) {
        themes.push({ slug: themeSlug, title, description, order });
    }
  }
  return themes.sort((a, b) => (a.order || Infinity) - (b.order || Infinity));
}


export function getAllContentPathsForSvelteKit(): SvelteKitEntryParams[] {
  const entries: SvelteKitEntryParams[] = [];

  Object.keys(mdxModules).forEach(filePath => {
    // filePath is like '/src/lib/content/theme-slug/course/file.mdx'
    // or '/src/lib/content/theme-slug/_index.mdx'
    const relativePath = filePath.replace('/src/lib/content/', ''); // e.g., 'theme/course/file.mdx'
    const parts = relativePath.split('/');
    
    const theme = parts[0];
    if (!theme || theme === 'exercises' || theme === 'courses') return; // Skip if not a valid theme structure

    let courseContentSlug: string | undefined = undefined;

    if (filePath.endsWith('/_index.mdx')) {
        // This is an index file for a theme or a subdirectory (course/module)
        // e.g. /src/lib/content/theme-slug/_index.mdx -> theme, undefined
        // e.g. /src/lib/content/theme-slug/course-slug/_index.mdx -> theme, course-slug
        const slugParts = parts.slice(1, -1); // All parts between theme and _index.mdx
         if (slugParts.length > 0) {
            courseContentSlug = slugParts.join('/');
        }
        // else it's the theme's own _index.mdx, handled by /courses/[theme]/+page.svelte
        // For getAllContentPaths, we only need entries for [...courseContentSlug]
        // or the theme index page itself (which doesn't use courseContentSlug param)
    } else {
        // This is a direct content file, e.g., a lesson
        // e.g. /src/lib/content/theme/course/lesson.mdx -> theme, course/lesson
        const slugParts = parts.slice(1);
        slugParts[slugParts.length - 1] = slugParts[slugParts.length - 1].replace(/\.mdx$/, '');
        courseContentSlug = slugParts.join('/');
    }
    
    // Add entry for the specific content page
    if (courseContentSlug) { // Only add if it's not the theme's root _index.mdx
        entries.push({ theme, courseContentSlug });
    }
    // We also need entries for theme index pages (handled by /courses/[theme]/+page.svelte)
    // The `entries` for SvelteKit's prerendering should list all possible param combinations.
    // Theme index pages are covered by `src/routes/courses/[theme]/+page.server.ts`'s `entries` function.
  });
  
  // Add entries for theme root pages (e.g. /courses/theme-slug)
  // These are implicitly handled by their own +page.server.ts which should have an `entries` function.
  // The `getAllContentPathsForSvelteKit` is primarily for the [...courseContentSlug] route.

  // Deduplicate entries (though the logic above should mostly prevent it)
  const uniqueEntries = Array.from(new Set(entries.map(e => JSON.stringify(e)))).map(s => JSON.parse(s));
  return uniqueEntries;
}


export async function getContentData(themeSlug: string, courseContentSlugString?: string): Promise<MdxContentData> {
  const slugArray = courseContentSlugString ? courseContentSlugString.split('/') : [];
  let moduleVitePath: string; // Path for import.meta.glob, e.g., /src/lib/content/...

  if (courseContentSlugString) {
    // Try direct file path: /src/lib/content/theme/slug/parts.mdx
    moduleVitePath = `/src/lib/content/${themeSlug}/${slugArray.join('/')}.mdx`;
    if (!mdxModules[moduleVitePath]) {
      // Try index file path: /src/lib/content/theme/slug/parts/_index.mdx
      moduleVitePath = `/src/lib/content/${themeSlug}/${slugArray.join('/')}/_index.mdx`;
    }
  } else {
    // Theme index: /src/lib/content/theme/_index.mdx
    moduleVitePath = `/src/lib/content/${themeSlug}/_index.mdx`;
  }
  
  try {
    const loaded = await loadMdxModule(moduleVitePath);
    return {
      id: [themeSlug, ...slugArray].join('-'),
      component: loaded.component,
      frontmatter: loaded.frontmatter,
      ...loaded.frontmatter, // Spread frontmatter for direct access (like before)
    };
  } catch (e) {
    console.error(`Error loading MDX module for theme: ${themeSlug}, slug: ${courseContentSlugString}, tried path: ${moduleVitePath}`, e);
    throw new Error(`Content not found or failed to load for ${themeSlug}/${courseContentSlugString || '(theme index)'}`);
  }
}

// getNavigationHierarchy needs to read frontmatter.
// Using fs.readFileSync with gray-matter is simpler here than full module imports for speed.
function generateNavigationForTheme(currentDiskDirPath: string, themeSlug: string, currentRelativeSlugParts: string[]): NavItem[] {
  const items: NavItem[] = [];
  if (!fs.existsSync(currentDiskDirPath)) return items;

  const entries = fs.readdirSync(currentDiskDirPath, { withFileTypes: true });

  for (const entry of entries) {
    const entryDiskPath = path.join(currentDiskDirPath, entry.name);
    const entrySlugName = entry.name.replace(/\.mdx$/, '');
    const newRelativeSlugParts = [...currentRelativeSlugParts, entrySlugName];
    const fullUrlPath = `/courses/${themeSlug}/${newRelativeSlugParts.join('/')}`;

    if (entry.isDirectory()) {
      const indexMdxDiskPath = path.join(entryDiskPath, '_index.mdx');
      if (fs.existsSync(indexMdxDiskPath)) {
        const fileContents = fs.readFileSync(indexMdxDiskPath, 'utf8');
        const { data } = matter(fileContents);
        items.push({
          title: data.title || entry.name,
          slug: newRelativeSlugParts,
          path: fullUrlPath,
          order: data.order,
          type: data.type || 'course',
          description: data.description,
          children: generateNavigationForTheme(entryDiskPath, themeSlug, newRelativeSlugParts),
        });
      }
    } else if (entry.isFile() && entry.name.endsWith('.mdx') && entry.name !== '_index.mdx') {
      const fileContents = fs.readFileSync(entryDiskPath, 'utf8');
      const { data } = matter(fileContents);
      items.push({
        title: data.title || entrySlugName,
        slug: newRelativeSlugParts,
        path: fullUrlPath,
        order: data.order,
        type: data.type || 'lesson',
        description: data.description,
      });
    }
  }
  return items.sort((a, b) => (a.order || Infinity) - (b.order || Infinity));
}

export function getNavigationHierarchy(themeSlug: string): NavItem[] {
    // For navigation, we still need to scan the file system to understand structure and read frontmatter.
    // Using fs for this is generally fine as it's usually done at build time or infrequently.
    const themeContentDiskDir = path.join(process.cwd(), 'src/lib/content', themeSlug);
    if (!fs.existsSync(themeContentDiskDir)) {
        console.warn(`Theme directory not found for navigation: ${themeContentDiskDir}`);
        return [];
    }
    return generateNavigationForTheme(themeContentDiskDir, themeSlug, []);
}

function resolveChildrenPaths(currentDir: string, children: any[]): string[] {
  return children.map(child => {
    if (child.id.endsWith('_index')) {
      // Subdirectory overview
      const dirName = child.id.replace('_index', '');
      return path.join(currentDir, dirName, '_index.mdx');
    } else {
      // Lesson/content file
      return path.join(currentDir, `${child.id}.mdx`);
    }
  });
}

// Example usage in navigation or lesson discovery:
// const childrenPaths = resolveChildrenPaths(currentDir, children);
// Use these paths to load or list content at each layer.
