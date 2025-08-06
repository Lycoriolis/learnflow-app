import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const contentDirectory = path.join(process.cwd(), 'static/content');

// For SvelteKit's entries function, slug should be a single string path
interface SvelteKitEntry {
  slug: string;
}

interface ContentData {
  id: string;
  htmlContent: string;
  [key: string]: any; // For frontmatter properties
}

export interface NavItem {
  title: string;
  slug: string[]; // Keep as array for internal logic and nav building
  path: string; // The full URL path
  order?: number;
  children?: NavItem[];
  type?: string;
}

// REFINED VERSION of getAllContentPaths for SvelteKit entries
const scanDirectoryForSvelteKitEntries = (currentDirPath: string, accumulatedSlugParts: string[], entriesList: SvelteKitEntry[]) => {
  const entries = fs.readdirSync(currentDirPath, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(currentDirPath, entry.name);
    if (entry.isDirectory()) {
      const currentDirSlugParts = [...accumulatedSlugParts, entry.name];
      const indexMdxFile = path.join(entryPath, '_index.mdx'); // Changed from .md to .mdx
      if (fs.existsSync(indexMdxFile)) {
        entriesList.push({ slug: currentDirSlugParts.join('/') });
      }
      scanDirectoryForSvelteKitEntries(entryPath, currentDirSlugParts, entriesList);
    } else if (entry.isFile() && entry.name.endsWith('.mdx') && entry.name !== '_index.mdx') { // Changed from .md to .mdx
      const fileNameWithoutExtension = entry.name.replace(/\.mdx$/, ''); // Changed from .md to .mdx
      const fileSlugParts = [...accumulatedSlugParts, fileNameWithoutExtension];
      entriesList.push({ slug: fileSlugParts.join('/') });
    }
  }
};

export function getAllContentPathsForSvelteKit(): SvelteKitEntry[] {
  const entries: SvelteKitEntry[] = [];
  const topLevelDirs = fs.readdirSync(contentDirectory, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory());

  for (const dir of topLevelDirs) {
    const courseDirPath = path.join(contentDirectory, dir.name);
    const courseSlugParts = [dir.name];

    const courseIndexMdxPath = path.join(courseDirPath, '_index.mdx'); // Changed from .md to .mdx
    if (fs.existsSync(courseIndexMdxPath)) {
      entries.push({ slug: courseSlugParts.join('/') });
    }
    scanDirectoryForSvelteKitEntries(courseDirPath, courseSlugParts, entries);
  }
  return entries;
}

// Modify getContentData to accept a string slug and split it
export async function getContentData(slugString: string): Promise<ContentData> {
  const slugArray = slugString.split('/');
  let fullPath;

  const directFilePath = path.join(contentDirectory, ...slugArray) + '.mdx'; // Changed from .md to .mdx

  if (fs.existsSync(directFilePath)) {
    fullPath = directFilePath;
  } else {
    const indexPath = path.join(contentDirectory, ...slugArray, '_index.mdx'); // Changed from .md to .mdx
    if (fs.existsSync(indexPath)) {
      fullPath = indexPath;
    } else {
      console.error(`Content not found for slug: ${slugString}. Tried direct: ${directFilePath} and index: ${indexPath}`);
      throw new Error(`Content not found for slug: ${slugString}`);
    }
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const htmlContent = processedContent.toString();
  const id = slugArray.join('-');

  return {
    id,
    htmlContent,
    ...matterResult.data,
  };
}

function generateNavigation(dir: string, currentSlugParts: string[] = []): NavItem[] {
  const items: NavItem[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    const entrySlugName = entry.name.replace(/\.mdx$/, ''); // Changed from .md to .mdx
    const newSlugParts = [...currentSlugParts, entrySlugName];

    if (entry.isDirectory()) {
      const indexMdxPath = path.join(entryPath, '_index.mdx'); // Changed from .md to .mdx
      if (fs.existsSync(indexMdxPath)) {
        const fileContents = fs.readFileSync(indexMdxPath, 'utf8');
        const { data } = matter(fileContents);
        items.push({
          title: data.title || entry.name,
          slug: newSlugParts,
          path: `/courses/${newSlugParts.join('/')}`,
          order: data.order,
          type: data.type || 'module',
          children: generateNavigation(entryPath, newSlugParts),
        });
      }
    } else if (entry.isFile() && entry.name.endsWith('.mdx') && entry.name !== '_index.mdx') { // Changed from .md to .mdx
      const fileContents = fs.readFileSync(entryPath, 'utf8');
      const { data } = matter(fileContents);
      items.push({
        title: data.title || entrySlugName,
        slug: newSlugParts,
        path: `/courses/${newSlugParts.join('/')}`,
        order: data.order,
        type: data.type || 'lesson',
      });
    }
  }

  return items.sort((a, b) => (a.order || Infinity) - (b.order || Infinity));
}

export function getNavigationHierarchy(): NavItem[] {
  const topLevelDirs = fs.readdirSync(contentDirectory, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory());
  const hierarchy: NavItem[] = [];

  for (const dir of topLevelDirs) {
    const courseDirPath = path.join(contentDirectory, dir.name);
    const courseIndexMdxPath = path.join(courseDirPath, '_index.mdx'); // Changed from .md to .mdx
    const courseSlug = [dir.name];

    if (fs.existsSync(courseIndexMdxPath)) {
      const fileContents = fs.readFileSync(courseIndexMdxPath, 'utf8');
      const { data } = matter(fileContents);
      hierarchy.push({
        title: data.title || dir.name,
        slug: courseSlug,
        path: `/courses/${courseSlug.join('/')}`,
        order: data.order,
        type: data.type || 'course',
        children: generateNavigation(courseDirPath, courseSlug),
      });
    }
  }
  return hierarchy.sort((a, b) => (a.order || Infinity) - (b.order || Infinity));
}
