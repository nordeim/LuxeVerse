#!/bin/bash
# Search for raw hex colors in Tailwind className strings
# Exit 1 if found, 0 if clean

DEPRECATED_HEX='text-\[#[0-9A-Fa-f]{3,6}\]|bg-\[#[0-9A-Fa-f]{3,6}\]|border-\[#[0-9A-Fa-f]{3,6}\]'

if grep -rEn --exclude-dir=.next --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.turbo --exclude="*.log" "$DEPRECATED_HEX" packages/ apps/; then
  echo "Raw hex colors found in className. Use @theme tokens instead."
  exit 1
fi
echo "No raw hex colors in className."
