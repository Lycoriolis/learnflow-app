#!/bin/bash

# Script to fix double frontmatter blocks in exercise MDX files

EXERCISES_DIR="/home/linux/learnflow-app/learnflow-app/static/content/exercises"

echo "=== FIXING EXERCISE FRONTMATTER BLOCKS ==="
echo "Scanning directory: $EXERCISES_DIR"

# Find all .mdx files that are NOT _index.mdx (those should be fine)
find "$EXERCISES_DIR" -name "*.mdx" -not -name "_index.mdx" | while read -r file; do
    echo "Processing: $file"
    
    # Check if file has double frontmatter pattern
    if grep -q "^---$" "$file" && [ $(grep -c "^---$" "$file") -gt 2 ]; then
        echo "  → Found double frontmatter, fixing..."
        
        # Create backup
        cp "$file" "$file.backup"
        
        # Extract the two frontmatter blocks and content
        # Split on the frontmatter delimiters
        awk '
        BEGIN { 
            state = "before_first"
            id_block = ""
            main_block = ""
            content = ""
        }
        /^---$/ {
            if (state == "before_first") {
                state = "in_first"
                next
            } else if (state == "in_first") {
                state = "between"
                next
            } else if (state == "between") {
                state = "in_second"
                next
            } else if (state == "in_second") {
                state = "after_second"
                next
            }
        }
        {
            if (state == "in_first") {
                id_block = id_block $0 "\n"
            } else if (state == "in_second") {
                main_block = main_block $0 "\n"
            } else if (state == "after_second") {
                content = content $0 "\n"
            }
        }
        END {
            # Merge frontmatter blocks
            print "---"
            printf "%s", id_block
            printf "%s", main_block
            print "---"
            printf "%s", content
        }
        ' "$file" > "$file.tmp"
        
        # Replace original file
        mv "$file.tmp" "$file"
        echo "  ✓ Fixed frontmatter in $file"
    else
        echo "  → Frontmatter OK, skipping"
    fi
done

echo "=== FRONTMATTER FIX COMPLETED ==="
