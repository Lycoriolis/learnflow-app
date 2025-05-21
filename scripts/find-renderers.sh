#!/bin/bash

# Find components that import renderer components
echo "Looking for MarkdownRendererComponent.svelte usage..."
grep -r "import MarkdownRenderer" --include="*.svelte" src/

echo -e "\nLooking for ExerciseMarkdown.svelte usage..."
grep -r "import ExerciseMarkdown" --include="*.svelte" src/

echo -e "\nLooking for MathContent.svelte usage..."
grep -r "import MathContent" --include="*.svelte" src/
