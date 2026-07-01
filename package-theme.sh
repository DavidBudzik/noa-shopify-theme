#!/usr/bin/env bash
# Build a clean, uploadable theme zip containing ONLY the standard Shopify
# theme directories (strays like ~/, docs/, .claude/, .impeccable.md excluded).
set -euo pipefail
cd "$(dirname "$0")/folio"

echo "Running theme check..."
shopify theme check --fail-level error

VERSION="$(date +%Y%m%d)"
OUT_DIR="../dist"
OUT="folio-theme-${VERSION}.zip"
mkdir -p "$OUT_DIR"
rm -f "$OUT_DIR/$OUT"

zip -r "$OUT_DIR/$OUT" assets config layout locales sections snippets templates \
  -x '*.DS_Store'

echo "Built $OUT_DIR/$OUT"
unzip -l "$OUT_DIR/$OUT" | tail -3
