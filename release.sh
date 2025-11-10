#!/bin/sh

# Get version from manifest.json
VERSION=$(grep -o '"version": "[^"]*"' ./src/manifest.json | cut -d'"' -f4)

if [ -z "$VERSION" ]; then
  echo "Error: Could not extract version from manifest.json"
  exit 1
fi

echo "Current version in manifest.json: $VERSION"
echo ""

# Check if there are uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
  echo "Error: You have uncommitted changes. Please commit or stash them first."
  git status --short
  exit 1
fi

# Check if tag already exists
if git rev-parse "v$VERSION" >/dev/null 2>&1; then
  echo "Error: Tag v$VERSION already exists"
  exit 1
fi

# Confirm with user
echo "This will create and push tag: v$VERSION"
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Cancelled"
  exit 0
fi

# Create and push tag
echo "Creating tag v$VERSION..."
git tag "v$VERSION"

echo "Pushing tag to origin..."
git push origin "v$VERSION"

echo ""
echo "Done! Tag v$VERSION has been pushed."
echo "Check: https://github.com/nanocortex/metube-firefox-addon/actions"
