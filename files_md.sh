#!/bin/bash

OUTPUT_FILE="project_code.txt"
> "$OUTPUT_FILE"

# List of directories to exclude
EXCLUDE_DIRS=("node_modules" ".git" "dist" "build" ".next" ".turbo" "coverage" ".vscode")

# Build exclusion options for grep
EXCLUDE_GREP=$(printf "|%s" "${EXCLUDE_DIRS[@]}")
EXCLUDE_GREP=${EXCLUDE_GREP:1} # remove leading |

# Allowed extensions (regex for grep)
EXT_PATTERN='\.(js|jsx|ts|tsx|json|html|css|scss|env|md|txt|yml|yaml)$'

# Find all files, filter with grep
find . -type f 2>/dev/null | grep -E "$EXT_PATTERN" | grep -Ev "$EXCLUDE_GREP" | while read -r file; do
  echo -e "\n\n--- FILE: $file ---\n" >> "$OUTPUT_FILE"
  cat "$file" >> "$OUTPUT_FILE"
done

echo "✅ Code collected in $OUTPUT_FILE"
