#!/bin/bash
# Search for deprecated Tailwind v3 utilities in the monorepo.
# Exit 1 if found, 0 if clean.

# Using \b (\b in grep -E) for word boundaries to avoid partial matches.
# This catches the full class name, not just part of a larger string.
# e.g. \boutline-none\b will NOT match "not-outline-none" or "outline-none-0".
DEPRECATED_CLASSES='\bbg-gradient-to-[a-z]+\b|\bonline-none\b|\bflex-shrink-0\b'

if grep -rEn \
  --exclude-dir=.next \
  --exclude-dir=node_modules \
  --exclude-dir=dist \
  --exclude-dir=.turbo \
  --exclude="*.log" \
  "$DEPRECATED_CLASSES" \
  packages/ apps/; then
  echo "Deprecated Tailwind v3 utilities found. Update to v4 names."
  exit 1
fi
echo "No deprecated Tailwind v3 utilities."
