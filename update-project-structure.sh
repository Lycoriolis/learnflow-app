#!/usr/bin/env bash
# Regenerate full project-structure.txt
# Excluding common build/install directories
EXCLUDES="node_modules|.git|dist|.svelte-kit"
# Check for 'tree' utility
if ! command -v tree &> /dev/null; then
  echo "Error: 'tree' is required but not installed. Please install tree and retry."
  exit 1
fi
# Output full directory tree to project-structure.txt
tree -a -I "$EXCLUDES" > project-structure.txt
echo "project-structure.txt updated with full arborescence."