import fs from 'fs';
import path from 'path';

const contentDir = path.resolve(process.cwd(), 'static/content');

interface MdxFile {
  path: string;
  id: string;
}

function listMdxFilesForUpload(directory: string): MdxFile[] {
  const files = fs.readdirSync(directory);
  const mdxFiles: MdxFile[] = [];

  files.forEach(file => {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      mdxFiles.push(...listMdxFilesForUpload(filePath));
    } else if (file.endsWith('.mdx') && file !== '_index.mdx') {
      const content = fs.readFileSync(filePath, 'utf8');
      const idMatch = content.match(/id: (.*)/);
      if (idMatch) {
        mdxFiles.push({ path: filePath, id: idMatch[1] });
      }
    }
  });

  return mdxFiles;
}

const mdxFiles = listMdxFilesForUpload(contentDir);
console.log('MDX files with IDs for upload:', mdxFiles);