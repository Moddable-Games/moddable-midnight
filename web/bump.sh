#!/usr/bin/env bash
# Bumps the site version and propagates it everywhere it is shown or used for cache busting:
# the footer (public/data/site.json), the share images' ?v= on every page, and the crew
# page's CSS and JS query strings. The React pages' own assets are hashed by Vite.
#
#   ./bump.sh [major|minor|patch]     (default: patch)
set -euo pipefail
cd "$(dirname "$0")"

part="${1:-patch}"
current="$(tr -d '[:space:]' < version.txt)"
IFS=. read -r major minor patch <<< "$current"
case "$part" in
  major) major=$((major + 1)); minor=0; patch=0 ;;
  minor) minor=$((minor + 1)); patch=0 ;;
  patch) patch=$((patch + 1)) ;;
  *) echo "usage: ./bump.sh [major|minor|patch]" >&2; exit 2 ;;
esac
next="$major.$minor.$patch"

echo "$next" > version.txt
sed -i.bak -E "s/\"version\": \"[0-9]+\.[0-9]+\.[0-9]+\"/\"version\": \"$next\"/" public/data/site.json
for page in index.html treasury.html history.html tournament.html public/city.html; do
  sed -i.bak -E "s/\?v=[0-9]+\.[0-9]+\.[0-9]+/?v=$next/g" "$page"
done
find . -maxdepth 3 -name "*.bak" -not -path "./node_modules/*" -delete
echo "$current -> $next"
