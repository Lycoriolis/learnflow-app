import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const contentDir = path.resolve(process.cwd(), 'static/content');

function addUniqueIdsToMdxFiles(directory: string) {
  const files = fs.readdirSync(directory);

  files.forEach(file => {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      addUniqueIdsToMdxFiles(filePath);
    } else if (file.endsWith('.mdx') && file !== '_index.mdx') {
      const content = fs.readFileSync(filePath, 'utf8');
      const uniqueId = uuidv4();
      const updatedContent = `---\nid: ${uniqueId}\n---\n${content}`;
      fs.writeFileSync(filePath, updatedContent);
      console.log(`Added unique ID to ${filePath}`);
    }
  });
}

addUniqueIdsToMdxFiles(contentDir);