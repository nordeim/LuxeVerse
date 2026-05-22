#!/bin/bash
if grep -rEn --exclude-dir=.next --exclude-dir=node_modules --exclude-dir=dist 'bg-gradient-to-(r|l|t|b)|outline-none[^-]|flex-shrink-0' src/ packages/ apps/; then
  echo "Deprecated Tailwind v3 utilities found. Update to v4 names."
  exit 1
fi
echo "No deprecated Tailwind v3 utilities."
