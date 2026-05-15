#!/bin/bash
if grep -rEn 'text-\[#[0-9A-Fa-f]{3,6}\]|bg-\[#[0-9A-Fa-f]{3,6}\]|border-\[#[0-9A-Fa-f]{3,6}\]' src/ packages/ apps/; then
  echo "Raw hex colors found in className. Use @theme tokens instead."
  exit 1
fi
echo "No raw hex colors in className."
