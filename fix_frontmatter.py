#!/usr/bin/env python3

import os
import re
import glob

def fix_frontmatter(file_path):
    """Fix double frontmatter blocks in MDX files"""
    print(f"Processing: {file_path}")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Pattern to match double frontmatter blocks
    # Pattern: ---\nfirst block\n---\n---\nsecond block\n---
    pattern = r'^---\n(.*?)\n---\n---\n(.*?)\n---'
    match = re.match(pattern, content, re.DOTALL)
    
    if match:
        first_block = match.group(1).strip()
        second_block = match.group(2).strip()
        remaining_content = content[match.end():]
        
        # Merge the frontmatter blocks
        merged_frontmatter = f"---\n{first_block}\n{second_block}\n---"
        new_content = merged_frontmatter + remaining_content
        
        # Write back to file
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"  ✓ Fixed frontmatter in {file_path}")
        return True
    else:
        print(f"  → No double frontmatter found in {file_path}")
        return False

def main():
    exercises_dir = "/home/linux/learnflow-app/learnflow-app/static/content/exercises"
    
    print("=== FIXING EXERCISE FRONTMATTER BLOCKS ===")
    print(f"Scanning directory: {exercises_dir}")
    
    # Find all .mdx files that are NOT _index.mdx
    pattern = os.path.join(exercises_dir, "**", "*.mdx")
    mdx_files = [f for f in glob.glob(pattern, recursive=True) if not f.endswith('_index.mdx')]
    
    fixed_count = 0
    for file_path in mdx_files:
        if fix_frontmatter(file_path):
            fixed_count += 1
    
    print(f"=== COMPLETED: Fixed {fixed_count} files ===")

if __name__ == "__main__":
    main()
