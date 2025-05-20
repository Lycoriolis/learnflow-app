import { readFile, readdir } from 'fs/promises';
import { join, dirname, basename } from 'path';
import { marked } from 'marked';
import hljs from 'highlight.js';
import type { ContentNode, ContentManifestItem } from '../types/shared';
import { error } from '@sveltejs/kit';

// Configure marked for better markdown rendering
marked.setOptions({
	highlight: function(code: string, lang: string) {
		if (lang && hljs.getLanguage(lang)) {
			try {
				return hljs.highlight(code, { language: lang }).value;
			} catch (e) {
				console.warn('Error highlighting code:', e);
			}
		}
		return code;
	},
	gfm: true, // GitHub Flavored Markdown
	breaks: true, // Convert line breaks to <br>
	headerIds: true, // Add IDs to headers
	mangle: false, // Don't mangle header IDs
	sanitize: true, // Sanitize HTML
	smartLists: true, // Use smart list behavior
	smartypants: true, // Use smart typography
	xhtml: true // Use XHTML-compatible tags
});

// Cache for content nodes
const contentCache: Record<string, ContentNode> = {};
const manifestCache: Record<string, ContentManifestItem[]> = {};

// Raw structure from JSON files might differ
interface RawCourseManifest {
	categories: ContentManifestItem[];
	featuredCourses?: any[]; // Keep other potential top-level keys
	// ... other potential top-level keys
}

interface RawExerciseManifest {
	exercises: ContentManifestItem[];
	categories: ContentManifestItem[];
	featuredExercises?: any[]; // Keep other potential top-level keys
	// ... other potential top-level keys
}

// The structure we *want* after processing
interface ProcessedContentManifest {
	items: ContentManifestItem[];
	// We might store other processed data here if needed
}

/**
 * Loads the content manifest for a given type
 */
async function loadContentManifest(type: string): Promise<ContentManifestItem[]> {
	if (manifestCache[type]) {
		return manifestCache[type];
	}

	try {
		const manifestPath = join(process.cwd(), 'static', 'content', type, 'manifest.json');
		const manifestContent = await readFile(manifestPath, 'utf-8');
		const manifest = JSON.parse(manifestContent);
		manifestCache[type] = manifest;
		return manifest;
	} catch (error) {
		console.error(`Error loading manifest for ${type}:`, error);
		return [];
	}
}

/**
 * Recursively finds a content node by identifier
 */
function findNodeByIdentifier(
	manifest: ContentManifestItem[],
	identifier: string
): ContentManifestItem | null {
	for (const item of manifest) {
		if (item.id === identifier || item.slug === identifier) {
			return item;
		}
		if (item.children) {
			const found = findNodeByIdentifier(item.children, identifier);
			if (found) return found;
		}
	}
	return null;
}

/**
 * Gets a content node by identifier
 */
export async function getContentNodeByIdentifier(
	type: string,
	identifier: string
): Promise<ContentNode> {
	const cacheKey = `${type}:${identifier}`;
	if (contentCache[cacheKey]) {
		return contentCache[cacheKey];
	}

	const manifest = await loadContentManifest(type);
	const node = findNodeByIdentifier(manifest, identifier);

	if (!node) {
		throw new Error(`Content node not found: ${identifier}`);
	}

	// Load markdown content if it's a content node
	let markdownContent = '';
	// contentLoadingError remains on the type for now, but will be undefined if successful
	let contentLoadingError: string | undefined; 

	if (node.type === 'course' || node.type === 'lesson' || node.type === 'module') {
		try {
			const contentPath = join(process.cwd(), 'static', 'content', type, node.path || `${node.id}.md`);
			const content = await readFile(contentPath, 'utf-8');
			markdownContent = marked(content); // Ensure marked() is called *before* potential throw
		} catch (e: any) { // Explicitly type e or use unknown
			console.error(`Error loading or parsing content for ${identifier}:`, e);
			// Re-throw a new error or the original error
			throw error(500, `Failed to load content for ${identifier}: ${e.message}`); // Using SvelteKit's error helper
		}
	}

	const contentNode: ContentNode = {
		...node,
		markdownContent, // contentLoadingError field is no longer needed on ContentNode if we throw
		contentLoadingError // This will be undefined if successful
	};

	contentCache[cacheKey] = contentNode;
	return contentNode;
}

/**
 * Gets content nodes by path
 */
export async function getContentNodeByPath(
	type: string,
	path: string
): Promise<ContentNode | null> {
	const manifest = await loadContentManifest(type);
	const pathParts = path.split('/').filter(Boolean);
	
	let currentItems = manifest;
	let currentNode: ContentManifestItem | null = null;

	for (const part of pathParts) {
		currentNode = currentItems.find(item => item.id === part || item.slug === part) || null;
		if (!currentNode || !currentNode.children) {
			break;
		}
		currentItems = currentNode.children;
	}

	if (!currentNode) {
		return null;
	}

	return getContentNodeByIdentifier(type, currentNode.id);
}

/**
 * Gets breadcrumbs for a content path
 */
export async function getBreadcrumbs(
	type: string,
	path: string
): Promise<ContentManifestItem[]> {
	const manifest = await loadContentManifest(type);
	const pathParts = path.split('/').filter(Boolean);
	const breadcrumbs: ContentManifestItem[] = [];

	let currentItems = manifest;
	for (const part of pathParts) {
		const node = currentItems.find(item => item.id === part || item.slug === part);
		if (node) {
			breadcrumbs.push(node);
			if (node.children) {
				currentItems = node.children;
			}
		}
	}

	return breadcrumbs;
}

/**
 * Gets all content items of a specific type
 */
export async function getAllContentItemsByType(
	type: string,
	itemType: string
): Promise<ContentManifestItem[]> {
	const manifest = await loadContentManifest(type);
	const items: ContentManifestItem[] = [];

	function collectItems(node: ContentManifestItem) {
		if (node.type === itemType) {
			items.push(node);
		}
		if (node.children) {
			node.children.forEach(collectItems);
		}
	}

	manifest.forEach(collectItems);
	return items;
}

/**
 * Gets content list by category
 */
export async function getContentListByCategory(
	type: string,
	categoryIdentifier: string
): Promise<ContentManifestItem[]> {
	const manifest = await loadContentManifest(type);
	const category = findNodeByIdentifier(manifest, categoryIdentifier);

	if (!category || !category.children) {
		return [];
	}

	return category.children;
}

/**
 * Gets suggested content items
 */
export async function getSuggestedContentItems(
	type: string,
	itemType: string,
	enrolledIds: string[] = []
): Promise<ContentManifestItem[]> {
	const manifest = await loadContentManifest(type);
	const items: ContentManifestItem[] = [];

	function collectItems(node: ContentManifestItem) {
		if (node.type === itemType && !enrolledIds.includes(node.id)) {
			items.push(node);
		}
		if (node.children) {
			node.children.forEach(collectItems);
		}
	}

	manifest.forEach(collectItems);
	return items;
}

/**
 * Clears the content cache
 */
export function clearContentCache(): void {
	Object.keys(contentCache).forEach(key => delete contentCache[key]);
	Object.keys(manifestCache).forEach(key => delete manifestCache[key]);
}

// Alias for legacy route imports
export { getContentNodeByIdentifier as loadContent };
export { getContentListByCategory as listContent };
