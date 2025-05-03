import { readFile } from "fs/promises";
import { join } from "path";
import { marked } from "marked";
import hljs from "highlight.js";
import "./index.js";
marked.setOptions({
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value;
      } catch (e) {
        console.warn("Error highlighting code:", e);
      }
    }
    return code;
  },
  gfm: true,
  // GitHub Flavored Markdown
  breaks: true,
  // Convert line breaks to <br>
  headerIds: true,
  // Add IDs to headers
  mangle: false,
  // Don't mangle header IDs
  sanitize: false,
  // Don't sanitize HTML
  smartLists: true,
  // Use smart list behavior
  smartypants: true,
  // Use smart typography
  xhtml: true
  // Use XHTML-compatible tags
});
const contentCache = {};
const manifestCache = {};
async function loadContentManifest(type) {
  if (manifestCache[type]) {
    return manifestCache[type];
  }
  try {
    const manifestPath = join(process.cwd(), "static", "content", type, "manifest.json");
    const manifestContent = await readFile(manifestPath, "utf-8");
    const manifest = JSON.parse(manifestContent);
    manifestCache[type] = manifest;
    return manifest;
  } catch (error2) {
    console.error(`Error loading manifest for ${type}:`, error2);
    return [];
  }
}
function findNodeByIdentifier(manifest, identifier) {
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
async function getContentNodeByIdentifier(type, identifier) {
  const cacheKey = `${type}:${identifier}`;
  if (contentCache[cacheKey]) {
    return contentCache[cacheKey];
  }
  const manifest = await loadContentManifest(type);
  const node = findNodeByIdentifier(manifest, identifier);
  if (!node) {
    throw new Error(`Content node not found: ${identifier}`);
  }
  let markdownContent = "";
  let contentLoadingError;
  if (node.type === "course" || node.type === "lesson" || node.type === "module") {
    try {
      const contentPath = join(process.cwd(), "static", "content", type, node.path || `${node.id}.md`);
      const content = await readFile(contentPath, "utf-8");
      markdownContent = marked(content);
    } catch (error2) {
      console.error(`Error loading content for ${identifier}:`, error2);
      contentLoadingError = error2 instanceof Error ? error2.message : "Failed to load content";
    }
  }
  const contentNode = {
    ...node,
    markdownContent,
    contentLoadingError
  };
  contentCache[cacheKey] = contentNode;
  return contentNode;
}
async function getContentNodeByPath(type, path) {
  const manifest = await loadContentManifest(type);
  const pathParts = path.split("/").filter(Boolean);
  let currentItems = manifest;
  let currentNode = null;
  for (const part of pathParts) {
    currentNode = currentItems.find((item) => item.id === part || item.slug === part) || null;
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
async function getBreadcrumbs(type, path) {
  const manifest = await loadContentManifest(type);
  const pathParts = path.split("/").filter(Boolean);
  const breadcrumbs = [];
  let currentItems = manifest;
  for (const part of pathParts) {
    const node = currentItems.find((item) => item.id === part || item.slug === part);
    if (node) {
      breadcrumbs.push(node);
      if (node.children) {
        currentItems = node.children;
      }
    }
  }
  return breadcrumbs;
}
async function getAllContentItemsByType(type, itemType) {
  const manifest = await loadContentManifest(type);
  const items = [];
  function collectItems(node) {
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
async function getContentListByCategory(type, categoryIdentifier) {
  const manifest = await loadContentManifest(type);
  const category = findNodeByIdentifier(manifest, categoryIdentifier);
  if (!category || !category.children) {
    return [];
  }
  return category.children;
}
async function getSuggestedContentItems(type, itemType, enrolledIds = []) {
  const manifest = await loadContentManifest(type);
  const items = [];
  function collectItems(node) {
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
export {
  getAllContentItemsByType as a,
  getSuggestedContentItems as b,
  getContentListByCategory as c,
  getBreadcrumbs as d,
  getContentNodeByIdentifier as e,
  getContentNodeByPath as g
};
//# sourceMappingURL=contentService.js.map
